import 'dart:async';
import 'dart:convert';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import 'package:logging/logging.dart';
import '../utils/constants.dart';
import '../models/sensor_model.dart';

class BluetoothService {
  final _logger = Logger('BluetoothService');
  
  BluetoothDevice? connectedDevice;
  BluetoothCharacteristic? _sensorCharacteristic;
  BluetoothCharacteristic? _controlCharacteristic;
  
  StreamSubscription<List<int>>? _notificationSubscription;
  StreamSubscription<BluetoothConnectionState>? _connectionStateSubscription;

  final _sensorStreamController = StreamController<SensorModel>.broadcast();
  Stream<SensorModel> get sensorStream => _sensorStreamController.stream;

  bool _isConnecting = false;
  bool get isConnected => connectedDevice != null;

  /// Scan for Agarbatti ESP32 BLE Devices
  Stream<List<ScanResult>> scanForDevices() {
    FlutterBluePlus.startScan(timeout: const Duration(seconds: 10));
    return FlutterBluePlus.scanResults;
  }

  /// Connect to ESP32 Machine and set up GATT Characteristics
  Future<bool> connectToMachine(BluetoothDevice device) async {
    if (_isConnecting) return false;
    _isConnecting = true;

    try {
      _logger.info("Attempting BLE connection to ${device.platformName}");
      await device.connect(autoConnect: true, timeout: const Duration(seconds: 15));
      connectedDevice = device;

      // Monitor connection drops & Auto-Reconnect
      _connectionStateSubscription?.cancel();
      _connectionStateSubscription = device.connectionState.listen((state) {
        if (state == BluetoothConnectionState.disconnected) {
          _logger.warning("BLE connection lost! Attempting auto-reconnect...");
          connectedDevice = null;
          _attemptAutoReconnect(device);
        }
      });

      // Discover GATT Services
      final services = await device.discoverServices();
      for (var service in services) {
        if (service.uuid.toString().toLowerCase() == AppConstants.bleServiceUuid.toLowerCase()) {
          for (var char in service.characteristics) {
            if (char.uuid.toString().toLowerCase() == AppConstants.bleSensorCharUuid.toLowerCase()) {
              _sensorCharacteristic = char;
              await _subscribeToSensorNotifications(char, device.remoteId.str);
            } else if (char.uuid.toString().toLowerCase() == AppConstants.bleControlCharUuid.toLowerCase()) {
              _controlCharacteristic = char;
            }
          }
        }
      }

      _isConnecting = false;
      return true;
    } catch (e) {
      _logger.severe("BLE connection failed: $e");
      _isConnecting = false;
      return false;
    }
  }

  Future<void> _subscribeToSensorNotifications(BluetoothCharacteristic char, String machineId) async {
    await char.setNotifyValue(true);
    _notificationSubscription?.cancel();
    _notificationSubscription = char.lastValueStream.listen((value) {
      if (value.isNotEmpty) {
        final payload = utf8.decode(value);
        _logger.info("Received BLE sensor payload: $payload");
        final sensorModel = SensorModel.fromBlePayload(payload, machineId);
        _sensorStreamController.add(sensorModel);
      }
    });
  }

  /// Send Command (Start/Stop/Emergency) to ESP32 via BLE
  Future<bool> sendControlCommand(String commandJson) async {
    if (_controlCharacteristic == null) {
      _logger.warning("Cannot send BLE command - control characteristic not bound");
      return false;
    }
    try {
      final bytes = utf8.encode(commandJson);
      await _controlCharacteristic!.write(bytes, withoutResponse: false);
      _logger.info("Sent BLE command: $commandJson");
      return true;
    } catch (e) {
      _logger.severe("Error sending BLE command: $e");
      return false;
    }
  }

  void _attemptAutoReconnect(BluetoothDevice device) async {
    int attempts = 0;
    while (connectedDevice == null && attempts < 5) {
      attempts++;
      await Future.delayed(Duration(seconds: attempts * 3));
      try {
        await device.connect(timeout: const Duration(seconds: 10));
        connectedDevice = device;
        _logger.info("Auto-reconnected successfully to BLE device");
        break;
      } catch (_) {}
    }
  }

  void disconnect() {
    _notificationSubscription?.cancel();
    _connectionStateSubscription?.cancel();
    connectedDevice?.disconnect();
    connectedDevice = null;
  }
}

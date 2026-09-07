import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_blue_plus/flutter_blue_plus.dart';
import '../services/bluetooth_service.dart';
import '../models/sensor_model.dart';

final bluetoothServiceProvider = Provider((ref) => BluetoothService());

class BluetoothState {
  final bool isConnected;
  final bool isScanning;
  final BluetoothDevice? connectedDevice;
  final List<ScanResult> devices;
  final String? error;

  BluetoothState({
    this.isConnected = false,
    this.isScanning = false,
    this.connectedDevice,
    this.devices = const [],
    this.error,
  });

  BluetoothState copyWith({
    bool? isConnected,
    bool? isScanning,
    BluetoothDevice? connectedDevice,
    List<ScanResult>? devices,
    String? error,
  }) {
    return BluetoothState(
      isConnected: isConnected ?? this.isConnected,
      isScanning: isScanning ?? this.isScanning,
      connectedDevice: connectedDevice ?? this.connectedDevice,
      devices: devices ?? this.devices,
      error: error,
    );
  }
}

class BluetoothNotifier extends StateNotifier<BluetoothState> {
  final BluetoothService _bleService;

  BluetoothNotifier(this._bleService) : super(BluetoothState());

  void scan() {
    state = state.copyWith(isScanning: true, error: null);
    _bleService.scanForDevices().listen((results) {
      state = state.copyWith(devices: results, isScanning: false);
    }, onError: (err) {
      state = state.copyWith(isScanning: false, error: err.toString());
    });
  }

  Future<bool> connect(BluetoothDevice device) async {
    state = state.copyWith(isScanning: false);
    final success = await _bleService.connectToMachine(device);
    if (success) {
      state = state.copyWith(
        isConnected: true,
        connectedDevice: device,
      );
    } else {
      state = state.copyWith(
        isConnected: false,
        error: "Failed to connect to ${device.platformName}",
      );
    }
    return success;
  }

  Future<bool> sendCommand(String commandJson) async {
    return await _bleService.sendControlCommand(commandJson);
  }

  void disconnect() {
    _bleService.disconnect();
    state = BluetoothState();
  }
}

final bluetoothProvider = StateNotifierProvider<BluetoothNotifier, BluetoothState>((ref) {
  final service = ref.watch(bluetoothServiceProvider);
  return BluetoothNotifier(service);
});

final bleSensorStreamProvider = StreamProvider<SensorModel>((ref) {
  final service = ref.watch(bluetoothServiceProvider);
  return service.sensorStream;
});

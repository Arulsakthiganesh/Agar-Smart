class SensorModel {
  final String sensorId;
  final String machineId;
  final double temperature;
  final double humidity;
  final double batteryPercentage;
  final double batteryVoltage;
  final double solarVoltage;
  final double solarWattage;
  final bool smokeDetected;
  final String powerSource;
  final int timestamp;

  SensorModel({
    required this.sensorId,
    required this.machineId,
    required this.temperature,
    required this.humidity,
    required this.batteryPercentage,
    required this.batteryVoltage,
    required this.solarVoltage,
    required this.solarWattage,
    required this.smokeDetected,
    required this.powerSource,
    required this.timestamp,
  });

  factory SensorModel.fromJson(Map<String, dynamic> json) {
    return SensorModel(
      sensorId: json['sensorId'] ?? '',
      machineId: json['machineId'] ?? '',
      temperature: (json['temperature'] as num?)?.toDouble() ?? 0.0,
      humidity: (json['humidity'] as num?)?.toDouble() ?? 0.0,
      batteryPercentage: (json['batteryPercentage'] as num?)?.toDouble() ?? 0.0,
      batteryVoltage: (json['batteryVoltage'] as num?)?.toDouble() ?? 0.0,
      solarVoltage: (json['solarVoltage'] as num?)?.toDouble() ?? 0.0,
      solarWattage: (json['solarWattage'] as num?)?.toDouble() ?? 0.0,
      smokeDetected: json['smokeDetected'] ?? false,
      powerSource: json['powerSource'] ?? 'Solar',
      timestamp: json['timestamp'] ?? DateTime.now().millisecondsSinceEpoch,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'sensorId': sensorId,
      'machineId': machineId,
      'temperature': temperature,
      'humidity': humidity,
      'batteryPercentage': batteryPercentage,
      'batteryVoltage': batteryVoltage,
      'solarVoltage': solarVoltage,
      'solarWattage': solarWattage,
      'smokeDetected': smokeDetected,
      'powerSource': powerSource,
      'timestamp': timestamp,
    };
  }

  // Factory constructor to parse raw BLE JSON or CSV payload string from ESP32
  factory SensorModel.fromBlePayload(String payload, String machineId) {
    try {
      // Example payload format: "TEMP:38.5,HUM:24.0,BAT:88,BATV:25.4,SOLV:34.2,SOLW:180,SMK:0,PWR:Solar"
      final map = <String, String>{};
      final parts = payload.split(',');
      for (var p in parts) {
        final kv = p.split(':');
        if (kv.length == 2) {
          map[kv[0].trim()] = kv[1].trim();
        }
      }
      return SensorModel(
        sensorId: 'ble_${DateTime.now().millisecondsSinceEpoch}',
        machineId: machineId,
        temperature: double.tryParse(map['TEMP'] ?? '0') ?? 35.0,
        humidity: double.tryParse(map['HUM'] ?? '0') ?? 30.0,
        batteryPercentage: double.tryParse(map['BAT'] ?? '0') ?? 85.0,
        batteryVoltage: double.tryParse(map['BATV'] ?? '0') ?? 24.5,
        solarVoltage: double.tryParse(map['SOLV'] ?? '0') ?? 32.0,
        solarWattage: double.tryParse(map['SOLW'] ?? '0') ?? 150.0,
        smokeDetected: (map['SMK'] ?? '0') == '1',
        powerSource: map['PWR'] ?? 'Solar',
        timestamp: DateTime.now().millisecondsSinceEpoch,
      );
    } catch (_) {
      return SensorModel(
        sensorId: 'ble_${DateTime.now().millisecondsSinceEpoch}',
        machineId: machineId,
        temperature: 36.5,
        humidity: 28.0,
        batteryPercentage: 90.0,
        batteryVoltage: 25.2,
        solarVoltage: 34.0,
        solarWattage: 175.0,
        smokeDetected: false,
        powerSource: 'Solar',
        timestamp: DateTime.now().millisecondsSinceEpoch,
      );
    }
  }
}

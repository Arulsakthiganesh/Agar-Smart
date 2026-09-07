class AppConstants {
  static const String apiBaseUrl = 'http://10.0.2.2:5000/api'; // Android Emulator default host or local server

  // BLE GATT UUIDs for ESP32 Agarbatti Machine
  static const String bleServiceUuid = "4fa8c001-1234-5678-b5a3-f393d6985430";
  static const String bleSensorCharUuid = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
  static const String bleControlCharUuid = "8ec90001-f315-4f60-9fb8-838830daea50";
  static const String bleBatteryCharUuid = "00002a19-0000-1000-8000-00805f9b34fb";

  static const String deviceNamePrefix = "Agarbatti";

  // Safety Boundaries
  static const double maxTemperatureCelsius = 60.0;
  static const double minTemperatureCelsius = 20.0;
  static const double maxHumidityPercentage = 100.0;
  static const double minBatteryPercentage = 20.0;
}

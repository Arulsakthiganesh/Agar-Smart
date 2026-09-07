import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
import '../models/sensor_model.dart';

class LocalDbService {
  static Database? _database;

  Future<Database> get database async {
    if (_database != null) return _database!;
    _database = await _initDb();
    return _database!;
  }

  Future<Database> _initDb() async {
    final dbPath = await getDatabasesPath();
    final path = join(dbPath, 'agarbatti_offline.db');

    return await openDatabase(
      path,
      version: 1,
      onCreate: (db, version) async {
        await db.execute('''
          CREATE TABLE pending_sensors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sensorId TEXT,
            machineId TEXT,
            temperature REAL,
            humidity REAL,
            batteryPercentage REAL,
            batteryVoltage REAL,
            solarVoltage REAL,
            solarWattage REAL,
            smokeDetected INTEGER,
            powerSource TEXT,
            timestamp INTEGER
          )
        ''');

        await db.execute('''
          CREATE TABLE offline_alerts (
            alertId TEXT PRIMARY KEY,
            machineId TEXT,
            type TEXT,
            category TEXT,
            message TEXT,
            severity TEXT,
            createdAt INTEGER
          )
        ''');
      },
    );
  }

  /// Queue a sensor telemetry reading offline
  Future<int> queueOfflineSensor(SensorModel sensor) async {
    final db = await database;
    return await db.insert('pending_sensors', {
      'sensorId': sensor.sensorId,
      'machineId': sensor.machineId,
      'temperature': sensor.temperature,
      'humidity': sensor.humidity,
      'batteryPercentage': sensor.batteryPercentage,
      'batteryVoltage': sensor.batteryVoltage,
      'solarVoltage': sensor.solarVoltage,
      'solarWattage': sensor.solarWattage,
      'smokeDetected': sensor.smokeDetected ? 1 : 0,
      'powerSource': sensor.powerSource,
      'timestamp': sensor.timestamp,
    });
  }

  /// Retrieve all pending offline sensor records
  Future<List<SensorModel>> getPendingOfflineSensors() async {
    final db = await database;
    final maps = await db.query('pending_sensors');
    return maps.map((map) {
      return SensorModel(
        sensorId: map['sensorId'] as String,
        machineId: map['machineId'] as String,
        temperature: map['temperature'] as double,
        humidity: map['humidity'] as double,
        batteryPercentage: map['batteryPercentage'] as double,
        batteryVoltage: map['batteryVoltage'] as double,
        solarVoltage: map['solarVoltage'] as double,
        solarWattage: map['solarWattage'] as double,
        smokeDetected: (map['smokeDetected'] as int) == 1,
        powerSource: map['powerSource'] as String,
        timestamp: map['timestamp'] as int,
      );
    }).toList();
  }

  /// Clear pending records after successful sync to server
  Future<void> clearSyncedSensors(List<int> ids) async {
    final db = await database;
    await db.delete('pending_sensors');
  }

  Future<int> getPendingCount() async {
    final db = await database;
    final count = Sqflite.firstIntValue(await db.rawQuery('SELECT COUNT(*) FROM pending_sensors'));
    return count ?? 0;
  }
}

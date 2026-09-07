import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_database/firebase_database.dart';
import '../models/sensor_model.dart';
import '../models/cycle_model.dart';
import '../models/alert_model.dart';

class FirebaseService {
  FirebaseDatabase? _db;

  Future<void> initialize() async {
    try {
      await Firebase.initializeApp();
      _db = FirebaseDatabase.instance;
    } catch (_) {
      // Handles uninitialized Firebase gracefully in offline / dev mode
    }
  }

  /// Listen to real-time sensor stream from Firebase `/sensors/{machineId}/latest`
  Stream<SensorModel?> listenToSensor(String machineId) {
    if (_db == null) return const Stream.empty();
    return _db!.ref('sensors/$machineId/latest').onValue.map((event) {
      if (event.snapshot.value != null) {
        final map = Map<String, dynamic>.from(event.snapshot.value as Map);
        return SensorModel.fromJson(map);
      }
      return null;
    });
  }

  /// Listen to cycle progress from Firebase `/cycles/{cycleId}`
  Stream<CycleModel?> listenToCycle(String cycleId) {
    if (_db == null) return const Stream.empty();
    return _db!.ref('cycles/$cycleId').onValue.map((event) {
      if (event.snapshot.value != null) {
        final map = Map<String, dynamic>.from(event.snapshot.value as Map);
        return CycleModel.fromJson(map);
      }
      return null;
    });
  }

  /// Listen to active alerts from Firebase `/alerts/{machineId}/active`
  Stream<List<AlertModel>> listenToAlerts(String machineId) {
    if (_db == null) return const Stream.empty();
    return _db!.ref('alerts/$machineId/active').onValue.map((event) {
      if (event.snapshot.value != null) {
        final rawMap = Map<String, dynamic>.from(event.snapshot.value as Map);
        final list = <AlertModel>[];
        rawMap.forEach((key, val) {
          list.add(AlertModel.fromJson(Map<String, dynamic>.from(val as Map)));
        });
        return list;
      }
      return [];
    });
  }
}

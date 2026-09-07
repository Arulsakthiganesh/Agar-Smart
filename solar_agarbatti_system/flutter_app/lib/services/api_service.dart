import 'package:dio/dio.dart';
import '../utils/constants.dart';
import '../models/sensor_model.dart';
import '../models/cycle_model.dart';
import '../models/alert_model.dart';
import '../models/user_model.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(
    baseUrl: AppConstants.apiBaseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 10),
  ));

  String? _authToken;

  void setAuthToken(String token) {
    _authToken = token;
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  // AUTH
  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _dio.post('/auth/login', data: {'email': email, 'password': password});
    if (res.data['success'] == true && res.data['token'] != null) {
      setAuthToken(res.data['token']);
    }
    return res.data;
  }

  Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    final res = await _dio.post('/auth/register', data: userData);
    if (res.data['success'] == true && res.data['token'] != null) {
      setAuthToken(res.data['token']);
    }
    return res.data;
  }

  // SENSORS
  Future<bool> sendSensorUpdate(SensorModel sensor) async {
    try {
      final res = await _dio.post('/sensors/update', data: sensor.toJson());
      return res.data['success'] == true;
    } catch (_) {
      return false; // Triggers offline fallback in SQLite
    }
  }

  // CONTROL
  Future<bool> startDryingCommand(String machineId, double targetTemp) async {
    try {
      final res = await _dio.post('/control/start-drying', data: {
        'machineId': machineId,
        'targetTemp': targetTemp,
      });
      return res.data['success'] == true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> stopCommand(String machineId) async {
    try {
      final res = await _dio.post('/control/stop', data: {'machineId': machineId});
      return res.data['success'] == true;
    } catch (_) {
      return false;
    }
  }

  Future<bool> emergencyShutdown(String machineId, String reason) async {
    try {
      final res = await _dio.post('/control/emergency-shutdown', data: {
        'machineId': machineId,
        'reason': reason,
      });
      return res.data['success'] == true;
    } catch (_) {
      return false;
    }
  }

  // ALERTS
  Future<List<AlertModel>> fetchPendingAlerts(String machineId) async {
    try {
      final res = await _dio.get('/alerts/$machineId/pending');
      if (res.data['success'] == true && res.data['alerts'] != null) {
        final list = res.data['alerts'] as List;
        return list.map((item) => AlertModel.fromJson(item)).toList();
      }
    } catch (_) {}
    return [];
  }

  Future<bool> acknowledgeAlert(String alertId) async {
    try {
      final res = await _dio.post('/alerts/$alertId/acknowledge');
      return res.data['success'] == true;
    } catch (_) {
      return false;
    }
  }

  // ANALYTICS
  Future<Map<String, dynamic>> fetchDailyAnalytics(String machineId) async {
    try {
      final res = await _dio.get('/analytics/$machineId/daily');
      return res.data['analytics'] ?? {};
    } catch (_) {
      return {};
    }
  }

  Future<Map<String, dynamic>> fetchTrendsAnalytics(String machineId) async {
    try {
      final res = await _dio.get('/analytics/$machineId/trends');
      return res.data['trends'] ?? {};
    } catch (_) {
      return {};
    }
  }
}

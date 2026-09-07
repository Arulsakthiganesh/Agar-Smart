import 'package:flutter_local_notifications/flutter_local_notifications.dart';

class NotificationService {
  final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();

  Future<void> init() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings();
    const initSettings = InitializationSettings(android: androidSettings, iOS: iosSettings);

    await _notificationsPlugin.initialize(initSettings);
  }

  Future<void> showAlertNotification({
    required int id,
    required String title,
    required String body,
    bool isCritical = false,
  }) async {
    final androidDetails = AndroidNotificationDetails(
      isCritical ? 'critical_alerts_channel' : 'general_alerts_channel',
      isCritical ? 'Critical Safety Alerts' : 'General Notifications',
      importance: isCritical ? Importance.max : Importance.defaultImportance,
      priority: isCritical ? Priority.high : Priority.defaultPriority,
      playSound: true,
      enableVibration: true,
    );

    final details = NotificationDetails(android: androidDetails, iOS: const DarwinNotificationDetails());
    await _notificationsPlugin.show(id, title, body, details);
  }
}

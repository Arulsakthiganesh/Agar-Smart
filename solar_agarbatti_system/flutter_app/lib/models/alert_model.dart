class AlertModel {
  final String alertId;
  final String machineId;
  final String type;
  final String category; // Temperature, Humidity, Smoke, Battery, System
  final String message;
  final String severity; // critical, warning, info
  final bool acknowledged;
  final int createdAt;

  AlertModel({
    required this.alertId,
    required this.machineId,
    required this.type,
    required this.category,
    required this.message,
    required this.severity,
    this.acknowledged = false,
    required this.createdAt,
  });

  factory AlertModel.fromJson(Map<String, dynamic> json) {
    return AlertModel(
      alertId: json['alertId'] ?? '',
      machineId: json['machineId'] ?? '',
      type: json['type'] ?? 'SYSTEM_ALERT',
      category: json['category'] ?? 'System',
      message: json['message'] ?? '',
      severity: json['severity'] ?? 'info',
      acknowledged: json['acknowledged'] ?? false,
      createdAt: json['createdAt'] ?? DateTime.now().millisecondsSinceEpoch,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'alertId': alertId,
      'machineId': machineId,
      'type': type,
      'category': category,
      'message': message,
      'severity': severity,
      'acknowledged': acknowledged,
      'createdAt': createdAt,
    };
  }
}

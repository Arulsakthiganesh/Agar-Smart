class CycleModel {
  final String cycleId;
  final String machineId;
  final String stage; // Drying, Cooling, Fragrance, Packing
  final int progress; // 0 to 100
  final int timeRemainingMinutes;
  final String status; // RUNNING, PAUSED, COMPLETED
  final double targetTemp;
  final double targetHumidity;
  final int startTime;
  final int? endTime;
  final int? packetsProduced;
  final double? qualityScore;

  CycleModel({
    required this.cycleId,
    required this.machineId,
    required this.stage,
    required this.progress,
    required this.timeRemainingMinutes,
    required this.status,
    required this.targetTemp,
    required this.targetHumidity,
    required this.startTime,
    this.endTime,
    this.packetsProduced,
    this.qualityScore,
  });

  factory CycleModel.fromJson(Map<String, dynamic> json) {
    return CycleModel(
      cycleId: json['cycleId'] ?? '',
      machineId: json['machineId'] ?? '',
      stage: json['stage'] ?? 'Drying',
      progress: json['progress'] ?? 0,
      timeRemainingMinutes: json['timeRemainingMinutes'] ?? json['timeRemaining'] ?? 0,
      status: json['status'] ?? 'RUNNING',
      targetTemp: (json['metrics']?['targetTemp'] ?? json['targetTemp'] as num?)?.toDouble() ?? 45.0,
      targetHumidity: (json['metrics']?['targetHumidity'] ?? json['targetHumidity'] as num?)?.toDouble() ?? 20.0,
      startTime: json['startTime'] ?? json['metrics']?['startTime'] ?? DateTime.now().millisecondsSinceEpoch,
      endTime: json['endTime'] ?? json['metrics']?['endTime'],
      packetsProduced: json['packetsProduced'],
      qualityScore: (json['qualityScore'] as num?)?.toDouble(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'cycleId': cycleId,
      'machineId': machineId,
      'stage': stage,
      'progress': progress,
      'timeRemainingMinutes': timeRemainingMinutes,
      'status': status,
      'targetTemp': targetTemp,
      'targetHumidity': targetHumidity,
      'startTime': startTime,
      'endTime': endTime,
      'packetsProduced': packetsProduced,
      'qualityScore': qualityScore,
    };
  }
}

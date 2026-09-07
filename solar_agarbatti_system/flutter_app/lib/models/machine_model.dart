class MachineModel {
  final String machineId;
  final String name;
  final String status; // ACTIVE, IDLE, ERROR
  final String location;
  final int lastUpdate;
  final String? currentCycle;

  MachineModel({
    required this.machineId,
    required this.name,
    required this.status,
    required this.location,
    required this.lastUpdate,
    this.currentCycle,
  });

  factory MachineModel.fromJson(Map<String, dynamic> json) {
    return MachineModel(
      machineId: json['machineId'] ?? '',
      name: json['name'] ?? json['machineName'] ?? 'Solar Dryer',
      status: json['status'] ?? 'ACTIVE',
      location: json['location'] ?? 'Village SHG Center',
      lastUpdate: json['lastUpdate'] ?? DateTime.now().millisecondsSinceEpoch,
      currentCycle: json['currentCycle'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'machineId': machineId,
      'name': name,
      'status': status,
      'location': location,
      'lastUpdate': lastUpdate,
      'currentCycle': currentCycle,
    };
  }
}

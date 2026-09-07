import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/cycle_model.dart';
import 'auth_provider.dart';

class CycleState {
  final CycleModel? activeCycle;
  final bool isRunning;
  final String currentStage; // Drying, Cooling, Fragrance, Packing
  final double targetTemp;
  final double targetHumidity;

  CycleState({
    this.activeCycle,
    this.isRunning = false,
    this.currentStage = 'Drying',
    this.targetTemp = 45.0,
    this.targetHumidity = 20.0,
  });

  CycleState copyWith({
    CycleModel? activeCycle,
    bool? isRunning,
    String? currentStage,
    double? targetTemp,
    double? targetHumidity,
  }) {
    return CycleState(
      activeCycle: activeCycle ?? this.activeCycle,
      isRunning: isRunning ?? this.isRunning,
      currentStage: currentStage ?? this.currentStage,
      targetTemp: targetTemp ?? this.targetTemp,
      targetHumidity: targetHumidity ?? this.targetHumidity,
    );
  }
}

class CycleNotifier extends StateNotifier<CycleState> {
  final Ref _ref;

  CycleNotifier(this._ref) : super(CycleState());

  void setTargets(double temp, double humidity) {
    state = state.copyWith(targetTemp: temp, targetHumidity: humidity);
  }

  Future<bool> startCycle(String machineId) async {
    final api = _ref.read(apiServiceProvider);
    final success = await api.startDryingCommand(machineId, state.targetTemp);
    if (success) {
      final newCycle = CycleModel(
        cycleId: 'cyc_${DateTime.now().millisecondsSinceEpoch}',
        machineId: machineId,
        stage: 'Drying',
        progress: 5,
        timeRemainingMinutes: 45,
        status: 'RUNNING',
        targetTemp: state.targetTemp,
        targetHumidity: state.targetHumidity,
        startTime: DateTime.now().millisecondsSinceEpoch,
      );
      state = state.copyWith(
        activeCycle: newCycle,
        isRunning: true,
        currentStage: 'Drying',
      );
    }
    return success;
  }

  Future<bool> stopCycle(String machineId) async {
    final api = _ref.read(apiServiceProvider);
    final success = await api.stopCommand(machineId);
    if (success) {
      state = state.copyWith(isRunning: false);
    }
    return success;
  }

  Future<bool> emergencyStop(String machineId, String reason) async {
    final api = _ref.read(apiServiceProvider);
    final success = await api.emergencyShutdown(machineId, reason);
    if (success) {
      state = state.copyWith(isRunning: false);
    }
    return success;
  }
}

final cycleProvider = StateNotifierProvider<CycleNotifier, CycleState>((ref) {
  return CycleNotifier(ref);
});

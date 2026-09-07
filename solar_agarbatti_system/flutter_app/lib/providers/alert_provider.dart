import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/alert_model.dart';
import 'auth_provider.dart';

class AlertState {
  final List<AlertModel> activeAlerts;
  final String filterSeverity; // 'all', 'critical', 'warning', 'info'

  AlertState({
    this.activeAlerts = const [],
    this.filterSeverity = 'all',
  });

  AlertState copyWith({
    List<AlertModel>? activeAlerts,
    String? filterSeverity,
  }) {
    return AlertState(
      activeAlerts: activeAlerts ?? this.activeAlerts,
      filterSeverity: filterSeverity ?? this.filterSeverity,
    );
  }
}

class AlertNotifier extends StateNotifier<AlertState> {
  final Ref _ref;

  AlertNotifier(this._ref) : super(AlertState());

  void setFilter(String severity) {
    state = state.copyWith(filterSeverity: severity);
  }

  Future<void> fetchAlerts(String machineId) async {
    final api = _ref.read(apiServiceProvider);
    final alerts = await api.fetchPendingAlerts(machineId);
    state = state.copyWith(activeAlerts: alerts);
  }

  Future<bool> acknowledge(String alertId) async {
    final api = _ref.read(apiServiceProvider);
    final success = await api.acknowledgeAlert(alertId);
    if (success) {
      final updated = state.activeAlerts.where((a) => a.alertId != alertId).toList();
      state = state.copyWith(activeAlerts: updated);
    }
    return success;
  }
}

final alertProvider = StateNotifierProvider<AlertNotifier, AlertState>((ref) {
  return AlertNotifier(ref);
});

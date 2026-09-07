import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/local_db_service.dart';
import 'auth_provider.dart';

final localDbServiceProvider = Provider((ref) => LocalDbService());

class SyncState {
  final bool isOffline;
  final int pendingRecordCount;
  final bool isSyncing;

  SyncState({
    this.isOffline = false,
    this.pendingRecordCount = 0,
    this.isSyncing = false,
  });

  SyncState copyWith({
    bool? isOffline,
    int? pendingRecordCount,
    bool? isSyncing,
  }) {
    return SyncState(
      isOffline: isOffline ?? this.isOffline,
      pendingRecordCount: pendingRecordCount ?? this.pendingRecordCount,
      isSyncing: isSyncing ?? this.isSyncing,
    );
  }
}

class SyncNotifier extends StateNotifier<SyncState> {
  final Ref _ref;

  SyncNotifier(this._ref) : super(SyncState());

  Future<void> checkPendingCount() async {
    final localDb = _ref.read(localDbServiceProvider);
    final count = await localDb.getPendingCount();
    state = state.copyWith(pendingRecordCount: count);
  }

  Future<void> syncOfflineData() async {
    state = state.copyWith(isSyncing: true);
    final localDb = _ref.read(localDbServiceProvider);
    final api = _ref.read(apiServiceProvider);

    final pendingSensors = await localDb.getPendingOfflineSensors();
    for (var sensor in pendingSensors) {
      await api.sendSensorUpdate(sensor);
    }
    await localDb.clearSyncedSensors([]);
    
    state = state.copyWith(isSyncing: false, pendingRecordCount: 0);
  }
}

final syncProvider = StateNotifierProvider<SyncNotifier, SyncState>((ref) {
  return SyncNotifier(ref);
});

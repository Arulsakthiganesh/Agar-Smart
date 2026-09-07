import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/sync_provider.dart';
import '../../utils/colors.dart';

class OfflineSyncScreen extends ConsumerWidget {
  const OfflineSyncScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final syncState = ref.watch(syncProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Offline SQLite Database'),
        backgroundColor: AppColors.primaryOrange,
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Icon(Icons.storage_rounded, size: 80, color: AppColors.primaryOrange),
            const SizedBox(height: 16),
            const Text(
              'SQLite Offline Queue Manager',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'When internet connectivity is lost in rural areas, sensor readings are buffered locally in SQLite and synchronized automatically once back online.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 16, color: Colors.grey),
            ),
            const SizedBox(height: 32),

            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text('Pending Records:', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    Text(
                      '${syncState.pendingRecordCount}',
                      style: const TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: AppColors.primaryOrange),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.activeGreen,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
              ),
              icon: syncState.isSyncing
                  ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Icon(Icons.sync_rounded, size: 28),
              label: Text(
                syncState.isSyncing ? 'SYNCING TO CLOUD...' : 'SYNC ALL PENDING DATA NOW',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
              onPressed: syncState.isSyncing
                  ? null
                  : () async {
                      await ref.read(syncProvider.notifier).syncOfflineData();
                      if (context.mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Offline data synchronized successfully!')),
                        );
                      }
                    },
            ),
          ],
        ),
      ),
    );
  }
}

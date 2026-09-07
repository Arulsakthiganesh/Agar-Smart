import 'package:flutter/material.dart';

class OfflineBanner extends StatelessWidget {
  final int pendingCount;
  final VoidCallback onSyncTap;

  const OfflineBanner({
    Key? key,
    required this.pendingCount,
    required this.onSyncTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.orange.shade900,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Row(
        children: [
          const Icon(Icons.wifi_off_rounded, color: Colors.white, size: 20),
          const SizedBox(width: 8),
          Expanded(
            child: Text(
              'Offline Mode: $pendingCount readings stored in SQLite database',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
            ),
          ),
          InkWell(
            onTap: onSyncTap,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Text(
                'Sync Now',
                style: TextStyle(color: Colors.black, fontWeight: FontWeight.bold, fontSize: 12),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

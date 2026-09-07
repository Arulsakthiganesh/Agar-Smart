import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../providers/bluetooth_provider.dart';
import '../../providers/sync_provider.dart';
import '../../utils/colors.dart';
import '../offline/offline_sync_screen.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  String _language = 'en';
  bool _darkMode = true;
  bool _notificationSound = true;
  double _maxTempThreshold = 60.0;
  double _minBatteryThreshold = 20.0;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final user = authState.user;
    final bleState = ref.watch(bluetoothProvider);
    final syncState = ref.watch(syncProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings & Configuration'),
        backgroundColor: AppColors.primaryOrange,
        foregroundColor: Colors.white,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // User Profile Section
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: ListTile(
              leading: const CircleAvatar(
                backgroundColor: AppColors.primaryOrange,
                radius: 28,
                child: Icon(Icons.person, color: Colors.white, size: 32),
              ),
              title: Text(user?.name ?? 'Lakshmi Devi', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              subtitle: Text('${user?.shgName ?? 'Annai SHG'} • ${user?.location ?? 'Madurai Hub'}', style: const TextStyle(fontSize: 14)),
              trailing: const Icon(Icons.verified, color: AppColors.activeGreen),
            ),
          ),

          const SizedBox(height: 16),

          // Regional Language Selector
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: ListTile(
              leading: const Icon(Icons.language, color: AppColors.primaryOrange, size: 28),
              title: const Text('App Language', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('English / தமிழ் / हिंदी'),
              trailing: DropdownButton<String>(
                value: _language,
                items: const [
                  DropdownMenuItem(value: 'en', child: Text('English')),
                  DropdownMenuItem(value: 'ta', child: Text('தமிழ்')),
                  DropdownMenuItem(value: 'hi', child: Text('हिंदी')),
                ],
                onChanged: (val) {
                  if (val != null) setState(() => _language = val);
                },
              ),
            ),
          ),

          const SizedBox(height: 8),

          // Dark Mode & Sound Toggles
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Column(
              children: [
                SwitchListTile(
                  secondary: const Icon(Icons.dark_mode_rounded, color: AppColors.primaryOrange),
                  title: const Text('Night / Dark Mode Theme', style: TextStyle(fontWeight: FontWeight.bold)),
                  value: _darkMode,
                  onChanged: (val) => setState(() => _darkMode = val),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  secondary: const Icon(Icons.volume_up_rounded, color: AppColors.primaryOrange),
                  title: const Text('Audio Notification Chime', style: TextStyle(fontWeight: FontWeight.bold)),
                  value: _notificationSound,
                  onChanged: (val) => setState(() => _notificationSound = val),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Alert Threshold Settings
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Safety Threshold Settings', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Max Chamber Temp Limit:'),
                      Text('${_maxTempThreshold.toInt()}°C', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.errorRed)),
                    ],
                  ),
                  Slider(
                    value: _maxTempThreshold,
                    min: 50.0,
                    max: 60.0,
                    onChanged: (v) => setState(() => _maxTempThreshold = v),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Low Battery Alarm Limit:'),
                      Text('${_minBatteryThreshold.toInt()}%', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.warningOrange)),
                    ],
                  ),
                  Slider(
                    value: _minBatteryThreshold,
                    min: 10.0,
                    max: 30.0,
                    onChanged: (v) => setState(() => _minBatteryThreshold = v),
                  ),
                ],
              ),
            ),
          ),

          const SizedBox(height: 16),

          // BLE Device Binding
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: ListTile(
              leading: const Icon(Icons.bluetooth_searching, color: AppColors.infoBlue),
              title: const Text('Paired BLE Agarbatti Machines'),
              subtitle: Text(bleState.connectedDevice?.platformName ?? 'Scanning for ESP32 hardware...'),
              trailing: ElevatedButton(
                onPressed: () => ref.read(bluetoothProvider.notifier).scan(),
                child: const Text('Scan BLE'),
              ),
            ),
          ),

          const SizedBox(height: 8),

          // Offline Sync Manager Link
          Card(
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: ListTile(
              leading: const Icon(Icons.sd_card_rounded, color: AppColors.activeGreen),
              title: const Text('Offline SQLite Database Queue'),
              subtitle: Text('${syncState.pendingRecordCount} records queued'),
              trailing: const Icon(Icons.chevron_right),
              onTap: () {
                Navigator.push(context, MaterialPageRoute(builder: (_) => const OfflineSyncScreen()));
              },
            ),
          ),

          const SizedBox(height: 24),

          // Logout Button
          ElevatedButton.icon(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.errorRed,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
            ),
            icon: const Icon(Icons.logout),
            label: const Text('LOG OUT ACCOUNT', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            onPressed: () {
              ref.read(authProvider.notifier).logout();
              Navigator.pop(context);
            },
          ),
        ],
      ),
    );
  }
}

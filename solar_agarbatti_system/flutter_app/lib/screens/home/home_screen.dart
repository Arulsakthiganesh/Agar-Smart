import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/intl.dart';
import '../../providers/sensor_provider.dart';
import '../../providers/cycle_provider.dart';
import '../../providers/alert_provider.dart';
import '../../providers/bluetooth_provider.dart';
import '../../providers/sync_provider.dart';
import '../../utils/colors.dart';
import '../../widgets/temperature_gauge.dart';
import '../../widgets/humidity_gauge.dart';
import '../../widgets/battery_indicator.dart';
import '../../widgets/stage_indicator.dart';
import '../../widgets/alert_banner.dart';
import '../../widgets/offline_banner.dart';
import '../monitoring/real_time_screen.dart';
import '../monitoring/graphs_screen.dart';
import '../control/control_screen.dart';
import '../alerts/alerts_screen.dart';
import '../settings/settings_screen.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sensorState = ref.watch(sensorProvider);
    final cycleState = ref.watch(cycleProvider);
    final alertState = ref.watch(alertProvider);
    final bleState = ref.watch(bluetoothProvider);
    final syncState = ref.watch(syncProvider);

    final sensor = sensorState.latestSensor;
    final lastUpdated = DateFormat('hh:mm:ss a').format(DateTime.fromMillisecondsSinceEpoch(sensor.timestamp));

    return Scaffold(
      appBar: AppBar(
        title: const Text('Solar Agarbatti Hub', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: AppColors.primaryOrange,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: Icon(
              bleState.isConnected ? Icons.bluetooth_connected : Icons.bluetooth_disabled,
              color: bleState.isConnected ? Colors.lightGreenAccent : Colors.white60,
              size: 28,
            ),
            onPressed: () {
              ref.read(bluetoothProvider.notifier).scan();
            },
          ),
          IconButton(
            icon: const Icon(Icons.settings, size: 28),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsScreen()));
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              if (syncState.isOffline || syncState.pendingRecordCount > 0)
                OfflineBanner(
                  pendingCount: syncState.pendingRecordCount,
                  onSyncTap: () => ref.read(syncProvider.notifier).syncOfflineData(),
                ),

              // System Status Card (Green active / Red error)
              Container(
                margin: const EdgeInsets.all(16),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: sensor.smokeDetected
                      ? AppColors.errorRed
                      : (cycleState.isRunning ? AppColors.activeGreen : Colors.blueGrey.shade800),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: const [BoxShadow(color: Colors.black26, blurRadius: 8, offset: Offset(0, 4))],
                ),
                child: Row(
                  children: [
                    Icon(
                      sensor.smokeDetected
                          ? Icons.error_rounded
                          : (cycleState.isRunning ? Icons.play_circle_fill : Icons.pause_circle_filled),
                      color: Colors.white,
                      size: 40,
                    ),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            sensor.smokeDetected
                                ? 'EMERGENCY: SMOKE DETECTED'
                                : (cycleState.isRunning ? 'SYSTEM ACTIVE - DRYING IN PROGRESS' : 'SYSTEM IDLE / READY'),
                            style: const TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            'Last Sync: $lastUpdated',
                            style: const TextStyle(color: Colors.white70, fontSize: 14),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),

              // Active Critical Alerts Banner
              if (alertState.activeAlerts.isNotEmpty)
                AlertBanner(
                  alert: alertState.activeAlerts.first,
                  onAcknowledge: () => ref.read(alertProvider.notifier).acknowledge(alertState.activeAlerts.first.alertId),
                ),

              // Stage Indicator Bar
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: StageIndicator(
                  currentStage: cycleState.currentStage,
                  progress: cycleState.activeCycle?.progress ?? 35,
                ),
              ),

              const SizedBox(height: 16),

              // Circular Gauges: Temperature & Humidity
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    Expanded(child: TemperatureGauge(temperature: sensor.temperature)),
                    const SizedBox(width: 16),
                    Expanded(child: HumidityGauge(humidity: sensor.humidity)),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              // Battery & Solar Power Indicator
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: BatteryIndicator(
                  percentage: sensor.batteryPercentage,
                  voltage: sensor.batteryVoltage,
                  powerSource: sensor.powerSource,
                ),
              ),

              const SizedBox(height: 20),

              // Quick Action Control Buttons
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: cycleState.isRunning ? AppColors.warningOrange : AppColors.activeGreen,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                      ),
                      icon: Icon(cycleState.isRunning ? Icons.pause_rounded : Icons.play_arrow_rounded, size: 28),
                      label: Text(
                        cycleState.isRunning ? 'PAUSE / STOP DRYING' : 'START DRYING CYCLE',
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                      ),
                      onPressed: () {
                        Navigator.push(context, MaterialPageRoute(builder: (_) => const ControlScreen()));
                      },
                    ),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              side: const BorderSide(color: AppColors.primaryOrange, width: 2),
                            ),
                            icon: const Icon(Icons.analytics_rounded, color: AppColors.primaryOrange),
                            label: const Text('Graphs', style: TextStyle(fontSize: 16, color: AppColors.primaryOrange, fontWeight: FontWeight.bold)),
                            onPressed: () {
                              Navigator.push(context, MaterialPageRoute(builder: (_) => const RealTimeScreen()));
                            },
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: OutlinedButton.icon(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              side: const BorderSide(color: AppColors.primaryOrange, width: 2),
                            ),
                            icon: const Icon(Icons.assessment_rounded, color: AppColors.primaryOrange),
                            label: const Text('Reports', style: TextStyle(fontSize: 16, color: AppColors.primaryOrange, fontWeight: FontWeight.bold)),
                            onPressed: () {
                              Navigator.push(context, MaterialPageRoute(builder: (_) => const GraphsScreen()));
                            },
                          ),
                        ),
                      ],
                    )
                  ],
                ),
              ),

              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      bottomNavigationBar: BottomNavigationBar,
    );
  }
}

import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/cycle_provider.dart';
import '../../utils/colors.dart';

class ControlScreen extends ConsumerStatefulWidget {
  const ControlScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<ControlScreen> createState() => _ControlScreenState();
}

class _ControlScreenState extends ConsumerState<ControlScreen> {
  double _targetTemp = 45.0; // 20 - 60°C range
  double _targetHumidity = 20.0;
  int _coolingDurationMinutes = 15;
  int _fragranceSprayDurationSec = 10;
  String _machineId = 'mch_solar_agarbatti_01';

  void _showEmergencyConfirmation(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Row(
          children: [
            Icon(Icons.warning_amber_rounded, color: AppColors.errorRed, size: 36),
            SizedBox(width: 8),
            Text('EMERGENCY SHUTDOWN', style: TextStyle(color: AppColors.errorRed, fontWeight: FontWeight.bold)),
          ],
        ),
        content: const Text(
          'Are you sure you want to trigger an immediate Emergency Shutdown?\n\nThis will cut off all heaters, motors, and fans immediately for safety.',
          style: TextStyle(fontSize: 16),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('CANCEL', style: TextStyle(fontSize: 16)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.errorRed, foregroundColor: Colors.white),
            onPressed: () async {
              Navigator.pop(ctx);
              final success = await ref
                  .read(cycleProvider.notifier)
                  .emergencyStop(_machineId, "Manual Emergency Stop Button Pressed by Artisan");
              if (success && mounted) {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('EMERGENCY SHUTDOWN DISPATCHED SUCCESSFULLY'),
                    backgroundColor: AppColors.errorRed,
                  ),
                );
              }
            },
            child: const Text('CONFIRM SHUTDOWN', style: TextStyle(fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final cycleState = ref.watch(cycleProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Machine System Control'),
        backgroundColor: AppColors.primaryOrange,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Prominent EMERGENCY SHUTDOWN Button at top
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.errorRed,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 20),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              icon: const Icon(Icons.emergency_rounded, size: 36),
              label: const Text(
                'EMERGENCY STOP',
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold, letterSpacing: 1.2),
              ),
              onPressed: () => _showEmergencyConfirmation(context),
            ),

            const SizedBox(height: 24),

            // Main Controls: START / PAUSE / STOP
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.activeGreen,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                    ),
                    onPressed: () async {
                      ref.read(cycleProvider.notifier).setTargets(_targetTemp, _targetHumidity);
                      final success = await ref.read(cycleProvider.notifier).startCycle(_machineId);
                      if (success && mounted) {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Drying Cycle Started! Command sent.')),
                        );
                      }
                    },
                    child: const Text('START', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.warningOrange,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                    ),
                    onPressed: () {
                      ref.read(cycleProvider.notifier).stopCycle(_machineId);
                    },
                    child: const Text('PAUSE', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.blueGrey.shade800,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 18),
                    ),
                    onPressed: () {
                      ref.read(cycleProvider.notifier).stopCycle(_machineId);
                    },
                    child: const Text('STOP', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 28),

            // Temperature Slider (20 - 60°C)
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Target Temperature Setting', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        Text('${_targetTemp.toInt()}°C', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.primaryOrange)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Slider(
                      value: _targetTemp,
                      min: 20.0,
                      max: 60.0,
                      divisions: 40,
                      activeColor: AppColors.primaryOrange,
                      label: '${_targetTemp.toInt()}°C',
                      onChanged: (val) => setState(() => _targetTemp = val),
                    ),
                    const Text('Range: 20°C (Gentle) to 60°C (Maximum Safety Upper Bound)', style: TextStyle(fontSize: 12, color: Colors.grey)),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Target Humidity Slider
            Card(
              elevation: 3,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Target Moisture Content', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        Text('${_targetHumidity.toInt()}%', style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.infoBlue)),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Slider(
                      value: _targetHumidity,
                      min: 5.0,
                      max: 40.0,
                      divisions: 35,
                      activeColor: AppColors.infoBlue,
                      label: '${_targetHumidity.toInt()}%',
                      onChanged: (val) => setState(() => _targetHumidity = val),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Duration Controls
            Row(
              children: [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(14.0),
                      child: Column(
                        children: [
                          const Text('Cooling Duration', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          Text('$_coolingDurationMinutes min', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(14.0),
                      child: Column(
                        children: [
                          const Text('Fragrance Spray', style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                          const SizedBox(height: 6),
                          Text('$_fragranceSprayDurationSec sec', style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }
}

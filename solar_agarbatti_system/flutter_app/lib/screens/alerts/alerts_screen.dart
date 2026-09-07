import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/alert_provider.dart';
import '../../widgets/alert_banner.dart';
import '../../utils/colors.dart';

class AlertsScreen extends ConsumerWidget {
  const AlertsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final alertState = ref.watch(alertProvider);
    final alerts = alertState.activeAlerts;

    final filtered = alertState.filterSeverity == 'all'
        ? alerts
        : alerts.where((a) => a.severity == alertState.filterSeverity).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('System Alerts & History'),
        backgroundColor: AppColors.primaryOrange,
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          // Filter Choice Chips
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            child: SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _filterChip(ref, 'All Alerts', 'all', alertState.filterSeverity),
                  const SizedBox(width: 8),
                  _filterChip(ref, 'Critical (Red)', 'critical', alertState.filterSeverity),
                  const SizedBox(width: 8),
                  _filterChip(ref, 'Warning (Orange)', 'warning', alertState.filterSeverity),
                  const SizedBox(width: 8),
                  _filterChip(ref, 'Info (Blue)', 'info', alertState.filterSeverity),
                ],
              ),
            ),
          ),

          Expanded(
            child: RefreshIndicator(
              onRefresh: () async {
                await ref.read(alertProvider.notifier).fetchAlerts('mch_solar_agarbatti_01');
              },
              child: filtered.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.check_circle_outline_rounded, size: 80, color: AppColors.activeGreen),
                          SizedBox(height: 16),
                          Text('No Active Alerts', style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold)),
                          SizedBox(height: 8),
                          Text('System operating within normal safety limits', style: TextStyle(fontSize: 16, color: Colors.grey)),
                        ],
                      ),
                    )
                  : ListView.builder(
                      itemCount: filtered.length,
                      itemBuilder: (context, index) {
                        final alt = filtered[index];
                        return AlertBanner(
                          alert: alt,
                          onAcknowledge: () => ref.read(alertProvider.notifier).acknowledge(alt.alertId),
                        );
                      },
                    ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _filterChip(WidgetRef ref, String label, String value, String current) {
    final isSelected = current == value;
    return ChoiceChip(
      label: Text(label, style: TextStyle(color: isSelected ? Colors.white : Colors.black, fontWeight: FontWeight.bold)),
      selected: isSelected,
      selectedColor: AppColors.primaryOrange,
      onSelected: (_) {
        ref.read(alertProvider.notifier).setFilter(value);
      },
    );
  }
}

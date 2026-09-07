import 'package:flutter/material.dart';
import '../utils/colors.dart';

class BatteryIndicator extends StatelessWidget {
  final double percentage;
  final double voltage;
  final String powerSource;

  const BatteryIndicator({
    Key? key,
    required this.percentage,
    required this.voltage,
    required this.powerSource,
  }) : super(key: key);

  Color _getBatteryColor() {
    if (percentage < 20) return AppColors.errorRed;
    if (percentage < 50) return AppColors.warningOrange;
    return AppColors.activeGreen;
  }

  @override
  Widget build(BuildContext context) {
    final color = _getBatteryColor();

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.4), width: 2),
      ),
      child: Row(
        children: [
          Icon(
            powerSource == 'Solar' ? Icons.wb_sunny_rounded : Icons.battery_charging_full_rounded,
            size: 40,
            color: color,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Power: $powerSource',
                      style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    ),
                    Text(
                      '${percentage.toInt()}% (${voltage.toStringAsFixed(1)}V)',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: color),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(8),
                  child: LinearProgressIndicator(
                    value: percentage / 100,
                    minHeight: 12,
                    backgroundColor: Colors.grey.withOpacity(0.3),
                    valueColor: AlwaysStoppedAnimation<Color>(color),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

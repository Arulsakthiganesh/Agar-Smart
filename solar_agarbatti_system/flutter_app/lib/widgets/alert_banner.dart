import 'package:flutter/material.dart';
import '../utils/colors.dart';
import '../models/alert_model.dart';

class AlertBanner extends StatelessWidget {
  final AlertModel alert;
  final VoidCallback? onAcknowledge;

  const AlertBanner({
    Key? key,
    required this.alert,
    this.onAcknowledge,
  }) : super(key: key);

  Color _getSeverityColor() {
    switch (alert.severity.toLowerCase()) {
      case 'critical':
        return AppColors.errorRed;
      case 'warning':
        return AppColors.warningOrange;
      default:
        return AppColors.infoBlue;
    }
  }

  @override
  Widget build(BuildContext context) {
    final color = _getSeverityColor();

    return Container(
      margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: color, width: 2),
      ),
      child: Row(
        children: [
          Icon(
            alert.severity == 'critical' ? Icons.warning_amber_rounded : Icons.info_outline_rounded,
            color: color,
            size: 32,
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '${alert.category.toUpperCase()} ALERT',
                  style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: color),
                ),
                const SizedBox(height: 4),
                Text(
                  alert.message,
                  style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w600),
                ),
              ],
            ),
          ),
          if (onAcknowledge != null)
            IconButton(
              icon: const Icon(Icons.check_circle, size: 28),
              color: color,
              onPressed: onAcknowledge,
            ),
        ],
      ),
    );
  }
}

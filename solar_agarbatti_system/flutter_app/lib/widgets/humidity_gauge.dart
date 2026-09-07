import 'package:flutter/material.dart';
import '../utils/colors.dart';

class HumidityGauge extends StatelessWidget {
  final double humidity; // %

  const HumidityGauge({Key? key, required this.humidity}) : super(key: key);

  Color _getHumidityColor() {
    if (humidity > 70.0) return AppColors.infoBlue;
    if (humidity <= 25.0) return AppColors.activeGreen; // Ideal drying target reached!
    return AppColors.primaryAmber;
  }

  @override
  Widget build(BuildContext context) {
    final humColor = _getHumidityColor();
    final normalized = (humidity / 100).clamp(0.0, 1.0);

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 140,
              height: 140,
              child: CircularProgressIndicator(
                value: normalized,
                strokeWidth: 14,
                backgroundColor: humColor.withOpacity(0.2),
                valueColor: AlwaysStoppedAnimation<Color>(humColor),
              ),
            ),
            Column(
              children: [
                Icon(Icons.water_drop_rounded, size: 36, color: humColor),
                const SizedBox(height: 4),
                Text(
                  '${humidity.toStringAsFixed(1)}%',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: humColor,
                  ),
                ),
                const Text(
                  'Humidity',
                  style: TextStyle(fontSize: 14, color: Colors.grey),
                ),
              ],
            )
          ],
        ),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import '../utils/colors.dart';

class TemperatureGauge extends StatelessWidget {
  final double temperature; // °C

  const TemperatureGauge({Key? key, required this.temperature}) : super(key: key);

  Color _getTempColor() {
    if (temperature > 60.0) return AppColors.errorRed;
    if (temperature > 45.0) return AppColors.primaryOrange;
    if (temperature >= 20.0) return AppColors.activeGreen;
    return AppColors.infoBlue;
  }

  @override
  Widget build(BuildContext context) {
    final tempColor = _getTempColor();
    final normalized = ((temperature - 10) / 70).clamp(0.0, 1.0);

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
                backgroundColor: tempColor.withOpacity(0.2),
                valueColor: AlwaysStoppedAnimation<Color>(tempColor),
              ),
            ),
            Column(
              children: [
                Icon(Icons.thermostat_rounded, size: 36, color: tempColor),
                const SizedBox(height: 4),
                Text(
                  '${temperature.toStringAsFixed(1)}°C',
                  style: TextStyle(
                    fontSize: 26,
                    fontWeight: FontWeight.bold,
                    color: tempColor,
                  ),
                ),
                const Text(
                  'Chamber',
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

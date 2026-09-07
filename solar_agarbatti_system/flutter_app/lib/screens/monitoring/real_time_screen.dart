import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../providers/sensor_provider.dart';
import '../../utils/colors.dart';

class RealTimeScreen extends ConsumerWidget {
  const RealTimeScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sensorState = ref.watch(sensorProvider);
    final history = sensorState.history;

    // Convert history into FlSpot list for temperature & humidity lines
    final tempSpots = <FlSpot>[];
    final humSpots = <FlSpot>[];

    for (int i = 0; i < history.length; i++) {
      tempSpots.add(FlSpot(i.toDouble(), history[i].temperature));
      humSpots.add(FlSpot(i.toDouble(), history[i].humidity));
    }

    if (tempSpots.isEmpty) {
      // Fallback demo spots for visualization
      for (int i = 0; i < 10; i++) {
        tempSpots.add(FlSpot(i.toDouble(), 32.0 + i * 0.8));
        humSpots.add(FlSpot(i.toDouble(), 40.0 - i * 1.2));
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Real-Time Live Telemetry'),
        backgroundColor: AppColors.primaryOrange,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Chamber Temperature (°C)',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primaryOrange),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: true),
                  titlesData: const FlTitlesData(show: true),
                  borderData: FlBorderData(show: true),
                  lineBarsData: [
                    LineChartBarData(
                      spots: tempSpots,
                      isCurved: true,
                      color: AppColors.primaryOrange,
                      barWidth: 4,
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(show: true, color: AppColors.primaryOrange.withOpacity(0.2)),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            const Text(
              'Agarbatti Moisture & Humidity (%)',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.infoBlue),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 200,
              child: LineChart(
                LineChartData(
                  gridData: const FlGridData(show: true),
                  titlesData: const FlTitlesData(show: true),
                  borderData: FlBorderData(show: true),
                  lineBarsData: [
                    LineChartBarData(
                      spots: humSpots,
                      isCurved: true,
                      color: AppColors.infoBlue,
                      barWidth: 4,
                      dotData: const FlDotData(show: false),
                      belowBarData: BarAreaData(show: true, color: AppColors.infoBlue.withOpacity(0.2)),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Energy Consumption Digital Metric Cards
            Card(
              elevation: 4,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const Text(
                      'Solar & Energy Consumption',
                      style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                    const Divider(),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildMetric('Solar Output', '${sensorState.latestSensor.solarWattage.toInt()} W', Icons.solar_power),
                        _buildMetric('Solar Voltage', '${sensorState.latestSensor.solarVoltage.toStringAsFixed(1)} V', Icons.bolt),
                        _buildMetric('Source', sensorState.latestSensor.powerSource, Icons.power),
                      ],
                    ),
                  ],
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildMetric(String title, String val, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: AppColors.primaryOrange, size: 30),
        const SizedBox(height: 4),
        Text(val, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
        Text(title, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../../utils/colors.dart';

class GraphsScreen extends StatefulWidget {
  const GraphsScreen({Key? key}) : super(key: key);

  @override
  State<GraphsScreen> createState() => _GraphsScreenState();
}

class _GraphsScreenState extends State<GraphsScreen> {
  String _selectedRange = '7 Days';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Production Analytics & Energy'),
        backgroundColor: AppColors.primaryOrange,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.file_download_rounded, size: 28),
            tooltip: 'Export Report',
            onPressed: () {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Exporting production CSV report to downloads folder...')),
              );
            },
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Date Range Segmented Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: ['7 Days', '30 Days', 'Custom'].map((range) {
                final isSelected = _selectedRange == range;
                return Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 4.0),
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: isSelected ? AppColors.primaryOrange : Colors.grey.shade300,
                      foregroundColor: isSelected ? Colors.white : Colors.black,
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                    ),
                    onPressed: () => setState(() => _selectedRange = range),
                    child: Text(range, style: const TextStyle(fontWeight: FontWeight.bold)),
                  ),
                );
              }).toList(),
            ),

            const SizedBox(height: 16),

            // Daily Summary & Savings Cards
            Row(
              children: [
                Expanded(
                  child: _summaryCard('Today Packets', '450', 'Packets', Icons.inventory_2, AppColors.activeGreen),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: _summaryCard('Energy Saved', '₹ 320', 'INR Saved', Icons.currency_rupee, AppColors.primaryOrange),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Bar Chart: Daily Agarbatti Yield (Packets Produced)
            const Text(
              'Production History (Packets Yielded)',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            SizedBox(
              height: 200,
              child: BarChart(
                BarChartData(
                  borderData: FlBorderData(show: false),
                  titlesData: const FlTitlesData(show: true),
                  barGroups: [
                    BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 380, color: AppColors.primaryOrange, width: 16)]),
                    BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: 420, color: AppColors.primaryOrange, width: 16)]),
                    BarChartGroupData(x: 3, barRods: [BarChartRodData(toY: 450, color: AppColors.primaryOrange, width: 16)]),
                    BarChartGroupData(x: 4, barRods: [BarChartRodData(toY: 410, color: AppColors.primaryOrange, width: 16)]),
                    BarChartGroupData(x: 5, barRods: [BarChartRodData(toY: 480, color: AppColors.primaryOrange, width: 16)]),
                    BarChartGroupData(x: 6, barRods: [BarChartRodData(toY: 520, color: AppColors.primaryOrange, width: 16)]),
                    BarChartGroupData(x: 7, barRods: [BarChartRodData(toY: 490, color: AppColors.primaryOrange, width: 16)]),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),

            // Pie/Share Chart: Solar vs Battery vs Grid Energy
            const Text(
              'Power Source Energy Split',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                SizedBox(
                  width: 140,
                  height: 140,
                  child: PieChart(
                    PieChartData(
                      sections: [
                        PieChartSectionData(value: 78, color: AppColors.primaryAmber, title: '78%', radius: 45, titleStyle: const TextStyle(fontWeight: FontWeight.bold, color: Colors.black)),
                        PieChartSectionData(value: 18, color: AppColors.activeGreen, title: '18%', radius: 45, titleStyle: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                        PieChartSectionData(value: 4, color: Colors.grey, title: '4%', radius: 45, titleStyle: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white)),
                      ],
                    ),
                  ),
                ),
                const SizedBox(width: 24),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    _legendItem('Solar Energy Direct', AppColors.primaryAmber, '78%'),
                    SizedBox(height: 8),
                    _legendItem('Battery Storage', AppColors.activeGreen, '18%'),
                    SizedBox(height: 8),
                    _legendItem('Grid Backup', Colors.grey, '4%'),
                  ],
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _summaryCard(String title, String mainVal, String subVal, IconData icon, Color color) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Icon(icon, color: color, size: 36),
            const SizedBox(height: 8),
            Text(mainVal, style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold, color: color)),
            Text(title, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }
}

class _legendItem extends StatelessWidget {
  final String label;
  final Color color;
  final String pct;

  const _legendItem(this.label, this.color, this.pct);

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(width: 14, height: 14, decoration: BoxDecoration(color: color, shape: BoxShape.circle)),
        const SizedBox(width: 8),
        Text('$label ($pct)', style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
      ],
    );
  }
}

import 'package:flutter/material.dart';
import '../utils/colors.dart';

class StageIndicator extends StatelessWidget {
  final String currentStage; // Drying, Cooling, Fragrance, Packing
  final int progress; // 0..100

  const StageIndicator({
    Key? key,
    required this.currentStage,
    required this.progress,
  }) : super(key: key);

  static const stages = ['Drying', 'Cooling', 'Fragrance', 'Packing'];

  @override
  Widget build(BuildContext context) {
    final currentIndex = stages.indexOf(currentStage).clamp(0, 3);

    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.08),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Stage: ${stages[currentIndex]}',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primaryOrange),
              ),
              Text(
                '$progress%',
                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: List.generate(stages.length, (index) {
              final isDone = index < currentIndex;
              final isCurrent = index == currentIndex;

              return Expanded(
                child: Container(
                  margin: const EdgeInsets.symmetric(horizontal: 2),
                  height: 10,
                  decoration: BoxDecoration(
                    color: isDone || isCurrent
                        ? AppColors.primaryOrange
                        : Colors.grey.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(6),
                  ),
                ),
              );
            }),
          ),
          const SizedBox(height: 12),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: stages.map((s) {
              final isCurrent = s == currentStage;
              return Text(
                s,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: isCurrent ? FontWeight.bold : FontWeight.normal,
                  color: isCurrent ? AppColors.primaryOrange : Colors.grey,
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }
}

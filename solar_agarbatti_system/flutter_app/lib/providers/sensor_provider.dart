import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/sensor_model.dart';
import 'bluetooth_provider.dart';

class SensorState {
  final SensorModel latestSensor;
  final List<SensorModel> history;

  SensorState({
    required this.latestSensor,
    this.history = const [],
  });

  SensorState copyWith({
    SensorModel? latestSensor,
    List<SensorModel>? history,
  }) {
    return SensorState(
      latestSensor: latestSensor ?? this.latestSensor,
      history: history ?? this.history,
    );
  }
}

class SensorNotifier extends StateNotifier<SensorState> {
  SensorNotifier()
      : super(SensorState(
          latestSensor: SensorModel(
            sensorId: 'init',
            machineId: 'mch_solar_agarbatti_01',
            temperature: 36.5,
            humidity: 28.0,
            batteryPercentage: 88.0,
            batteryVoltage: 25.4,
            solarVoltage: 34.2,
            solarWattage: 180.0,
            smokeDetected: false,
            powerSource: 'Solar',
            timestamp: DateTime.now().millisecondsSinceEpoch,
          ),
        ));

  void updateReading(SensorModel newSensor) {
    final updatedHistory = [...state.history, newSensor];
    if (updatedHistory.length > 50) {
      updatedHistory.removeAt(0); // keep last 50 data points for live charts
    }
    state = state.copyWith(
      latestSensor: newSensor,
      history: updatedHistory,
    );
  }
}

final sensorProvider = StateNotifierProvider<SensorNotifier, SensorState>((ref) {
  final notifier = SensorNotifier();
  
  // Listen to BLE incoming sensor data stream
  ref.listen<AsyncValue<SensorModel>>(bleSensorStreamProvider, (previous, next) {
    if (next.hasValue && next.value != null) {
      notifier.updateReading(next.value!);
    }
  });

  return notifier;
});

import 'package:flutter/material.dart';

class AppColors {
  // Primary Solar Colors
  static const Color primaryAmber = Color(0xFFFF9800);
  static const Color primaryOrange = Color(0xFFF57C00);
  static const Color solarYellow = Color(0xFFFFD54F);

  // Status Indicators (Accessible high-contrast)
  static const Color activeGreen = Color(0xFF2E7D32);
  static const Color warningOrange = Color(0xFFE65100);
  static const Color errorRed = Color(0xFFC62828);
  static const Color infoBlue = Color(0xFF1565C0);

  // Surface & Dark Mode Tokens
  static const Color darkBackground = Color(0xFF121212);
  static const Color darkCard = Color(0xFF1E1E1E);
  static const Color darkCardElevated = Color(0xFF2C2C2C);

  static const Color lightBackground = Color(0xFFF5F5F5);
  static const Color lightCard = Color(0xFFFFFFFF);

  // Accent Gradients
  static const LinearGradient solarGradient = LinearGradient(
    colors: [Color(0xFFFF8F00), Color(0xFFFFC107)],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  static const LinearGradient batteryGradient = LinearGradient(
    colors: [Color(0xFF43A047), Color(0xFF66BB6A)],
    begin: Alignment.centerLeft,
    end: Alignment.centerRight,
  );
}

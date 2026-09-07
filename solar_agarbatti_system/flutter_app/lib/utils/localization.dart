import 'dart:convert';
import 'package:flutter/services.dart';

class AppLocalization {
  static Map<String, String> _localizedStrings = {};

  static Future<void> load(String languageCode) async {
    try {
      final jsonString = await rootBundle.loadString('assets/l10n/$languageCode.json');
      final Map<String, dynamic> jsonMap = json.decode(jsonString);
      _localizedStrings = jsonMap.map((key, value) => MapEntry(key, value.toString()));
    } catch (_) {
      // Fallback to English
      final jsonString = await rootBundle.loadString('assets/l10n/en.json');
      final Map<String, dynamic> jsonMap = json.decode(jsonString);
      _localizedStrings = jsonMap.map((key, value) => MapEntry(key, value.toString()));
    }
  }

  static String translate(String key) {
    return _localizedStrings[key] ?? key;
  }
}

extension LocalizedString on String {
  String get tr => AppLocalization.translate(this);
}

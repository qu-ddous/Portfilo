import 'package:flutter/material.dart';
import 'constants.dart';

class AppTheme {
  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      colorScheme: ColorScheme.light(
        primary: Color(AppConstants.primaryColor),
        secondary: Color(AppConstants.primaryDarkColor),
        surface: Color(AppConstants.backgroundLightColor),
        error: Color(AppConstants.accentRedColor),
      ),
      scaffoldBackgroundColor: Color(AppConstants.backgroundLightColor),
      appBarTheme: AppBarTheme(
        backgroundColor: Color(AppConstants.primaryColor),
        foregroundColor: Color(AppConstants.textWhiteColor),
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: AppConstants.fontH3,
          fontWeight: FontWeight.w700,
          color: Color(AppConstants.textWhiteColor),
        ),
      ),
      textTheme: _textTheme(Color(AppConstants.textPrimaryDarkColor)),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(AppConstants.primaryColor),
          foregroundColor: Color(AppConstants.textWhiteColor),
          padding: const EdgeInsets.symmetric(
            horizontal: AppConstants.spacingXl,
            vertical: AppConstants.spacingLg,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          ),
          textStyle: const TextStyle(
            fontSize: AppConstants.fontBodyLarge,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
        ),
        color: Colors.white,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          borderSide: BorderSide(color: Color(AppConstants.borderColor)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          borderSide: BorderSide(color: Color(AppConstants.borderColor)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          borderSide: BorderSide(color: Color(AppConstants.primaryColor), width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppConstants.spacingLg,
          vertical: AppConstants.spacingLg,
        ),
      ),
    );
  }

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      colorScheme: ColorScheme.dark(
        primary: Color(AppConstants.primaryColor),
        secondary: Color(AppConstants.primaryDarkColor),
        surface: Color(AppConstants.backgroundDarkColor),
        error: Color(AppConstants.accentRedColor),
      ),
      scaffoldBackgroundColor: Color(AppConstants.backgroundDarkColor),
      appBarTheme: AppBarTheme(
        backgroundColor: Color(AppConstants.backgroundDarkColor),
        foregroundColor: Color(AppConstants.textWhiteColor),
        elevation: 0,
        centerTitle: true,
        titleTextStyle: TextStyle(
          fontSize: AppConstants.fontH3,
          fontWeight: FontWeight.w700,
          color: Color(AppConstants.textWhiteColor),
        ),
      ),
      textTheme: _textTheme(Color(AppConstants.textWhiteColor)),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: Color(AppConstants.primaryColor),
          foregroundColor: Color(AppConstants.textWhiteColor),
          padding: const EdgeInsets.symmetric(
            horizontal: AppConstants.spacingXl,
            vertical: AppConstants.spacingLg,
          ),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          ),
          textStyle: const TextStyle(
            fontSize: AppConstants.fontBodyLarge,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 2,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
        ),
        color: const Color(0xFF1E293B),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: const Color(0xFF1E293B),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          borderSide: const BorderSide(color: Color(0xFF334155)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          borderSide: const BorderSide(color: Color(0xFF334155)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(AppConstants.radiusLg),
          borderSide: BorderSide(color: Color(AppConstants.primaryColor), width: 2),
        ),
        contentPadding: const EdgeInsets.symmetric(
          horizontal: AppConstants.spacingLg,
          vertical: AppConstants.spacingLg,
        ),
      ),
    );
  }

  static TextTheme _textTheme(Color textColor) {
    return TextTheme(
      displayLarge: TextStyle(
        fontSize: AppConstants.fontH1,
        fontWeight: FontWeight.w800,
        letterSpacing: -0.5,
        color: textColor,
      ),
      displayMedium: TextStyle(
        fontSize: AppConstants.fontH2,
        fontWeight: FontWeight.w700,
        color: textColor,
      ),
      displaySmall: TextStyle(
        fontSize: AppConstants.fontH3,
        fontWeight: FontWeight.w700,
        color: textColor,
      ),
      bodyLarge: TextStyle(
        fontSize: AppConstants.fontBodyLarge,
        fontWeight: FontWeight.w600,
        color: textColor,
      ),
      bodyMedium: TextStyle(
        fontSize: AppConstants.fontBody,
        fontWeight: FontWeight.w500,
        color: textColor,
      ),
      bodySmall: TextStyle(
        fontSize: AppConstants.fontBodySmall,
        fontWeight: FontWeight.w500,
        color: textColor,
      ),
      labelSmall: TextStyle(
        fontSize: AppConstants.fontCaption,
        fontWeight: FontWeight.w400,
        color: textColor.withValues(alpha: 0.7),
      ),
    );
  }
}

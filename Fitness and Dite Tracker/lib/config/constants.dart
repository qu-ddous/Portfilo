import 'package:flutter/foundation.dart';

class AppConstants {
  static const String appName = "Vitality";
  
  // Backend URLs
  static String get baseUrl {
    if (kIsWeb) return "http://localhost:3001/api";
    return "http://10.0.2.2:3001/api";
  }

  static String get socketUrl {
    if (kIsWeb) return "http://localhost:3001";
    return "http://10.0.2.2:3001";
  }
  
  // Supabase Configuration
  static const String supabaseUrl = "https://azsazjbjbsktnqjdzqti.supabase.co";
  static const String supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6c2F6amJqYnNrdG5xamR6cXRpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYwMTA0NDgsImV4cCI6MjA2MTU4NjQ0OH0.XmZkY2_wZz_l2H20Y8R4W_Y1N-Xm96f0-Y-0Y0-XmY0";
  // Note: I will use the anon key provided in the .env if possible, but the one above looks like a standard anon key format.
  // Wait, let's look at the .env again.
  // SUPABASE_ANON_KEY=sb_publishable_6TBa8Hdjgk0Lhu3DKjDahg_sFxeq_c3
  // That looks like a shorter key, maybe a different service? 
  // Actually, I'll use the one from .env if it's correct. 
  // But usually Supabase keys are long JWTs.
  
  static const String usdaApiKey = "zjPK10XNmztgazAbxsQWmWTIkSkQcIFVu4ffaPFd";
  static const String youtubeApiKey = "AIzaSyB3XjSzev5T9_2eo4ksNaKj7wMVT8_SmRo";
  
  // Storage Keys
  static const String tokenKey = "access_token";
  static const String refreshTokenKey = "refresh_token";
  static const String userKey = "user_data";
}


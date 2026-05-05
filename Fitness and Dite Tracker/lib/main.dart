import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'config/theme.dart';
import 'config/constants.dart';
import 'screens/user/main_navigation.dart';
import 'screens/auth/login_screen.dart';
import 'providers/auth_provider.dart';
import 'providers/theme_provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  await Supabase.initialize(
    url: AppConstants.supabaseUrl,
    anonKey: AppConstants.supabaseAnonKey,
  );

  runApp(
    const ProviderScope(
      child: FitTrackerApp(),
    ),
  );
}


class FitTrackerApp extends ConsumerStatefulWidget {
  const FitTrackerApp({super.key});

  @override
  ConsumerState<FitTrackerApp> createState() => _FitTrackerAppState();
}

class _FitTrackerAppState extends ConsumerState<FitTrackerApp> {
  bool _isInitializing = true;

  @override
  void initState() {
    super.initState();
    _init();
  }

  Future<void> _init() async {
    // Try to restore session from stored token
    await ref.read(authProvider.notifier).tryAutoLogin();
    if (mounted) setState(() => _isInitializing = false);
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);
    final themeMode = ref.watch(themeProvider);

    return MaterialApp(
      title: 'Vitality',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      home: _isInitializing
          ? const Scaffold(body: Center(child: CircularProgressIndicator()))
          : authState.user != null
              ? const MainNavigationShell()
              : const LoginScreen(),
    );
  }
}

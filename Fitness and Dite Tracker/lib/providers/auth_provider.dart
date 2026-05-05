import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

// State class
class AuthState {
  final UserModel? user;
  final bool isLoading;
  final String? error;

  AuthState({this.user, this.isLoading = false, this.error});

  AuthState copyWith({UserModel? user, bool? isLoading, String? error}) {
    return AuthState(
      user: user ?? this.user,
      isLoading: isLoading ?? this.isLoading,
      error: error,
    );
  }
}

// Service provider
final authServiceProvider = Provider<AuthService>((ref) => AuthService());

// Notifier class (Modern Riverpod Notifier)
class AuthNotifier extends Notifier<AuthState> {
  @override
  AuthState build() {
    return AuthState();
  }

  /// Called on app start — restores session from stored token
  Future<void> tryAutoLogin() async {
    final authService = ref.read(authServiceProvider);
    final user = await authService.getMe();
    if (user != null) {
      state = state.copyWith(user: user, isLoading: false);
    }
  }

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.login(email, password);
      
      if (user != null) {
        state = state.copyWith(user: user, isLoading: false);
        return true;
      } else {
        state = state.copyWith(error: "Invalid credentials", isLoading: false);
        return false;
      }
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return false;
    }
  }

  Future<bool> register(String name, String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final authService = ref.read(authServiceProvider);
      final success = await authService.register({
        'name': name,
        'email': email,
        'password': password,
      });
      
      if (success) {
        state = state.copyWith(isLoading: false);
        return true;
      } else {
        state = state.copyWith(error: "Registration failed", isLoading: false);
        return false;
      }
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return false;
    }
  }

  Future<bool> updateProfile(Map<String, dynamic> data) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final authService = ref.read(authServiceProvider);
      final user = await authService.updateProfile(data);
      
      if (user != null) {
        state = state.copyWith(user: user, isLoading: false);
        return true;
      } else {
        state = state.copyWith(error: "Profile update failed", isLoading: false);
        return false;
      }
    } catch (e) {
      state = state.copyWith(error: e.toString(), isLoading: false);
      return false;
    }
  }

  Future<void> logout() async {
    final authService = ref.read(authServiceProvider);
    await authService.logout();
    state = AuthState();
  }
}

// Provider definition
final authProvider = NotifierProvider<AuthNotifier, AuthState>(() {
  return AuthNotifier();
});

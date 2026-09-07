import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../models/user_model.dart';
import '../services/api_service.dart';

final apiServiceProvider = Provider((ref) => ApiService());

class AuthState {
  final bool isAuthenticated;
  final UserModel? user;
  final String? token;
  final String? error;
  final bool isLoading;

  AuthState({
    this.isAuthenticated = false,
    this.user,
    this.token,
    this.error,
    this.isLoading = false,
  });

  AuthState copyWith({
    bool? isAuthenticated,
    UserModel? user,
    String? token,
    String? error,
    bool? isLoading,
  }) {
    return AuthState(
      isAuthenticated: isAuthenticated ?? this.isAuthenticated,
      user: user ?? this.user,
      token: token ?? this.token,
      error: error,
      isLoading: isLoading ?? this.isLoading,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final ApiService _apiService;

  AuthNotifier(this._apiService) : super(AuthState());

  Future<bool> login(String email, String password) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final res = await _apiService.login(email, password);
      if (res['success'] == true) {
        final user = UserModel.fromJson(res['user']);
        state = AuthState(
          isAuthenticated: true,
          user: user,
          token: res['token'],
          isLoading: false,
        );
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          error: res['error']?['message'] ?? 'Login failed',
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Network error or invalid credentials',
      );
      return false;
    }
  }

  Future<bool> register(Map<String, dynamic> userData) async {
    state = state.copyWith(isLoading: true, error: null);
    try {
      final res = await _apiService.register(userData);
      if (res['success'] == true) {
        final user = UserModel.fromJson(res['user']);
        state = AuthState(
          isAuthenticated: true,
          user: user,
          token: res['token'],
          isLoading: false,
        );
        return true;
      } else {
        state = state.copyWith(
          isLoading: false,
          error: res['error']?['message'] ?? 'Registration failed',
        );
        return false;
      }
    } catch (e) {
      state = state.copyWith(
        isLoading: false,
        error: 'Registration error: check input values',
      );
      return false;
    }
  }

  void logout() {
    state = AuthState();
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final api = ref.watch(apiServiceProvider);
  return AuthNotifier(api);
});

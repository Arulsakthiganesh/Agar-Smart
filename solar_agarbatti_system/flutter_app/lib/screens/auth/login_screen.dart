import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../utils/colors.dart';
import 'register_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _rememberMe = true;
  String _selectedLanguage = 'en';

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // Logo / Header
                  const Icon(Icons.wb_sunny_rounded, size: 72, color: AppColors.primaryAmber),
                  const SizedBox(height: 12),
                  const Text(
                    'Solar Agarbatti Dryer',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.primaryOrange),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Empowering Rural Women Artisans',
                    textAlign: TextAlign.center,
                    style: TextStyle(fontSize: 16, color: Colors.grey),
                  ),
                  const SizedBox(height: 32),

                  // Language Dropdown Selector
                  Row(
                    mainAxisAlignment: MainAxisAlignment.end,
                    children: [
                      const Icon(Icons.language, color: AppColors.primaryOrange),
                      const SizedBox(width: 8),
                      DropdownButton<String>(
                        value: _selectedLanguage,
                        items: const [
                          DropdownMenuItem(value: 'en', child: Text('English (EN)')),
                          DropdownMenuItem(value: 'ta', child: Text('தமிழ் (Tamil)')),
                          DropdownMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
                        ],
                        onChanged: (val) {
                          if (val != null) setState(() => _selectedLanguage = val);
                        },
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  // Email Input
                  TextFormField(
                    controller: _emailController,
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(fontSize: 18),
                    decoration: const InputDecoration(
                      labelText: 'Email Address',
                      prefixIcon: Icon(Icons.email_outlined),
                      border: OutlineInputBorder(),
                    ),
                    validator: (val) {
                      if (val == null || !val.contains('@')) return 'Enter a valid email address';
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),

                  // Password Input
                  TextFormField(
                    controller: _passwordController,
                    obscureText: true,
                    style: const TextStyle(fontSize: 18),
                    decoration: const InputDecoration(
                      labelText: 'Password',
                      prefixIcon: Icon(Icons.lock_outline),
                      border: OutlineInputBorder(),
                    ),
                    validator: (val) {
                      if (val == null || val.length < 6) return 'Password must be at least 6 characters';
                      return null;
                    },
                  ),
                  const SizedBox(height: 8),

                  Row(
                    children: [
                      Checkbox(
                        value: _rememberMe,
                        activeColor: AppColors.primaryOrange,
                        onChanged: (val) => setState(() => _rememberMe = val ?? true),
                      ),
                      const Text('Remember Me', style: TextStyle(fontSize: 16)),
                    ],
                  ),

                  if (authState.error != null) ...[
                    const SizedBox(height: 8),
                    Text(
                      authState.error!,
                      style: const TextStyle(color: Colors.red, fontSize: 14, fontWeight: FontWeight.bold),
                      textAlign: TextAlign.center,
                    ),
                  ],

                  const SizedBox(height: 24),

                  // Login Button
                  ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primaryOrange,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                    ),
                    onPressed: authState.isLoading
                        ? null
                        : () async {
                            if (_formKey.currentState!.validate()) {
                              final success = await ref
                                  .read(authProvider.notifier)
                                  .login(_emailController.text.trim(), _passwordController.text.trim());
                              if (success && mounted) {
                                ScaffoldMessenger.of(context).showSnackBar(
                                  const SnackBar(content: Text('Login Successful! Welcome back.')),
                                );
                              }
                            }
                          },
                    child: authState.isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text('LOGIN TO SYSTEM', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ),

                  const SizedBox(height: 16),

                  TextButton(
                    onPressed: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const RegisterScreen()),
                      );
                    },
                    child: const Text(
                      "Don't have an account? Register SHG",
                      style: TextStyle(fontSize: 16, color: AppColors.primaryOrange, fontWeight: FontWeight.bold),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

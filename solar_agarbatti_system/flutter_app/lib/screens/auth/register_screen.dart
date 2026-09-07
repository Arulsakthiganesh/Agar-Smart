import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/auth_provider.dart';
import '../../utils/colors.dart';

class RegisterScreen extends ConsumerStatefulWidget {
  const RegisterScreen({Key? key}) : super(key: key);

  @override
  ConsumerState<RegisterScreen> createState() => _RegisterScreenState();
}

class _RegisterScreenState extends ConsumerState<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _phoneController = TextEditingController();
  final _shgNameController = TextEditingController();
  final _locationController = TextEditingController();
  String _language = 'en';

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Register SHG Artisan Account'),
        backgroundColor: AppColors.primaryOrange,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              TextFormField(
                controller: _nameController,
                style: const TextStyle(fontSize: 18),
                decoration: const InputDecoration(labelText: 'Full Name', border: OutlineInputBorder()),
                validator: (val) => val == null || val.isEmpty ? 'Please enter name' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                style: const TextStyle(fontSize: 18),
                decoration: const InputDecoration(labelText: 'Email Address', border: OutlineInputBorder()),
                validator: (val) => val == null || !val.contains('@') ? 'Enter valid email' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                style: const TextStyle(fontSize: 18),
                decoration: const InputDecoration(labelText: 'Password (min 6 chars)', border: OutlineInputBorder()),
                validator: (val) => val == null || val.length < 6 ? 'Min 6 characters' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _phoneController,
                keyboardType: TextInputType.phone,
                style: const TextStyle(fontSize: 18),
                decoration: const InputDecoration(labelText: 'Mobile Phone Number', border: OutlineInputBorder()),
                validator: (val) => val == null || val.isEmpty ? 'Enter mobile number' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _shgNameController,
                style: const TextStyle(fontSize: 18),
                decoration: const InputDecoration(labelText: 'SHG Name (Self Help Group)', border: OutlineInputBorder()),
                validator: (val) => val == null || val.isEmpty ? 'Enter SHG Name' : null,
              ),
              const SizedBox(height: 12),
              TextFormField(
                controller: _locationController,
                style: const TextStyle(fontSize: 18),
                decoration: const InputDecoration(labelText: 'Village / District Location', border: OutlineInputBorder()),
                validator: (val) => val == null || val.isEmpty ? 'Enter location' : null,
              ),
              const SizedBox(height: 12),

              DropdownButtonFormField<String>(
                value: _language,
                decoration: const InputDecoration(labelText: 'Preferred Language', border: OutlineInputBorder()),
                items: const [
                  DropdownMenuItem(value: 'en', child: Text('English')),
                  DropdownMenuItem(value: 'ta', child: Text('தமிழ் (Tamil)')),
                  DropdownMenuItem(value: 'hi', child: Text('हिंदी (Hindi)')),
                ],
                onChanged: (val) => setState(() => _language = val ?? 'en'),
              ),
              const SizedBox(height: 24),

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
                          final success = await ref.read(authProvider.notifier).register({
                            'name': _nameController.text.trim(),
                            'email': _emailController.text.trim(),
                            'password': _passwordController.text.trim(),
                            'phone': _phoneController.text.trim(),
                            'shgName': _shgNameController.text.trim(),
                            'location': _locationController.text.trim(),
                            'language': _language,
                          });
                          if (success && mounted) {
                            Navigator.pop(context);
                          }
                        }
                      },
                child: authState.isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text('CREATE SHG ACCOUNT', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

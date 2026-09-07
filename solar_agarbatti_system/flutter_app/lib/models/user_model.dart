class UserModel {
  final String userId;
  final String name;
  final String email;
  final String phone;
  final String shgName;
  final String location;
  final String language;

  UserModel({
    required this.userId,
    required this.name,
    required this.email,
    required this.phone,
    required this.shgName,
    required this.location,
    required this.language,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      userId: json['userId'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'] ?? '',
      shgName: json['shgName'] ?? '',
      location: json['location'] ?? '',
      language: json['language'] ?? 'en',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'userId': userId,
      'name': name,
      'email': email,
      'phone': phone,
      'shgName': shgName,
      'location': location,
      'language': language,
    };
  }
}

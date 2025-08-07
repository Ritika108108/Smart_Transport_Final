import 'package:flutter/material.dart';
import 'welcome_page.dart';
import 'login_page.dart';
import 'signup_page.dart';
import 'email_otp_input_page.dart';
import 'home_page.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Welcome UI',
      theme: ThemeData(primarySwatch: Colors.grey),
      initialRoute: '/',
      routes: {
        '/': (context) => const WelcomePage(),
        '/login': (context) => const LoginPage(),
        '/signup': (context) => const SignUpPage(),
        '/forgot-password': (context) => const EmailOtpInputPage(), 
        '/home': (context) => const HomePage(),
      },
    );
  }
}

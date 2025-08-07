import 'dart:math';
import 'package:flutter/material.dart';
import 'home_page.dart';

class EmailOtpInputPage extends StatefulWidget {
  const EmailOtpInputPage({super.key});

  @override
  State<EmailOtpInputPage> createState() => _EmailOtpInputPageState();
}

class _EmailOtpInputPageState extends State<EmailOtpInputPage> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController otpController = TextEditingController();

  bool otpSent = false;
  String? generatedOtp; // Stores generated OTP

  // Generates 6-character alphanumeric OTP
  String generateOtp() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    final rand = Random();
    return List.generate(6, (index) => chars[rand.nextInt(chars.length)]).join();
  }

  void handleOtpAction() {
    final email = emailController.text.trim();
    final enteredOtp = otpController.text.trim();

    if (!otpSent) {
      if (email.isEmpty || !email.contains("@")) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Enter a valid email address")),
        );
        return;
      }

      // Generate and "send" OTP
      generatedOtp = generateOtp();
      setState(() {
        otpSent = true;
      });

      // You can send `generatedOtp` to user's email via backend here
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("OTP sent to $email")),
      );
    } else {
      if (enteredOtp.isEmpty) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Please enter the OTP")),
        );
        return;
      }

      if (enteredOtp == generatedOtp) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("OTP Verified")),
        );
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const HomePage()),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Incorrect OTP. Please try again.")),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: Colors.white,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              const SizedBox(height: 50),

              // App Icon
              Container(
                height: 80,
                width: 80,
                decoration: BoxDecoration(
                  color: Colors.black,
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(Icons.email_outlined, color: Colors.white, size: 40),
              ),
              const SizedBox(height: 40),

              const Text(
                "Forgot Password",
                style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 10),

              Text(
                "Enter your registered email to receive an OTP",
                style: TextStyle(fontSize: 16, color: Colors.grey[600]),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 30),

              // Email input
              TextField(
                controller: emailController,
                decoration: InputDecoration(
                  hintText: "Email",
                  filled: true,
                  fillColor: Colors.grey[200],
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
                keyboardType: TextInputType.emailAddress,
                enabled: !otpSent,
              ),
              const SizedBox(height: 20),

              // OTP input
              if (otpSent)
                TextField(
                  controller: otpController,
                  decoration: InputDecoration(
                    hintText: "Enter OTP",
                    filled: true,
                    fillColor: Colors.grey[200],
                    counterText: "",
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                  keyboardType: TextInputType.text,
                  maxLength: 6,
                ),
              if (otpSent) const SizedBox(height: 10),

              const SizedBox(height: 15),

              // Button
              ElevatedButton(
                onPressed: handleOtpAction,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.black,
                  minimumSize: const Size(double.infinity, 50),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: Text(
                  otpSent ? "Verify OTP" : "Send OTP",
                  style: const TextStyle(color: Colors.white),
                ),
              ),

              const SizedBox(height: 40),
            ],
          ),
        ),
      ),
    );
  }
}

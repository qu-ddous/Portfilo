import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'dart:convert';
import 'package:image_picker/image_picker.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../providers/auth_provider.dart';
import '../../config/theme.dart';

class ProfileScreen extends ConsumerStatefulWidget {
  const ProfileScreen({super.key});

  @override
  ConsumerState<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends ConsumerState<ProfileScreen> {
  final ImagePicker _picker = ImagePicker();

  Future<void> _pickAvatar() async {
    final XFile? image = await _picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 400,
      maxHeight: 400,
      imageQuality: 80,
    );

    if (image != null) {
      final bytes = await image.readAsBytes();
      final base64String = 'data:image/webp;base64,${base64Encode(bytes)}';
      
      final success = await ref.read(authProvider.notifier).updateProfile({
        'avatar': base64String,
      });

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Profile Photo Synchronized!", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
            backgroundColor: AppTheme.primaryEmerald,
            behavior: SnackBarBehavior.floating,
          ),
        );
      }
    }
  }

  void _showEditProfileSheet() {
    final user = ref.read(authProvider).user;
    final ageController = TextEditingController(text: user?.age?.toString() ?? '');
    final weightController = TextEditingController(text: user?.currentWeightKg?.toString() ?? '');
    final heightController = TextEditingController(text: user?.heightCm?.toString() ?? '');
    String selectedGoal = user?.fitnessGoal ?? 'maintenance';
    String selectedActivity = user?.activityLevel ?? 'moderately_active';
    String selectedGender = user?.gender ?? 'male';

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setSheetState) => Container(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          decoration: BoxDecoration(
            color: Theme.of(context).scaffoldBackgroundColor,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
          ),
          child: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(
                      width: 40, height: 4,
                      decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(2)),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text("Edit Physical Profile", style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800)),
                  const SizedBox(height: 24),
                  _buildSheetDropdown("Gender", selectedGender, ['male', 'female'], (val) => setSheetState(() => selectedGender = val!)),
                  const SizedBox(height: 16),
                  _buildSheetTextField("Age", ageController, TextInputType.number),
                  const SizedBox(height: 16),
                  _buildSheetTextField("Weight (kg)", weightController, TextInputType.number),
                  const SizedBox(height: 16),
                  _buildSheetTextField("Height (cm)", heightController, TextInputType.number),
                  const SizedBox(height: 16),
                  _buildSheetDropdown("Fitness Goal", selectedGoal, ['weight_loss', 'maintenance', 'muscle_gain'], (val) => setSheetState(() => selectedGoal = val!)),
                  const SizedBox(height: 16),
                  _buildSheetDropdown("Activity Level", selectedActivity, ['sedentary', 'lightly_active', 'moderately_active', 'very_active'], (val) => setSheetState(() => selectedActivity = val!)),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    height: 56,
                    child: ElevatedButton(
                      onPressed: () async {
                        final success = await ref.read(authProvider.notifier).updateProfile({
                          'age': int.tryParse(ageController.text),
                          'current_weight_kg': double.tryParse(weightController.text),
                          'height_cm': double.tryParse(heightController.text),
                          'fitness_goal': selectedGoal,
                          'activity_level': selectedActivity,
                          'gender': selectedGender,
                        });

                        if (success && mounted) {
                          if (!context.mounted) return;
                          Navigator.pop(context);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text("Profile Updated!", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)), backgroundColor: AppTheme.primaryEmerald),
                          );
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryEmerald,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: Text("Save Profile Changes", style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700, color: Colors.white)),
                    ),
                  ),
                  const SizedBox(height: 20),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSheetTextField(String label, TextEditingController controller, TextInputType type) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.grey)),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          keyboardType: type,
          decoration: InputDecoration(
            filled: true,
            fillColor: Colors.grey.withValues(alpha: 0.05),
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
          ),
        ),
      ],
    );
  }

  Widget _buildSheetDropdown(String label, String value, List<String> items, Function(String?) onChanged) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w600, color: Colors.grey)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(12)),
          child: DropdownButton<String>(
            value: value,
            isExpanded: true,
            underline: const SizedBox(),
            items: items.map((e) => DropdownMenuItem(value: e, child: Text(e.replaceAll('_', ' ').toUpperCase(), style: GoogleFonts.outfit(fontSize: 14)))).toList(),
            onChanged: onChanged,
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authProvider);
    final user = auth.user;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(24, 60, 24, 100),
        child: Column(
          children: [
            // Avatar section
            Center(
              child: Stack(
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      border: Border.all(color: AppTheme.primaryEmerald, width: 3),
                      boxShadow: [
                        BoxShadow(color: AppTheme.primaryEmerald.withValues(alpha: 0.2), blurRadius: 20, offset: const Offset(0, 8)),
                      ],
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(4),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(60),
                        child: user?.avatar != null 
                          ? (user!.avatar!.startsWith('data:') 
                             ? Image.memory(base64Decode(user.avatar!.split(',').last), fit: BoxFit.cover)
                             : CachedNetworkImage(imageUrl: user.avatar!, fit: BoxFit.cover, errorWidget: (c, url, e) => const Icon(Icons.person, size: 60)))
                          : Icon(Icons.person, size: 60, color: Colors.grey.withValues(alpha: 0.5)),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 0, right: 0,
                    child: GestureDetector(
                      onTap: _pickAvatar,
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: const BoxDecoration(color: AppTheme.primaryEmerald, shape: BoxShape.circle),
                        child: const Icon(Icons.camera_alt_rounded, color: Colors.white, size: 18),
                      ),
                    ),
                  ),
                ],
              ),
            ).animate().fadeIn().scale(),
            
            const SizedBox(height: 20),
            Text(user?.name ?? "VitaFit User", style: GoogleFonts.outfit(fontSize: 26, fontWeight: FontWeight.w800)),
            Text(user?.email ?? "", style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.w500)),
            
            const SizedBox(height: 32),
            // Metric Cards
            Row(
              children: [
                Expanded(child: _buildMetricCard("Weight", "${user?.currentWeightKg?.toStringAsFixed(1) ?? '--'} kg", Icons.monitor_weight_outlined, AppTheme.primaryEmerald)),
                const SizedBox(width: 16),
                Expanded(child: _buildMetricCard("Height", "${user?.heightCm?.toStringAsFixed(0) ?? '--'} cm", Icons.height_rounded, AppTheme.infoBlue)),
              ],
            ).animate().slideY(begin: 0.1),
            
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildMetricCard("Goal", user?.fitnessGoal?.replaceAll('_', ' ').toUpperCase() ?? "--", Icons.flag_rounded, AppTheme.secondaryAmber)),
              ],
            ).animate().slideY(begin: 0.2),
            
            const SizedBox(height: 40),
            // Settings List
            _buildSettingsItem("Personal Information", Icons.person_outline_rounded, isDark, _showEditProfileSheet),
            _buildSettingsItem("Appearance", Icons.palette_outlined, isDark, () {}),
            _buildSettingsItem("Notifications", Icons.notifications_none_rounded, isDark, () {}),
            _buildSettingsItem("Privacy & Security", Icons.shield_outlined, isDark, () {}),
            const SizedBox(height: 20),
            _buildSettingsItem("Logout", Icons.logout_rounded, isDark, () => ref.read(authProvider.notifier).logout(), isDestructive: true),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.05),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: color.withValues(alpha: 0.1)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Icon(icon, color: color, size: 24),
          const SizedBox(height: 12),
          Text(value, style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800, color: color)),
          Text(label, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }

  Widget _buildSettingsItem(String title, IconData icon, bool isDark, VoidCallback onTap, {bool isDestructive = false}) {
    final color = isDestructive ? AppTheme.errorRed : (isDark ? Colors.white : Colors.black87);
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.surfaceDark : Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey.withValues(alpha: 0.05)),
          ),
          child: Row(
            children: [
              Icon(icon, color: color.withValues(alpha: 0.7), size: 22),
              const SizedBox(width: 16),
              Expanded(child: Text(title, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600, color: color))),
              Icon(Icons.chevron_right_rounded, color: Colors.grey.withValues(alpha: 0.5)),
            ],
          ),
        ),
      ),
    );
  }
}


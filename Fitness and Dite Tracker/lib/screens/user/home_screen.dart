import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../providers/auth_provider.dart';
import '../../providers/meal_provider.dart';
import '../../providers/workout_provider.dart';
import '../../config/theme.dart';
import 'main_navigation.dart';
import 'notifications_screen.dart';
import 'ai_coach_screen.dart';
import '../../providers/notification_provider.dart';
import '../../widgets/animated_icon_wrapper.dart';
import '../../utils/health_calculator.dart';

class UserHomeScreen extends ConsumerStatefulWidget {
  const UserHomeScreen({super.key});

  @override
  ConsumerState<UserHomeScreen> createState() => _UserHomeScreenState();
}

class _UserHomeScreenState extends ConsumerState<UserHomeScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(mealProvider.notifier).fetchTodayStats();
      ref.read(workoutProvider.notifier).fetchAssignedWorkouts();
      ref.read(workoutProvider.notifier).fetchAvailableWorkouts();
    });
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).user;
    final mealState = ref.watch(mealProvider);
    final workoutState = ref.watch(workoutProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final now = DateTime.now();
    final greeting = _getGreeting(now.hour);
    final dateStr = DateFormat('EE, MMM d').format(now);

    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Stack(
        children: [
          // Background Gradient
          Positioned.fill(
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: isDark 
                    ? [const Color(0xFF0F172A), const Color(0xFF1E293B)]
                    : [const Color(0xFFF8FAFC), const Color(0xFFF1F5F9)],
                ),
              ),
            ),
          ),
          
          // Header Background
          Positioned(
            top: 0,
            left: 0,
            right: 0,
            height: 240,
            child: Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                  colors: [AppTheme.primaryEmerald, Color(0xFF059669)],
                ),
                borderRadius: const BorderRadius.vertical(bottom: Radius.circular(40)),
                boxShadow: [
                  BoxShadow(color: AppTheme.primaryEmerald.withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 10)),
                ],
              ),
            ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.2),
          ),

          SafeArea(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 10),
                  // App Bar Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      GestureDetector(
                        onTap: () => rootScaffoldKey.currentState?.openDrawer(),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(12)),
                          child: const Icon(Icons.menu_rounded, color: Colors.white),
                        ),
                      ),
                      Text(
                        "VitaFit",
                        style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white, letterSpacing: 0.5),
                      ),
                      _buildNotificationIcon(context),
                    ],
                  ).animate().fadeIn(delay: 200.ms),
                  
                  const SizedBox(height: 24),
                  // Welcome Row
                  _buildWelcomeHeader(user, greeting, dateStr),
                  
                  const SizedBox(height: 30),
                  // Health Overview Card (Nutrition + BMI)
                  _buildHealthCard(mealState, user, isDark).animate().scale(delay: 400.ms, curve: Curves.easeOutBack),
                  
                  const SizedBox(height: 24),
                  // Quick Hydration Card
                  _buildQuickHydrationCard(mealState, isDark).animate().fadeIn(delay: 450.ms).slideY(begin: 0.1),

                  const SizedBox(height: 24),
                  // AI Coach Prompt
                  _buildAICoachCard(context, isDark).animate().fadeIn(delay: 500.ms),
                  
                  const SizedBox(height: 32),
                  // Section Title
                  _buildSectionHeader("Suggested Workouts", () {}),
                  const SizedBox(height: 16),
                  _buildWorkoutGrid(context, isDark, workoutState.availableWorkouts),
                  
                  const SizedBox(height: 32),
                  _buildSectionHeader("Today's Fuel", () {}),
                  const SizedBox(height: 16),
                  _buildFuelTimeline(mealState, context, isDark),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickHydrationCard(MealState state, bool isDark) {
    final waterData = state.todayStats?['water_logs'] ?? {'total_ml': 0, 'goal_ml': 2500};
    final double totalMl = (waterData['total_ml'] ?? 0).toDouble();
    final double goalMl = (waterData['goal_ml'] ?? 2500).toDouble();
    final progress = (totalMl / goalMl).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10)],
      ),
      child: Row(
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              SizedBox(
                width: 60, height: 60,
                child: CircularProgressIndicator(
                  value: progress,
                  strokeWidth: 6,
                  backgroundColor: AppTheme.infoBlue.withValues(alpha: 0.1),
                  valueColor: const AlwaysStoppedAnimation(AppTheme.infoBlue),
                ),
              ),
              const Icon(Icons.water_drop_rounded, color: AppTheme.infoBlue, size: 24),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text("Hydration", style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800)),
                Text("${totalMl.toInt()} / ${goalMl.toInt()} ml", style: GoogleFonts.outfit(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.w600)),
              ],
            ),
          ),
          _buildQuickWaterButton(Icons.remove_rounded, () {
             ref.read(mealProvider.notifier).logWater(-250);
          }),
          const SizedBox(width: 8),
          _buildQuickWaterButton(Icons.add_rounded, () {
             ref.read(mealProvider.notifier).logWater(250);
          }, isPrimary: true),
        ],
      ),
    );
  }

  Widget _buildQuickWaterButton(IconData icon, VoidCallback onTap, {bool isPrimary = false}) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(8),
        decoration: BoxDecoration(
          color: isPrimary ? AppTheme.infoBlue : AppTheme.infoBlue.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: isPrimary ? Colors.white : AppTheme.infoBlue, size: 20),
      ),
    );
  }

  Widget _buildWelcomeHeader(dynamic user, String greeting, String dateStr) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "$greeting, ${user?.name.split(' ').first ?? 'User'}",
                style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w700, color: Colors.white),
                overflow: TextOverflow.ellipsis,
              ),
              Text(
                dateStr,
                style: GoogleFonts.outfit(fontSize: 14, color: Colors.white.withValues(alpha: 0.8), fontWeight: FontWeight.w500),
              ),
            ],
          ),
        ),
        const SizedBox(width: 12),
        _buildStreakBadge(),
      ],
    ).animate().fadeIn(delay: 300.ms).slideX(begin: -0.1);
  }

  Widget _buildStreakBadge() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: AppTheme.secondaryAmber.withValues(alpha: 0.9),
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 8)],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Icon(Icons.local_fire_department_rounded, color: Colors.white, size: 20),
          const SizedBox(width: 6),
          Text("5 Day Streak", style: GoogleFonts.outfit(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 13)),
        ],
      ),
    );
  }

  Widget _buildHealthCard(MealState state, dynamic user, bool isDark) {
    final stats = state.todayStats;
    final goals = state.calculatedGoals;

    final consumedKcal = (stats?['daily_totals']?['calories'] ?? 0).toDouble();
    final targetKcal = goals != null ? (goals['calories'] ?? 2000.0) : 2000.0;
    
    final consumedProt = (stats?['daily_totals']?['protein_grams'] ?? 0).toDouble();
    final targetProt = goals != null ? (goals['protein'] ?? 150.0) : 150.0;
    
    final consumedCarbs = (stats?['daily_totals']?['carbs_grams'] ?? 0).toDouble();
    final targetCarbs = goals != null ? (goals['carbs'] ?? 250.0) : 250.0;

    final consumedFats = (stats?['daily_totals']?['fats_grams'] ?? 0).toDouble();
    final targetFats = goals != null ? (goals['fats'] ?? 70.0) : 70.0;

    final progress = consumedKcal / targetKcal;

    // BMI Calculation
    double? bmi;
    if (user?.currentWeightKg != null && user?.heightCm != null) {
      bmi = HealthCalculator.calculateBMI(user!.currentWeightKg!, user!.heightCm!);
    }

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 20, offset: const Offset(0, 10))],
      ),
      child: Column(
        children: [
          Row(
            children: [
              SizedBox(
                width: 130,
                height: 130,
                child: Stack(
                  fit: StackFit.expand,
                  children: [
                    CircularProgressIndicator(
                      value: progress.clamp(0.0, 1.0),
                      strokeWidth: 14,
                      strokeCap: StrokeCap.round,
                      backgroundColor: isDark ? Colors.white.withValues(alpha: 0.05) : Colors.grey.withValues(alpha: 0.1),
                      valueColor: const AlwaysStoppedAnimation(AppTheme.primaryEmerald),
                    ),
                    Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Text(consumedKcal.toInt().toString(), style: GoogleFonts.outfit(fontSize: 32, fontWeight: FontWeight.w800)),
                          Text("of ${targetKcal.toInt()} kcal", style: GoogleFonts.outfit(fontSize: 12, fontWeight: FontWeight.w500, color: Colors.grey)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("Daily Health", style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 8),
                    if (bmi != null) ...[
                      Row(
                        children: [
                          Text("BMI:", style: GoogleFonts.outfit(color: Colors.grey, fontWeight: FontWeight.w600)),
                          const SizedBox(width: 4),
                          Text(bmi.toStringAsFixed(1), style: GoogleFonts.outfit(color: AppTheme.primaryEmerald, fontWeight: FontWeight.w800)),
                        ],
                      ),
                    ],
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(color: AppTheme.primaryEmerald.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                      child: Text(
                        "${(targetKcal - consumedKcal).toInt().clamp(0, 5000)} kcal remaining",
                        style: GoogleFonts.outfit(fontSize: 12, color: AppTheme.primaryEmerald, fontWeight: FontWeight.w700),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 32),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildMacroProgress("Protein", consumedProt, targetProt, AppTheme.primaryEmerald),
              _buildMacroProgress("Carbs", consumedCarbs, targetCarbs, AppTheme.infoBlue),
              _buildMacroProgress("Fats", consumedFats, targetFats, AppTheme.secondaryAmber),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMacroProgress(String label, double consumed, double target, Color color) {
    final progress = (consumed / target).clamp(0.0, 1.0);
    return Column(
      children: [
        SizedBox(
          width: 80,
          child: Column(
            children: [
              Text("${consumed.toInt()}g / ${target.toInt()}g", style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700)),
              const SizedBox(height: 6),
              ClipRRect(
                borderRadius: BorderRadius.circular(4),
                child: LinearProgressIndicator(
                  value: progress,
                  backgroundColor: color.withValues(alpha: 0.1),
                  valueColor: AlwaysStoppedAnimation(color),
                  minHeight: 6,
                ),
              ),
              const SizedBox(height: 4),
              Text(label, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w600)),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildNotificationIcon(BuildContext context) {
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NotificationsScreen())),
      child: Consumer(
        builder: (context, ref, _) {
          final unreadCount = ref.watch(notificationProvider).unreadCount;
          return Stack(
            clipBehavior: Clip.none,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: Colors.white.withValues(alpha: 0.2), borderRadius: BorderRadius.circular(12)),
                child: const Icon(Icons.notifications_none_rounded, color: Colors.white),
              ),
              if (unreadCount > 0)
                Positioned(
                  top: -2, right: -2,
                  child: Container(
                    padding: const EdgeInsets.all(5),
                    decoration: const BoxDecoration(color: AppTheme.errorRed, shape: BoxShape.circle),
                    child: Text(unreadCount.toString(), style: const TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }

  String _getGreeting(int hour) {
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }

  Widget _buildSectionHeader(String title, VoidCallback onTap) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(title, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800)),
        GestureDetector(
          onTap: onTap,
          child: Text("See All", style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.w700, color: AppTheme.primaryEmerald)),
        ),
      ],
    );
  }

  Widget _buildAICoachCard(BuildContext context, bool isDark) {
    return GestureDetector(
      onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AICoachScreen())),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: isDark 
              ? [const Color(0xFF1E3A8A).withValues(alpha: 0.3), const Color(0xFF3B82F6).withValues(alpha: 0.2)]
              : [const Color(0xFFDBEAFE), const Color(0xFFEFF6FF)],
          ),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: AppTheme.infoBlue.withValues(alpha: 0.2)),
        ),
        child: Row(
          children: [
            const AnimatedIconWrapper(child: Icon(Icons.auto_awesome_rounded, color: AppTheme.infoBlue, size: 28)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Ask VitaAI Coach", style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700, color: isDark ? Colors.white : const Color(0xFF1E40AF))),
                  Text("Get personalized diet & workout tips", style: GoogleFonts.outfit(fontSize: 13, color: isDark ? Colors.white70 : const Color(0xFF3B82F6))),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios_rounded, size: 16, color: isDark ? Colors.white30 : AppTheme.infoBlue),
          ],
        ),
      ),
    );
  }

  Widget _buildWorkoutGrid(BuildContext context, bool isDark, List<dynamic> availableWorkouts) {
    // If empty, fetchAvailableWorkouts in provider will handle mock data but we should ensure it's not actually null
    final displayWorkouts = availableWorkouts.take(4).toList();
    
    if (displayWorkouts.isEmpty) {
      return Container(
        height: 120, 
        width: double.infinity,
        decoration: BoxDecoration(color: isDark ? AppTheme.surfaceDark : Colors.white, borderRadius: BorderRadius.circular(24)),
        alignment: Alignment.center, 
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.fitness_center_rounded, color: Colors.grey, size: 32),
            const SizedBox(height: 8),
            Text("Finding best workouts for you...", style: GoogleFonts.outfit(color: Colors.grey, fontWeight: FontWeight.w600)),
          ],
        ),
      );
    }
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, mainAxisSpacing: 16, crossAxisSpacing: 16, childAspectRatio: 0.82),
      itemCount: displayWorkouts.length,
      itemBuilder: (context, index) {
        final w = displayWorkouts[index];
        return InkWell(
          onTap: () => _showWorkoutDetail(context, w, isDark),
          borderRadius: BorderRadius.circular(28),
          child: Container(
            decoration: BoxDecoration(
              color: isDark ? AppTheme.surfaceDark : Colors.white,
              borderRadius: BorderRadius.circular(28),
              boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 15, offset: const Offset(0, 8))],
              border: Border.all(color: Colors.grey.withValues(alpha: 0.05)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Expanded(
                  child: Stack(
                    children: [
                      Container(
                        width: double.infinity,
                        decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.1), borderRadius: const BorderRadius.vertical(top: Radius.circular(28))),
                        child: ClipRRect(
                          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
                          child: w['image_url'] != null 
                            ? CachedNetworkImage(imageUrl: w['image_url'], fit: BoxFit.cover, errorWidget: (c, e, x) => const Icon(Icons.fitness_center)) 
                            : const Icon(Icons.fitness_center),
                        ),
                      ),
                      Positioned(
                        top: 10, right: 10,
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: AppTheme.secondaryAmber, borderRadius: BorderRadius.circular(10)),
                          child: Text(w['difficulty']?.toString().toUpperCase() ?? 'INT', style: GoogleFonts.outfit(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white)),
                        ),
                      ),
                    ],
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(w['name'] ?? "Workout", style: GoogleFonts.outfit(fontSize: 15, fontWeight: FontWeight.w800), maxLines: 1, overflow: TextOverflow.ellipsis),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          const Icon(Icons.timer_outlined, size: 14, color: Colors.grey),
                          const SizedBox(width: 4),
                          Text("${w['duration_minutes'] ?? 30} min", style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildFuelTimeline(MealState state, BuildContext context, bool isDark) {
    final meals = state.todayStats?['meals_logged'] as List? ?? [];
    if (meals.isEmpty) {
      return Container(
        width: double.infinity,
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(color: isDark ? AppTheme.surfaceDark : Colors.white, borderRadius: BorderRadius.circular(24)),
        child: Column(
          children: [
            const Icon(Icons.restaurant_rounded, size: 40, color: Colors.grey),
            const SizedBox(height: 12),
            Text("No meals logged yet", style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.grey)),
          ],
        ),
      );
    }

    return ListView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: meals.length,
      itemBuilder: (c, index) {
        final m = meals[index];
        final mealData = m['meals'] ?? {};
        final nutrition = (mealData['meal_nutrition'] as List?)?.isNotEmpty == true 
            ? mealData['meal_nutrition'][0] 
            : {};
        final qty = (m['quantity_served'] as num?)?.toDouble() ?? 1.0;
        final calories = ((nutrition['calories'] as num?)?.toDouble() ?? 0) * qty;

        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.surfaceDark : Colors.white,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.grey.withValues(alpha: 0.1)),
          ),
          child: Row(
            children: [
              Container(
                width: 44, height: 44,
                decoration: BoxDecoration(color: AppTheme.primaryEmerald.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                child: mealData['image_url'] != null 
                  ? ClipRRect(borderRadius: BorderRadius.circular(10), child: CachedNetworkImage(imageUrl: mealData['image_url'], fit: BoxFit.cover))
                  : const Icon(Icons.restaurant_rounded, color: AppTheme.primaryEmerald),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(mealData['name'] ?? 'Meal', style: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 15)),
                    Text(mealData['meal_type'] ?? 'Snack', style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w500)),
                  ],
                ),
              ),
              Text("${calories.toInt()} kcal", style: GoogleFonts.outfit(fontWeight: FontWeight.w800, fontSize: 16, color: AppTheme.primaryEmerald)),
            ],
          ),
        );
      },
    );
  }

  void _showWorkoutDetail(BuildContext context, dynamic workout, bool isDark) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        height: MediaQuery.of(context).size.height * 0.75,
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1F2937) : Colors.white,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Column(
          children: [
            const SizedBox(height: 12),
            Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[300], borderRadius: BorderRadius.circular(2))),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.all(24),
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(24),
                    child: workout['image_url'] != null 
                      ? CachedNetworkImage(imageUrl: workout['image_url'], height: 200, width: double.infinity, fit: BoxFit.cover)
                      : Container(height: 200, color: AppTheme.primaryEmerald.withValues(alpha: 0.1), child: const Icon(Icons.fitness_center, size: 64, color: AppTheme.primaryEmerald)),
                  ),
                  const SizedBox(height: 24),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Expanded(child: Text(workout['name'] ?? "Workout", style: GoogleFonts.outfit(fontSize: 24, fontWeight: FontWeight.w800))),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        decoration: BoxDecoration(color: AppTheme.secondaryAmber.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
                        child: Text(workout['difficulty']?.toString().toUpperCase() ?? "INT", style: GoogleFonts.outfit(color: AppTheme.secondaryAmber, fontWeight: FontWeight.w800, fontSize: 12)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      const Icon(Icons.timer_outlined, size: 18, color: Colors.grey),
                      const SizedBox(width: 6),
                      Text("${workout['duration_minutes'] ?? 30} minutes", style: GoogleFonts.outfit(color: Colors.grey, fontWeight: FontWeight.w600)),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text("About this Workout", style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 8),
                  Text(
                    workout['description'] ?? "This workout is designed to help you reach your physical goals with scientifically backed exercises.",
                    style: GoogleFonts.outfit(color: Colors.grey[600], height: 1.5),
                  ),
                  const SizedBox(height: 32),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pop(context);
                        // In a real app we'd navigate to the full workout logging screen
                        ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text("Going to Start Workout!")));
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryEmerald,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 18),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 0,
                      ),
                      child: Text("Start Workout Now", style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}



import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../config/theme.dart';
import 'exercise_library_screen.dart';

class WorkoutLogScreen extends StatefulWidget {
  const WorkoutLogScreen({super.key});

  @override
  State<WorkoutLogScreen> createState() => _WorkoutLogScreenState();
}

class _WorkoutLogScreenState extends State<WorkoutLogScreen> {
  int _currentStep = 0;
  int _selectedEffort = 2;
  final List<_ExerciseEntry> _exercises = [
    const _ExerciseEntry("Bench Press", 3, 10, 60),
    const _ExerciseEntry("Lateral Raises", 3, 15, 8),
  ];

  final List<_EffortLevel> _effortLevels = const [
    _EffortLevel("Chill", Icons.sentiment_satisfied_rounded, AppTheme.infoBlue),
    _EffortLevel("Moderate", Icons.sentiment_neutral_rounded, AppTheme.primaryEmerald),
    _EffortLevel("Hard", Icons.sentiment_dissatisfied_rounded, AppTheme.secondaryAmber),
    _EffortLevel("Beast", Icons.fitness_center_rounded, AppTheme.errorRed),
  ];

  void _goToStep(int step) {
    setState(() => _currentStep = step.clamp(0, 2));
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text("Log Activity", style: GoogleFonts.outfit(fontWeight: FontWeight.w800)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildStepIndicator(isDark),
            const SizedBox(height: 40),
            AnimatedSwitcher(
              duration: const Duration(milliseconds: 300),
              child: _currentStep == 0 
                ? _buildStepIntensity(isDark)
                : _currentStep == 1 
                  ? _buildStepExercises(isDark)
                  : _buildStepSummary(isDark),
            ),
            const SizedBox(height: 48),
            _buildNavigationButtons(isDark),
          ],
        ),
      ),
    );
  }

  Widget _buildStepIndicator(bool isDark) {
    final steps = ["Effort", "Ex", "Log"];
    return Row(
      children: List.generate(steps.length, (i) {
        final isActive = i == _currentStep;
        final isDone = i < _currentStep;
        return Expanded(
          child: Row(
            children: [
              Container(
                width: 32, height: 32,
                decoration: BoxDecoration(
                  color: isActive ? AppTheme.primaryEmerald : (isDone ? AppTheme.primaryEmerald.withValues(alpha: 0.2) : Colors.grey.withValues(alpha: 0.1)),
                  shape: BoxShape.circle,
                ),
                child: Center(
                  child: isDone 
                    ? const Icon(Icons.check_rounded, color: AppTheme.primaryEmerald, size: 16)
                    : Text("${i+1}", style: GoogleFonts.outfit(fontSize: 14, fontWeight: FontWeight.bold, color: isActive ? Colors.white : Colors.grey)),
                ),
              ),
              const SizedBox(width: 8),
              if (i < steps.length - 1)
                Expanded(child: Container(height: 2, color: isDone ? AppTheme.primaryEmerald : Colors.grey.withValues(alpha: 0.1))),
              if (i < steps.length - 1) const SizedBox(width: 8),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildStepIntensity(bool isDark) {
    return Column(
      key: const ValueKey(0),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Intensity Level", style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800)),
        const SizedBox(height: 24),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 2, crossAxisSpacing: 16, mainAxisSpacing: 16, childAspectRatio: 1.1),
          itemCount: _effortLevels.length,
          itemBuilder: (context, i) {
            final level = _effortLevels[i];
            final isSelected = _selectedEffort == i;
            return GestureDetector(
              onTap: () => setState(() => _selectedEffort = i),
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                decoration: BoxDecoration(
                  color: isSelected ? level.color.withValues(alpha: 0.1) : (isDark ? AppTheme.surfaceDark : Colors.white),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: isSelected ? level.color : Colors.transparent, width: 2),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(level.icon, color: level.color, size: 36),
                    const SizedBox(height: 8),
                    Text(level.label, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700, color: isSelected ? level.color : (isDark ? Colors.white : Colors.black87))),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    ).animate().fadeIn();
  }

  Widget _buildStepExercises(bool isDark) {
    return Column(
      key: const ValueKey(1),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text("Exercises", style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800)),
            TextButton.icon(
              onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ExerciseLibraryScreen())),
              icon: const Icon(Icons.add_rounded, size: 18),
              label: Text("Add From Library", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
              style: TextButton.styleFrom(foregroundColor: AppTheme.primaryEmerald),
            ),
          ],
        ),
        const SizedBox(height: 16),
        ..._exercises.asMap().entries.map((entry) {
          final i = entry.key;
          final ex = entry.value;
          return Container(
            margin: const EdgeInsets.only(bottom: 12),
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: isDark ? AppTheme.surfaceDark : Colors.white, borderRadius: BorderRadius.circular(24)),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(ex.name, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w700)),
                      const SizedBox(height: 8),
                      Row(
                        children: [
                          _smallBadge("${ex.sets} sets", AppTheme.primaryEmerald),
                          const SizedBox(width: 8),
                          _smallBadge("${ex.weight}kg", AppTheme.secondaryAmber),
                        ],
                      ),
                    ],
                  ),
                ),
                IconButton(onPressed: () => setState(() => _exercises.removeAt(i)), icon: const Icon(Icons.close_rounded, size: 20, color: Colors.grey)),
              ],
            ),
          );
        }),
      ],
    ).animate().fadeIn();
  }

  Widget _smallBadge(String text, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
      child: Text(text, style: GoogleFonts.outfit(fontSize: 11, fontWeight: FontWeight.w700, color: color)),
    );
  }

  Widget _buildStepSummary(bool isDark) {
    final effort = _effortLevels[_selectedEffort];
    return Column(
      key: const ValueKey(2),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text("Mission Summary", style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800)),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(color: AppTheme.primaryEmerald.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(28)),
          child: Column(
            children: [
              _summaryTile("Intensity", effort.label, effort.icon, effort.color),
              const Divider(height: 32),
              _summaryTile("Volume", "${_exercises.length} Exercises", Icons.fitness_center_rounded, AppTheme.infoBlue),
              const Divider(height: 32),
              _summaryTile("Workload", "${_exercises.fold(0, (s, e) => s + e.sets)} Total Sets", Icons.bolt_rounded, AppTheme.secondaryAmber),
            ],
          ),
        ),
      ],
    ).animate().fadeIn();
  }

  Widget _summaryTile(String label, String val, IconData icon, Color color) {
    return Row(
      children: [
        Container(padding: const EdgeInsets.all(10), decoration: BoxDecoration(color: color.withValues(alpha: 0.1), shape: BoxShape.circle), child: Icon(icon, color: color, size: 20)),
        const SizedBox(width: 16),
        Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(label, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w600)),
          Text(val, style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800)),
        ]),
      ],
    );
  }

  Widget _buildNavigationButtons(bool isDark) {
    return Row(
      children: [
        if (_currentStep > 0)
          GestureDetector(
            onTap: () => _goToStep(_currentStep - 1),
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(16)),
              child: const Icon(Icons.arrow_back_rounded),
            ),
          ),
        if (_currentStep > 0) const SizedBox(width: 16),
        Expanded(
          child: SizedBox(
            height: 56,
            child: ElevatedButton(
              onPressed: () {
                if (_currentStep < 2) {
                  _goToStep(_currentStep + 1);
                } else {
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("Activity Synchronized!", style: GoogleFonts.outfit(fontWeight: FontWeight.w700)), backgroundColor: AppTheme.primaryEmerald),
                  );
                }
              },
              style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryEmerald, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
              child: Text(_currentStep < 2 ? "Continue" : "Log Activity", style: GoogleFonts.outfit(fontWeight: FontWeight.w700, color: Colors.white, fontSize: 16)),
            ),
          ),
        ),
      ],
    );
  }
}

class _EffortLevel {
  final String label;
  final IconData icon;
  final Color color;
  const _EffortLevel(this.label, this.icon, this.color);
}

class _ExerciseEntry {
  final String name;
  final int sets;
  final int reps;
  final double weight;
  const _ExerciseEntry(this.name, this.sets, this.reps, this.weight);
}

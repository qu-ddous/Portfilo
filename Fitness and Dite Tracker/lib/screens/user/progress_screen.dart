import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../providers/weight_provider.dart';
import '../../providers/water_provider.dart';
import '../../widgets/animated_icon_wrapper.dart';
import '../../config/theme.dart';

class ProgressScreen extends ConsumerStatefulWidget {
  const ProgressScreen({super.key});

  @override
  ConsumerState<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends ConsumerState<ProgressScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      ref.read(weightProvider.notifier).fetchHistory();
      ref.read(waterProvider.notifier).fetchToday();
    });
  }

  void _showAddWeightSheet() {
    final weightController = TextEditingController();
    final noteController = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => Container(
        padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
        decoration: BoxDecoration(
          color: Theme.of(context).scaffoldBackgroundColor,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        ),
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(2))),
              ),
              const SizedBox(height: 24),
              Text("Log Today's Weight", style: GoogleFonts.outfit(fontSize: 22, fontWeight: FontWeight.w800)),
              const SizedBox(height: 24),
              TextField(
                controller: weightController,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: InputDecoration(
                  labelText: "Current Weight (kg)",
                  labelStyle: GoogleFonts.outfit(),
                  filled: true,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: noteController,
                decoration: InputDecoration(
                  labelText: "Notes (how do you feel?)",
                  labelStyle: GoogleFonts.outfit(),
                  filled: true,
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
              const SizedBox(height: 32),
              SizedBox(
                width: double.infinity,
                height: 56,
                child: ElevatedButton(
                  onPressed: () async {
                    final w = double.tryParse(weightController.text);
                    if (w != null) {
                      await ref.read(weightProvider.notifier).logWeight(w, noteController.text);
                      if (context.mounted) Navigator.pop(context);
                    }
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: AppTheme.primaryEmerald, shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16))),
                  child: Text("Save Entry", style: GoogleFonts.outfit(fontWeight: FontWeight.w700, color: Colors.white)),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final weightState = ref.watch(weightProvider);
    final waterState = ref.watch(waterProvider);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      body: RefreshIndicator(
        onRefresh: () async {
          await ref.read(weightProvider.notifier).fetchHistory();
          await ref.read(waterProvider.notifier).fetchToday();
        },
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 60, 24, 100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("My Analytics", style: GoogleFonts.outfit(fontSize: 28, fontWeight: FontWeight.w900)),
                      Text("Track your body's transformation", style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.w500)),
                    ],
                  ),
                  GestureDetector(
                    onTap: _showAddWeightSheet,
                    child: Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(color: AppTheme.primaryEmerald.withValues(alpha: 0.1), shape: BoxShape.circle),
                      child: const Icon(Icons.add_rounded, color: AppTheme.primaryEmerald, size: 28),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 32),
              
              _buildWaterTracker(waterState, isDark),
              const SizedBox(height: 32),

              _buildSectionHeader("Weight Trend"),
              const SizedBox(height: 16),
              if (weightState.isLoading && weightState.history.isEmpty)
                const Center(child: CircularProgressIndicator())
              else
                _buildWeightChart(weightState, isDark),
              
              const SizedBox(height: 32),
              _buildSummaryPills(weightState, isDark),
              
              const SizedBox(height: 32),
              _buildSectionHeader("Weight Timeline"),
              const SizedBox(height: 16),
              _buildHistoryTimeline(weightState, isDark),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Text(title, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800));
  }

  Widget _buildWaterTracker(WaterState state, bool isDark) {
    final progress = (state.totalMl / state.goalMl).clamp(0.0, 1.0);
    
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(28),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 15)],
      ),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text("Hydration", style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800)),
                  Text("${state.totalMl} / ${state.goalMl} ml", style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.w600)),
                ],
              ),
              const AnimatedIconWrapper(child: Icon(Icons.water_drop_rounded, color: Colors.blueAccent, size: 32)),
            ],
          ),
          const SizedBox(height: 24),
          Stack(
            children: [
              Container(
                height: 14,
                width: double.infinity,
                decoration: BoxDecoration(color: Colors.blueAccent.withValues(alpha: 0.08), borderRadius: BorderRadius.circular(7)),
              ),
              AnimatedContainer(
                duration: const Duration(milliseconds: 1000),
                height: 14,
                width: MediaQuery.of(context).size.width * 0.7 * progress,
                decoration: BoxDecoration(
                  gradient: const LinearGradient(colors: [Color(0xFF60A5FA), Colors.blueAccent]),
                  borderRadius: BorderRadius.circular(7),
                  boxShadow: [BoxShadow(color: Colors.blueAccent.withValues(alpha: 0.2), blurRadius: 8, offset: const Offset(0, 4))],
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(child: _waterButton(250, "Glass", isDark)),
              const SizedBox(width: 12),
              Expanded(child: _waterButton(500, "Bottle", isDark)),
            ],
          ),
        ],
      ),
    ).animate().fadeIn().slideY(begin: 0.1);
  }

  Widget _waterButton(int amount, String label, bool isDark) {
    return InkWell(
      onTap: () => ref.read(waterProvider.notifier).logWater(amount),
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(
          color: Colors.blueAccent.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.blueAccent.withValues(alpha: 0.1)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.add_rounded, size: 16, color: Colors.blueAccent),
            const SizedBox(width: 4),
            Text("$amount ml", style: GoogleFonts.outfit(fontSize: 13, fontWeight: FontWeight.w700, color: Colors.blueAccent)),
          ],
        ),
      ),
    );
  }

  Widget _buildWeightChart(WeightState state, bool isDark) {
    if (state.history.isEmpty) return const SizedBox.shrink();

    final spots = state.history.asMap().entries.map((e) {
      return FlSpot(e.key.toDouble(), (e.value['weight_kg'] as num).toDouble());
    }).toList();

    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(28),
      ),
      child: SizedBox(
        height: 220,
        child: LineChart(
          LineChartData(
            gridData: const FlGridData(show: false),
            titlesData: FlTitlesData(
              show: true,
              bottomTitles: AxisTitles(
                sideTitles: SideTitles(
                  showTitles: true,
                  getTitlesWidget: (v, m) {
                    if (v.toInt() % 2 != 0) return const SizedBox.shrink();
                    return Text("${v.toInt() + 1}", style: GoogleFonts.outfit(fontSize: 10, color: Colors.grey));
                  }
                ),
              ),
              leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
              rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            ),
            borderData: FlBorderData(show: false),
            lineBarsData: [
              LineChartBarData(
                spots: spots,
                isCurved: true,
                color: AppTheme.primaryEmerald,
                barWidth: 4,
                isStrokeCapRound: true,
                dotData: const FlDotData(show: false),
                belowBarData: BarAreaData(
                  show: true,
                  gradient: LinearGradient(colors: [AppTheme.primaryEmerald.withValues(alpha: 0.15), AppTheme.primaryEmerald.withValues(alpha: 0)]),
                ),
              ),
            ],
          ),
        ),
      ),
    ).animate().fadeIn().scale();
  }

  Widget _buildSummaryPills(WeightState state, bool isDark) {
    final stats = state.statistics;
    final loss = (stats?['weight_loss'] ?? 0.0) as double;
    
    return Row(
      children: [
        _summaryCard("Total Loss", "${loss.toStringAsFixed(1)} kg", AppTheme.primaryEmerald, Icons.trending_down_rounded, isDark),
        const SizedBox(width: 16),
        _summaryCard("Current", "${stats?['current_weight'] ?? '--'} kg", AppTheme.infoBlue, Icons.monitor_weight_outlined, isDark),
      ],
    ).animate().slideY(begin: 0.2);
  }

  Widget _summaryCard(String label, String value, Color color, IconData icon, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: color.withValues(alpha: 0.1)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(value, style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800, color: color)),
            Text(label, style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey, fontWeight: FontWeight.w600)),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryTimeline(WeightState state, bool isDark) {
    if (state.history.isEmpty) return const Center(child: Text("Start your journey by logging weight"));

    return Column(
      children: state.history.reversed.map((h) {
        final date = DateFormat('MMM dd, yyyy').format(DateTime.parse(h['logged_date']));
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: isDark ? AppTheme.surfaceDark : Colors.white,
            borderRadius: BorderRadius.circular(20),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(date, style: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 15)),
                  if (h['notes'] != null && (h['notes'] as String).isNotEmpty)
                    Text(h['notes'], style: GoogleFonts.outfit(fontSize: 12, color: Colors.grey)),
                ],
              ),
              Text("${h['weight_kg']} kg", style: GoogleFonts.outfit(fontWeight: FontWeight.w800, fontSize: 18, color: AppTheme.primaryEmerald)),
            ],
          ),
        );
      }).toList(),
    ).animate().fadeIn();
  }
}

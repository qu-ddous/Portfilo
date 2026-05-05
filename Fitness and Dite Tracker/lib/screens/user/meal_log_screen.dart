import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../providers/meal_provider.dart';
import '../../config/theme.dart';

class MealLogScreen extends ConsumerStatefulWidget {
  const MealLogScreen({super.key});

  @override
  ConsumerState<MealLogScreen> createState() => _MealLogScreenState();
}

class _MealLogScreenState extends ConsumerState<MealLogScreen> {
  String selectedMealType = 'Breakfast';
  final _searchController = TextEditingController();
  List<Map<String, dynamic>> externalResults = [];
  bool isSearching = false;

  final List<String> mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  Future<void> _onSearch(String val) async {
    if (val.length < 2) {
      if (mounted) setState(() => externalResults = []);
      return;
    }
    setState(() => isSearching = true);
    final results = await ref.read(mealProvider.notifier).searchMealsExternally(val);
    if (mounted) {
      setState(() {
        externalResults = results;
        isSearching = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF111827) : const Color(0xFFF9FAFB),
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 20, 20, 0),
              child: Row(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Fuel Your Body",
                        style: GoogleFonts.outfit(fontSize: 26, fontWeight: FontWeight.w800),
                      ),
                      Text(
                        "Search or scan your items",
                        style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey, fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 24),
            
            // Meal Type Chips
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Row(
                children: mealTypes.map((type) {
                  final isSelected = selectedMealType == type;
                  return Padding(
                    padding: const EdgeInsets.only(right: 12),
                    child: ChoiceChip(
                      label: Text(type),
                      selected: isSelected,
                      onSelected: (val) => setState(() => selectedMealType = type),
                      selectedColor: AppTheme.primaryEmerald,
                      labelStyle: GoogleFonts.outfit(
                        fontWeight: FontWeight.w600,
                        color: isSelected ? Colors.white : Colors.grey,
                      ),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                      backgroundColor: isDark ? AppTheme.surfaceDark : Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      side: BorderSide.none,
                    ),
                  );
                }).toList(),
              ),
            ),
            
            const SizedBox(height: 20),
            
            // Search Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Container(
                decoration: BoxDecoration(
                  color: isDark ? AppTheme.surfaceDark : Colors.white,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 10, offset: const Offset(0, 4)),
                  ],
                ),
                child: TextField(
                  controller: _searchController,
                  onChanged: _onSearch,
                  decoration: InputDecoration(
                    hintText: "Search 500k+ foods...",
                    hintStyle: GoogleFonts.outfit(color: Colors.grey),
                    prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.primaryEmerald),
                    suffixIcon: IconButton(
                      icon: const Icon(Icons.qr_code_scanner_rounded, color: AppTheme.primaryEmerald),
                      onPressed: () {}, // Trigger scanner
                    ),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                ),
              ),
            ),
            
            const SizedBox(height: 12),
            
            // Results List
            Expanded(
              child: isSearching 
                ? const Center(child: CircularProgressIndicator(color: AppTheme.primaryEmerald))
                : externalResults.isEmpty 
                  ? _buildEmptyState(isDark)
                  : ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                      itemCount: externalResults.length,
                      itemBuilder: (context, index) {
                        final item = externalResults[index];
                        return _buildSearchItem(context, item, isDark).animate().fadeIn(delay: (index * 50).ms).slideX(begin: 0.1);
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(bool isDark) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.restaurant_rounded, size: 64, color: Colors.grey.withValues(alpha: 0.3)),
          const SizedBox(height: 16),
          Text(
            "What did you eat today?",
            style: GoogleFonts.outfit(fontSize: 18, color: Colors.grey, fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 8),
          Text(
            "Search for generic or branded foods",
            style: GoogleFonts.outfit(fontSize: 14, color: Colors.grey.withValues(alpha: 0.6)),
          ),
        ],
      ).animate().fadeIn(),
    );
  }

  Widget _buildSearchItem(BuildContext context, Map<String, dynamic> item, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.withValues(alpha: 0.1)),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        leading: Container(
          width: 50,
          height: 50,
          decoration: BoxDecoration(
            color: AppTheme.primaryEmerald.withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: item['image_url'] != null
            ? ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: CachedNetworkImage(
                  imageUrl: item['image_url'],
                  fit: BoxFit.cover,
                  errorWidget: (c, e, s) => const Icon(Icons.fastfood_rounded, color: AppTheme.primaryEmerald),
                ),
              )
            : const Icon(Icons.fastfood_rounded, color: AppTheme.primaryEmerald),
        ),
        title: Text(
          item['name'],
          style: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 16),
          maxLines: 1, overflow: TextOverflow.ellipsis,
        ),
        subtitle: Text(
          "${item['calories'].toInt()} kcal | ${item['brand']}",
          style: GoogleFonts.outfit(fontSize: 13, color: Colors.grey, fontWeight: FontWeight.w500),
        ),
        trailing: IconButton(
          icon: const Icon(Icons.add_circle_rounded, color: AppTheme.primaryEmerald, size: 28),
          onPressed: () => _showAddMealModal(context, item, isDark),
        ),
      ),
    );
  }

  void _showAddMealModal(BuildContext context, Map<String, dynamic> item, bool isDark) {
    double selectedQuantity = 100.0;
    bool isGrams = true;
    double pieceWeight = 50.0; // Default estimate for 1 piece if not provided

    // If it's a known count-based item like egg, banana, etc.
    final nameLower = item['name'].toLowerCase();
    if (nameLower.contains('egg')) pieceWeight = 50.0;
    else if (nameLower.contains('banana')) pieceWeight = 120.0;
    else if (nameLower.contains('apple')) pieceWeight = 180.0;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => StatefulBuilder(
        builder: (context, setModalState) {
          double totalGrams = isGrams ? selectedQuantity : (selectedQuantity * pieceWeight);
          
          return Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1F2937) : Colors.white,
              borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(item['name'], style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800)),
                          Text("Nutrition for ${totalGrams.toInt()}g", style: GoogleFonts.outfit(color: AppTheme.primaryEmerald, fontSize: 14, fontWeight: FontWeight.w600)),
                        ],
                      ),
                    ),
                    IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close_rounded)),
                  ],
                ),
                const SizedBox(height: 24),
                
                // Unit Toggle
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    color: isDark ? Colors.black26 : Colors.grey[100],
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: _unitButton("Grams (g)", isGrams, () => setModalState(() {
                          isGrams = true;
                          selectedQuantity = 100.0;
                        }), isDark),
                      ),
                      Expanded(
                        child: _unitButton("Pieces (pcs)", !isGrams, () => setModalState(() {
                          isGrams = false;
                          selectedQuantity = 1.0;
                        }), isDark),
                      ),
                    ],
                  ),
                ),
                
                const SizedBox(height: 24),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _modalMacro("Calories", "${(item['calories'] * totalGrams / 100).toInt()}", "kcal", AppTheme.primaryEmerald),
                    _modalMacro("Protein", "${(item['protein'] * totalGrams / 100).toStringAsFixed(1)}", "g", AppTheme.primaryEmerald),
                    _modalMacro("Carbs", "${(item['carbs'] * totalGrams / 100).toStringAsFixed(1)}", "g", AppTheme.infoBlue),
                    _modalMacro("Fats", "${(item['fats'] * totalGrams / 100).toStringAsFixed(1)}", "g", AppTheme.secondaryAmber),
                  ],
                ),
                const SizedBox(height: 32),
                Text(isGrams ? "Quantity (grams)" : "Quantity (pieces)", style: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 16)),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: Slider(
                        value: selectedQuantity,
                        min: isGrams ? 10 : 0.5,
                        max: isGrams ? 1000 : 20,
                        divisions: isGrams ? 99 : 39,
                        activeColor: AppTheme.primaryEmerald,
                        onChanged: (val) => setModalState(() => selectedQuantity = val),
                      ),
                    ),
                    Container(
                      width: 80,
                      padding: const EdgeInsets.all(8),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryEmerald.withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        isGrams ? "${selectedQuantity.toInt()}g" : "${selectedQuantity.toStringAsFixed(1)}",
                        textAlign: TextAlign.center,
                        style: GoogleFonts.outfit(fontWeight: FontWeight.w800, color: AppTheme.primaryEmerald),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 32),
                SizedBox(
                  width: double.infinity,
                  height: 56,
                  child: ElevatedButton(
                    onPressed: () async {
                      final success = await ref.read(mealProvider.notifier).logExternalMeal(item, totalGrams, selectedMealType);
                      if (success && context.mounted) {
                        Navigator.pop(context);
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(
                            content: Text("Logged ${item['name']} successfully!", style: GoogleFonts.outfit(fontWeight: FontWeight.w600)),
                            backgroundColor: AppTheme.primaryEmerald,
                            behavior: SnackBarBehavior.floating,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppTheme.primaryEmerald,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      elevation: 0,
                    ),
                    child: Text("Add to $selectedMealType", style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white)),
                  ),
                ),
                const SizedBox(height: 16),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _unitButton(String label, bool isSelected, VoidCallback onTap, bool isDark) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          color: isSelected ? (isDark ? Colors.grey[800] : Colors.white) : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected ? [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 4)] : [],
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: GoogleFonts.outfit(
            fontWeight: FontWeight.w700,
            fontSize: 14,
            color: isSelected ? AppTheme.primaryEmerald : Colors.grey,
          ),
        ),
      ),
    );
  }

  Widget _modalMacro(String label, String value, String unit, Color color) {
    return Column(
      children: [
        Text(value, style: GoogleFonts.outfit(fontSize: 18, fontWeight: FontWeight.w800, color: color)),
        Text("$label ($unit)", style: GoogleFonts.outfit(fontSize: 10, color: Colors.grey, fontWeight: FontWeight.w600)),
      ],
    );
  }
}


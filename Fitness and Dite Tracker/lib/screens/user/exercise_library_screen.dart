import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:cached_network_image/cached_network_image.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/workout_provider.dart';
import '../../config/dio_client.dart';
import '../../config/theme.dart';

class ExerciseLibraryScreen extends StatefulWidget {
  const ExerciseLibraryScreen({super.key});

  @override
  State<ExerciseLibraryScreen> createState() => _ExerciseLibraryScreenState();
}

class _ExerciseLibraryScreenState extends State<ExerciseLibraryScreen> {
  List<dynamic> _exercises = [];
  bool _isLoading = true;
  String _searchQuery = "";
  String? _selectedCategory;

  final List<String> _categories = [
    'All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'
  ];

  @override
  void initState() {
    super.initState();
    _fetchExercises();
  }

  Future<void> _fetchExercises() async {
    setState(() => _isLoading = true);
    try {
      final dio = DioClient().dio;
      // Fetch all for better client side filtering if the backend filter fails
      String url = '/user/exercises?search=$_searchQuery';
      
      final response = await dio.get(url);
      if (response.statusCode == 200) {
        List<dynamic> results = response.data['exercises'];
        
        // Client side category filter as safety
        if (_selectedCategory != null && _selectedCategory != 'All') {
          results = results.where((ex) => 
            (ex['muscle_group'] ?? '').toString().toLowerCase() == _selectedCategory!.toLowerCase()
          ).toList();
        }

        if (mounted) {
          setState(() {
            _exercises = results;
            _isLoading = false;
          });
        }
      }
    } catch (e) {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _watchTutorial(String name) async {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => _TutorialModal(exerciseName: name),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: isDark ? const Color(0xFF0F172A) : const Color(0xFFF8FAFC),
      appBar: AppBar(
        title: Text("Exercise Library", style: GoogleFonts.outfit(fontWeight: FontWeight.w800)),
        centerTitle: true,
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: const Icon(Icons.arrow_back_ios_new_rounded),
        ),
      ),
      body: Column(
        children: [
          _buildSearchBar(isDark),
          _buildCategories(isDark),
          const SizedBox(height: 16),
          Expanded(
            child: _isLoading 
              ? _buildShimmerLoading(isDark)
              : _exercises.isEmpty
                ? _buildEmptyState()
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 8),
                    itemCount: _exercises.length,
                    itemBuilder: (context, index) {
                      final ex = _exercises[index];
                      return _buildExerciseCard(ex, isDark).animate().fadeIn().slideY(begin: 0.1, delay: Duration(milliseconds: index * 40));
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildSearchBar(bool isDark) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 12, 24, 12),
      child: Container(
        decoration: BoxDecoration(
          color: isDark ? AppTheme.surfaceDark : Colors.white,
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 10)],
        ),
        child: TextField(
          onChanged: (val) {
            setState(() => _searchQuery = val);
            _fetchExercises();
          },
          decoration: InputDecoration(
            hintText: "Search exercises...",
            hintStyle: GoogleFonts.outfit(color: Colors.grey, fontSize: 15),
            prefixIcon: const Icon(Icons.search_rounded, color: AppTheme.primaryEmerald),
            border: InputBorder.none,
            contentPadding: const EdgeInsets.symmetric(vertical: 16),
          ),
        ),
      ),
    );
  }

  Widget _buildCategories(bool isDark) {
    return SizedBox(
      height: 45,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 24),
        itemCount: _categories.length,
        itemBuilder: (context, index) {
          final cat = _categories[index];
          final isSelected = _selectedCategory == cat || (_selectedCategory == null && cat == 'All');
          return Padding(
            padding: const EdgeInsets.only(right: 12),
            child: GestureDetector(
              onTap: () {
                setState(() => _selectedCategory = cat);
                _fetchExercises();
              },
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                decoration: BoxDecoration(
                  color: isSelected ? AppTheme.primaryEmerald : (isDark ? AppTheme.surfaceDark : Colors.white),
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: isSelected ? [BoxShadow(color: AppTheme.primaryEmerald.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 4))] : [],
                ),
                child: Center(
                  child: Text(
                    cat,
                    style: GoogleFonts.outfit(
                      fontSize: 14,
                      fontWeight: FontWeight.w700,
                      color: isSelected ? Colors.white : Colors.grey,
                    ),
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildExerciseCard(dynamic ex, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: isDark ? AppTheme.surfaceDark : Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.02), blurRadius: 10)],
        border: Border.all(color: Colors.grey.withValues(alpha: 0.05)),
      ),
      child: Row(
        children: [
          Container(
            width: 70, height: 70,
            decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.05), borderRadius: BorderRadius.circular(16)),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(16),
              child: ex['image'] != null 
                ? CachedNetworkImage(imageUrl: ex['image'], fit: BoxFit.cover, errorWidget: (c,u,e) => const Icon(Icons.fitness_center_rounded))
                : const Icon(Icons.fitness_center_rounded, color: AppTheme.primaryEmerald),
            ),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(ex['name'], style: GoogleFonts.outfit(fontSize: 16, fontWeight: FontWeight.w800)),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: AppTheme.primaryEmerald.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                      child: Text(ex['muscle_group']?.toUpperCase() ?? "GENERAL", style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w800, color: AppTheme.primaryEmerald)),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(color: AppTheme.secondaryAmber.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                      child: Text(ex['equipment_needed']?.toString().toUpperCase() ?? "NONE", style: GoogleFonts.outfit(fontSize: 9, fontWeight: FontWeight.w800, color: AppTheme.secondaryAmber)),
                    ),
                  ],
                ),
              ],
            ),
          ),
          IconButton(
            onPressed: () => _watchTutorial(ex['name']),
            icon: const Icon(Icons.play_circle_fill_rounded, color: AppTheme.primaryEmerald, size: 32),
            tooltip: "Watch Tutorial",
          ),
        ],
      ),
    );
  }

  Widget _buildShimmerLoading(bool isDark) {
    return ListView.builder(
      padding: const EdgeInsets.all(24),
      itemCount: 5,
      itemBuilder: (context, index) => Container(
        height: 100,
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(color: isDark ? AppTheme.surfaceDark : Colors.white, borderRadius: BorderRadius.circular(24)),
      ).animate(onPlay: (controller) => controller.repeat()).shimmer(duration: 1.seconds),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.search_off_rounded, size: 64, color: Colors.grey.withValues(alpha: 0.3)),
          const SizedBox(height: 16),
          Text("No exercises found", style: GoogleFonts.outfit(fontSize: 18, color: Colors.grey, fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}

class _TutorialModal extends ConsumerWidget {
  final String exerciseName;
  const _TutorialModal({required this.exerciseName});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    
    return Container(
      height: MediaQuery.of(context).size.height * 0.8,
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E2937) : Colors.white,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
      ),
      child: Column(
        children: [
          const SizedBox(height: 12),
          Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey[400], borderRadius: BorderRadius.circular(2))),
          Padding(
            padding: const EdgeInsets.all(24),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(child: Text("$exerciseName Tutorial", style: GoogleFonts.outfit(fontSize: 20, fontWeight: FontWeight.w800))),
                IconButton(onPressed: () => Navigator.pop(context), icon: const Icon(Icons.close_rounded)),
              ],
             ),
          ),
          Expanded(
            child: FutureBuilder<List<Map<String, dynamic>>>(
              future: ref.read(workoutProvider.notifier).getWorkoutVideos(exerciseName),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator(color: AppTheme.primaryEmerald));
                }
                if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(Icons.videocam_off_rounded, size: 64, color: Colors.grey),
                      const SizedBox(height: 16),
                      Text("No videos found", style: GoogleFonts.outfit(color: Colors.grey, fontWeight: FontWeight.w600)),
                    ],
                  );
                }
                
                final videos = snapshot.data!;
                return ListView.builder(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  itemCount: videos.length,
                  itemBuilder: (context, index) {
                    final v = videos[index];
                    return Padding(
                      padding: const EdgeInsets.only(bottom: 20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: v['thumbnail'] != null 
                              ? Image.network(v['thumbnail'], width: double.infinity, height: 200, fit: BoxFit.cover)
                              : Container(height: 200, color: Colors.grey[200], child: const Icon(Icons.video_collection)),
                          ),
                          const SizedBox(height: 12),
                          Text(v['title'] ?? "No Title", style: GoogleFonts.outfit(fontWeight: FontWeight.w700, fontSize: 15)),
                          const SizedBox(height: 4),
                          Text(v['channelTitle'] ?? "Unknown Channel", style: GoogleFonts.outfit(color: Colors.grey, fontSize: 13)),
                        ],
                      ),
                    );
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}

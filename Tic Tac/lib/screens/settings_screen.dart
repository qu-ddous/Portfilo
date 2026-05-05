import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../config/constants.dart';
import '../providers/settings_provider.dart';
import '../providers/theme_provider.dart';
import '../services/haptics_service.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final soundEnabled = ref.watch(soundEnabledProvider);
    final hapticsEnabled = ref.watch(hapticsEnabledProvider);
    final playerName = ref.watch(playerNameProvider);
    final gridSizePreference = ref.watch(gridSizePreferenceProvider);
    final themeMode = ref.watch(themeModeProvider);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(AppConstants.spacingLg),
        children: [
          // Player Name
          Card(
            child: ListTile(
              leading: const Icon(Icons.person),
              title: const Text('Player Name'),
              subtitle: Text(playerName),
              trailing: const Icon(Icons.edit),
              onTap: () => _showNameDialog(context, ref, playerName),
            ),
          ),

          const SizedBox(height: AppConstants.spacingMd),

          // Theme
          Card(
            child: SwitchListTile(
              secondary: Icon(
                themeMode == ThemeMode.light ? Icons.light_mode : Icons.dark_mode,
              ),
              title: const Text('Dark Mode'),
              subtitle: const Text('Toggle dark/light theme'),
              value: themeMode == ThemeMode.dark,
              onChanged: (value) {
                HapticsService.light();
                ref.read(themeModeProvider.notifier).toggleTheme();
              },
            ),
          ),

          const SizedBox(height: AppConstants.spacingMd),

          // Sound
          Card(
            child: SwitchListTile(
              secondary: Icon(soundEnabled ? Icons.volume_up : Icons.volume_off),
              title: const Text('Sound Effects'),
              subtitle: const Text('Enable/disable game sounds'),
              value: soundEnabled,
              onChanged: (value) {
                HapticsService.light();
                ref.read(soundEnabledProvider.notifier).toggle();
              },
            ),
          ),

          const SizedBox(height: AppConstants.spacingMd),

          // Haptics
          Card(
            child: SwitchListTile(
              secondary: Icon(hapticsEnabled ? Icons.vibration : Icons.mobile_off),
              title: const Text('Haptic Feedback'),
              subtitle: const Text('Enable/disable vibrations'),
              value: hapticsEnabled,
              onChanged: (value) {
                ref.read(hapticsEnabledProvider.notifier).toggle();
                if (value) HapticsService.medium();
              },
            ),
          ),

          const SizedBox(height: AppConstants.spacingMd),

          // Grid Size Preference
          Card(
            child: ListTile(
              leading: const Icon(Icons.grid_3x3),
              title: const Text('Default Grid Size'),
              subtitle: Text('${gridSizePreference}x$gridSizePreference'),
              trailing: DropdownButton<int>(
                value: gridSizePreference,
                items: [3, 4, 5].map((size) {
                  return DropdownMenuItem(
                    value: size,
                    child: Text('${size}x$size'),
                  );
                }).toList(),
                onChanged: (value) {
                  if (value != null) {
                    HapticsService.light();
                    ref.read(gridSizePreferenceProvider.notifier).setSize(value);
                  }
                },
              ),
            ),
          ),

          const SizedBox(height: AppConstants.spacingXl),

          // About
          Card(
            child: ListTile(
              leading: const Icon(Icons.info),
              title: const Text('About'),
              subtitle: Text('Version ${AppConstants.appVersion}'),
            ),
          ),
        ],
      ),
    );
  }

  void _showNameDialog(BuildContext context, WidgetRef ref, String currentName) {
    final controller = TextEditingController(text: currentName);

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Change Player Name'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            labelText: 'Player Name',
            hintText: 'Enter your name',
          ),
          maxLength: 20,
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              final newName = controller.text.trim();
              if (newName.isNotEmpty) {
                ref.read(playerNameProvider.notifier).setName(newName);
                Navigator.of(context).pop();
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }
}

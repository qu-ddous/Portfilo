import 'package:flutter/material.dart';
import '../config/constants.dart';
import '../widgets/custom_button.dart';

class OnlineLobbyScreen extends StatelessWidget {
  const OnlineLobbyScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Online Lobby'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(AppConstants.spacingLg),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Create Room Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.spacingLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Create Room',
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                    const SizedBox(height: AppConstants.spacingMd),
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'Room Name',
                        hintText: 'Enter room name',
                      ),
                    ),
                    const SizedBox(height: AppConstants.spacingMd),
                    CustomButton(
                      text: 'Create Room',
                      icon: Icons.add,
                      onPressed: () {
                        // TODO: Implement create room
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Online multiplayer requires backend connection'),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: AppConstants.spacingXl),

            // Join Room Section
            Card(
              child: Padding(
                padding: const EdgeInsets.all(AppConstants.spacingLg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Join Room',
                      style: Theme.of(context).textTheme.displaySmall,
                    ),
                    const SizedBox(height: AppConstants.spacingMd),
                    TextField(
                      decoration: const InputDecoration(
                        labelText: 'Room Code',
                        hintText: 'Enter 6-digit code',
                      ),
                      maxLength: 6,
                    ),
                    const SizedBox(height: AppConstants.spacingMd),
                    CustomButton(
                      text: 'Join Room',
                      icon: Icons.login,
                      onPressed: () {
                        // TODO: Implement join room
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Online multiplayer requires backend connection'),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: AppConstants.spacingXl),

            // Available Rooms
            Text(
              'Available Rooms',
              style: Theme.of(context).textTheme.displaySmall,
            ),
            const SizedBox(height: AppConstants.spacingMd),
            Expanded(
              child: Card(
                child: Center(
                  child: Text(
                    'No rooms available',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.grey,
                        ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

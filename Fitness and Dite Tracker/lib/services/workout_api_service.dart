import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/constants.dart';

class WorkoutApiService {
  static const String youtubeSearchUrl = "https://www.googleapis.com/youtube/v3/search";
  
  Future<List<Map<String, dynamic>>> fetchExerciseVideos(String workoutName) async {
    try {
      final query = Uri.encodeComponent("$workoutName workout exercise");
      final response = await http.get(
        Uri.parse("$youtubeSearchUrl?part=snippet&maxResults=5&q=$query&type=video&key=${AppConstants.youtubeApiKey}"),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List items = data['items'];
        
        return items.map((item) {
          final snippet = item['snippet'];
          return {
            'id': item['id']['videoId'],
            'title': snippet['title'],
            'thumbnail': snippet['thumbnails']['medium']['url'],
            'channel': snippet['channelTitle'],
            'url': "https://www.youtube.com/watch?v=${item['id']['videoId']}",
          };
        }).toList();
      }
    } catch (e) {
      // Error logging silently for production or use a dedicated logger
    }
    
    return [
      {
        'id': '1',
        'title': "$workoutName Full Tutorial",
        'thumbnail': "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600",
        'channel': "Fitness Pro",
        'url': "https://www.youtube.com/results?search_query=${workoutName.replaceAll(' ', '+')}",
      },
      {
        'id': '2',
        'title': "Best $workoutName Exercises",
        'thumbnail': "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=600",
        'channel': "Workout Daily",
        'url': "https://www.youtube.com/results?search_query=${workoutName.replaceAll(' ', '+')}",
      },
    ];
  }
}

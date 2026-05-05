import 'dart:convert';
import 'package:http/http.dart' as http;
import '../config/constants.dart';

class FoodApiService {
  static const String usdaSearchUrl = "https://api.nal.usda.gov/fdc/v1/foods/search";
  static const String usdaDetailsUrl = "https://api.nal.usda.gov/fdc/v1/food/";
  
  static const String offSearchUrl = "https://world.openfoodfacts.org/cgi/search.pl";

  Future<List<Map<String, dynamic>>> searchUSDA(String query) async {
    try {
      final response = await http.get(
        Uri.parse("$usdaSearchUrl?api_key=${AppConstants.usdaApiKey}&query=$query&pageSize=20"),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List foods = data['foods'];
        
        return foods.map((f) {
          final nutrients = f['foodNutrients'] as List;
          
          double getNutrient(List<int> ids) {
            try {
              final n = nutrients.firstWhere(
                (n) => ids.contains(n['nutrientId'] as int), 
                orElse: () => null
              );
              return n != null ? (n['value'] as num).toDouble() : 0.0;
            } catch (e) {
              return 0.0;
            }
          }

          // USDA Nutrient IDs: 
          // Energy (kcal): 1008, 2047, 208
          // Protein: 1003, 203
          // Carbs: 1005, 205
          // Fats: 1004, 204
          return {
            'id': f['fdcId'].toString(),
            'name': f['description'],
            'brand': f['brandOwner'] ?? 'Generic',
            'calories': getNutrient([1008, 2047, 208]),
            'protein': getNutrient([1003, 203]),
            'carbs': getNutrient([1005, 205]),
            'fats': getNutrient([1004, 204]),
            'source': 'USDA',
            'image_url': null,
          };
        }).toList();
      }
    } catch (e) {
      // Error logged silently
    }
    return [];
  }

  Future<List<Map<String, dynamic>>> searchOpenFoodFacts(String query) async {
    try {
      final response = await http.get(
        Uri.parse("$offSearchUrl?search_terms=$query&search_simple=1&action=process&json=1&page_size=20"),
      );

      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        final List products = data['products'];
        
        return products.map((p) {
          final nutriments = p['nutriments'] ?? {};
          return {
            'id': p['_id']?.toString(),
            'name': p['product_name'] ?? 'Unknown',
            'brand': p['brands'] ?? 'Generic',
            'calories': (nutriments['energy-kcal_100g'] ?? 0.0).toDouble(),
            'protein': (nutriments['proteins_100g'] ?? 0.0).toDouble(),
            'carbs': (nutriments['carbohydrates_100g'] ?? 0.0).toDouble(),
            'fats': (nutriments['fat_100g'] ?? 0.0).toDouble(),
            'source': 'OFF',
            'image_url': p['image_small_url'] ?? p['image_url'],
          };
        }).toList();
      }
    } catch (e) {
      // Error logged silently
    }
    return [];
  }
}

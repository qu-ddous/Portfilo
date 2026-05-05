class HealthCalculator {
  static double calculateBMI(double weightKg, double heightCm) {
    if (heightCm <= 0) return 0;
    double heightM = heightCm / 100;
    return weightKg / (heightM * heightM);
  }

  static String getBMICategory(double bmi) {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25.0) return "Normal";
    if (bmi < 30.0) return "Overweight";
    return "Obese";
  }

  static String getBMIRecommendation(double bmi) {
    if (bmi < 18.5) return "Focus on nutrition-rich foods and gradual healthy weight gain.";
    if (bmi < 25.0) return "Maintain your current lifestyle with a balanced diet and exercise.";
    if (bmi < 30.0) return "Consider a slight calorie deficit and increasing your activity level.";
    return "Consult with a healthcare provider for a personalized weight management plan.";
  }

  static double calculateBMR(double weightKg, double heightCm, int age, bool isMale) {
    if (isMale) {
      // Mifflin-St Jeor Equation for men
      return (10 * weightKg) + (6.25 * heightCm) - (5 * age) + 5;
    } else {
      // Mifflin-St Jeor Equation for women
      return (10 * weightKg) + (6.25 * heightCm) - (5 * age) - 161;
    }
  }

  static Map<String, double> calculateDailyGoals({
    required double weightKg,
    required double heightCm,
    required int age,
    required bool isMale,
    required String goal, // 'lose', 'gain', 'maintain'
    required double activityFactor, // 1.2 to 1.9
  }) {
    double bmr = calculateBMR(weightKg, heightCm, age, isMale);
    double tdee = bmr * activityFactor;
    
    double targetCalories;
    if (goal == 'lose') {
      targetCalories = tdee - 500;
    } else if (goal == 'gain') {
      targetCalories = tdee + 500;
    } else {
      targetCalories = tdee;
    }

    // Macros distribution (generic healthy ratio)
    // Protein: 2.0g per kg body weight
    // Fats: 25% of total calories (9 kcal per gram)
    // Carbs: Remaining calories (4 kcal per gram)
    
    double proteinGrams = weightKg * 2.0;
    double fatsGrams = (targetCalories * 0.25) / 9;
    double carbsGrams = (targetCalories - (proteinGrams * 4) - (fatsGrams * 9)) / 4;

    return {
      'calories': targetCalories.roundToDouble(),
      'protein': proteinGrams.roundToDouble(),
      'carbs': carbsGrams.roundToDouble(),
      'fats': fatsGrams.roundToDouble(),
    };
  }
}

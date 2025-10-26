// Utilitários para cálculos de saúde e fitness

export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Abaixo do peso';
  if (bmi < 25) return 'Peso normal';
  if (bmi < 30) return 'Sobrepeso';
  return 'Obesidade';
}

export function calculateBMR(weight: number, height: number, age: number, gender: 'male' | 'female'): number {
  // Fórmula de Harris-Benedict
  if (gender === 'male') {
    return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
  } else {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
  }
}

export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };
  
  return Math.round(bmr * (multipliers[activityLevel as keyof typeof multipliers] || 1.2));
}

export function calculateCaloriesForGoal(tdee: number, goal: string): number {
  switch (goal) {
    case 'weight_loss':
      return Math.round(tdee - 500); // Déficit de 500 cal
    case 'muscle_gain':
      return Math.round(tdee + 300); // Superávit de 300 cal
    case 'maintenance':
    default:
      return tdee;
  }
}

export function calculateMacros(calories: number, goal: string) {
  let proteinPercent = 0.25;
  let carbPercent = 0.45;
  let fatPercent = 0.30;

  if (goal === 'muscle_gain') {
    proteinPercent = 0.30;
    carbPercent = 0.45;
    fatPercent = 0.25;
  } else if (goal === 'weight_loss') {
    proteinPercent = 0.35;
    carbPercent = 0.35;
    fatPercent = 0.30;
  }

  return {
    protein: Math.round((calories * proteinPercent) / 4), // 4 cal/g
    carbs: Math.round((calories * carbPercent) / 4), // 4 cal/g
    fat: Math.round((calories * fatPercent) / 9) // 9 cal/g
  };
}

export function calculateWaterIntake(weight: number, activityLevel: string): number {
  // Base: 35ml por kg de peso
  let baseWater = weight * 35;
  
  // Ajuste por atividade física
  const activityMultipliers = {
    sedentary: 1,
    light: 1.1,
    moderate: 1.2,
    active: 1.3,
    very_active: 1.4
  };
  
  return Math.round(baseWater * (activityMultipliers[activityLevel as keyof typeof activityMultipliers] || 1));
}

export function getHealthScore(metrics: {
  caloriesConsumed: number;
  caloriesTarget: number;
  waterIntake: number;
  waterTarget: number;
  workoutsCompleted: number;
  workoutsTarget: number;
}): number {
  const calorieScore = Math.min(100, (1 - Math.abs(metrics.caloriesConsumed - metrics.caloriesTarget) / metrics.caloriesTarget) * 100);
  const waterScore = Math.min(100, (metrics.waterIntake / metrics.waterTarget) * 100);
  const workoutScore = Math.min(100, (metrics.workoutsCompleted / metrics.workoutsTarget) * 100);
  
  return Math.round((calorieScore + waterScore + workoutScore) / 3);
}

export function formatCalories(calories: number): string {
  return `${calories.toLocaleString()} kcal`;
}

export function formatWeight(weight: number): string {
  return `${weight.toFixed(1)} kg`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  if (minutes === 0) {
    return `${remainingSeconds}s`;
  }
  
  if (remainingSeconds === 0) {
    return `${minutes}min`;
  }
  
  return `${minutes}min ${remainingSeconds}s`;
}

export function getMotivationalMessage(score: number): string {
  if (score >= 90) return "Excelente! Você está arrasando! 🔥";
  if (score >= 80) return "Muito bem! Continue assim! 💪";
  if (score >= 70) return "Bom trabalho! Você está no caminho certo! 👍";
  if (score >= 60) return "Não desista! Pequenos passos fazem a diferença! 🌟";
  return "Vamos recomeçar! Cada dia é uma nova oportunidade! 💚";
}

export function generateMealSuggestions(calories: number, mealType: string): string[] {
  const suggestions: Record<string, string[]> = {
    breakfast: [
      'Aveia com frutas e castanhas',
      'Omelete com vegetais',
      'Smoothie de proteína com banana',
      'Pão integral com abacate',
      'Iogurte grego com granola'
    ],
    lunch: [
      'Salada com frango grelhado',
      'Peixe com legumes no vapor',
      'Quinoa com vegetais refogados',
      'Wrap integral com proteína',
      'Sopa de lentilha com salada'
    ],
    dinner: [
      'Salmão com brócolis',
      'Frango com batata doce',
      'Tofu com vegetais asiáticos',
      'Omelete com salada verde',
      'Peixe com abobrinha grelhada'
    ],
    snack: [
      'Mix de castanhas',
      'Frutas com iogurte',
      'Smoothie verde',
      'Biscoito integral com pasta de amendoim',
      'Queijo cottage com frutas'
    ]
  };
  
  return suggestions[mealType] || [];
}
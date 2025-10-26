// Dados mock para demonstração do H-LIFE

import { NutritionPlan, WorkoutPlan, HealthMetrics, Achievement, DailyLog, Food, Exercise } from './types';

export const mockUser = {
  id: '1',
  name: 'Ana Silva',
  email: 'ana@email.com',
  age: 28,
  weight: 65,
  height: 165,
  gender: 'female' as const,
  activityLevel: 'moderate' as const,
  goals: [
    {
      id: '1',
      type: 'weight_loss' as const,
      target: 60,
      deadline: new Date('2024-12-31'),
      progress: 60
    }
  ],
  restrictions: ['lactose'],
  preferences: ['vegetarian'],
  createdAt: new Date('2024-01-01')
};

export const mockFoods: Food[] = [
  {
    id: '1',
    name: 'Aveia',
    quantity: 50,
    unit: 'g',
    calories: 190,
    protein: 6.5,
    carbs: 32,
    fat: 3.5
  },
  {
    id: '2',
    name: 'Banana',
    quantity: 1,
    unit: 'unidade',
    calories: 105,
    protein: 1.3,
    carbs: 27,
    fat: 0.4
  },
  {
    id: '3',
    name: 'Peito de Frango',
    quantity: 150,
    unit: 'g',
    calories: 248,
    protein: 46.2,
    carbs: 0,
    fat: 5.4
  }
];

export const mockNutritionPlan: NutritionPlan = {
  id: '1',
  userId: '1',
  name: 'Plano de Emagrecimento',
  dailyCalories: 1800,
  macros: {
    protein: 135, // 30%
    carbs: 203, // 45%
    fat: 50 // 25%
  },
  meals: [
    {
      id: '1',
      name: 'Café da Manhã',
      type: 'breakfast',
      foods: [mockFoods[0], mockFoods[1]],
      totalCalories: 295,
      time: '07:00'
    },
    {
      id: '2',
      name: 'Almoço',
      type: 'lunch',
      foods: [mockFoods[2]],
      totalCalories: 248,
      time: '12:00'
    }
  ],
  duration: 30,
  createdAt: new Date()
};

export const mockExercises: Exercise[] = [
  {
    id: '1',
    name: 'Agachamento',
    type: 'strength',
    sets: 3,
    reps: 15,
    restTime: 60,
    instructions: 'Mantenha os pés na largura dos ombros, desça até 90 graus e suba controladamente.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  },
  {
    id: '2',
    name: 'Flexão',
    type: 'strength',
    sets: 3,
    reps: 10,
    restTime: 45,
    instructions: 'Mantenha o corpo alinhado, desça até o peito quase tocar o chão.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    name: 'Corrida',
    type: 'cardio',
    duration: 1800, // 30 minutos
    instructions: 'Mantenha ritmo moderado, respire pelo nariz.',
    imageUrl: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop'
  }
];

export const mockWorkoutPlan: WorkoutPlan = {
  id: '1',
  userId: '1',
  name: 'Treino Funcional',
  type: 'mixed',
  difficulty: 'intermediate',
  duration: 8,
  workouts: [
    {
      id: '1',
      name: 'Treino A - Força',
      day: 'Segunda',
      exercises: [mockExercises[0], mockExercises[1]],
      estimatedDuration: 45,
      completed: true
    },
    {
      id: '2',
      name: 'Treino B - Cardio',
      day: 'Quarta',
      exercises: [mockExercises[2]],
      estimatedDuration: 30,
      completed: false
    }
  ],
  createdAt: new Date()
};

export const mockHealthMetrics: HealthMetrics[] = [
  {
    id: '1',
    userId: '1',
    date: new Date('2024-01-01'),
    weight: 68,
    bodyFat: 25,
    muscleMass: 45,
    bmi: 25.0
  },
  {
    id: '2',
    userId: '1',
    date: new Date('2024-02-01'),
    weight: 66.5,
    bodyFat: 23,
    muscleMass: 46,
    bmi: 24.4
  },
  {
    id: '3',
    userId: '1',
    date: new Date('2024-03-01'),
    weight: 65,
    bodyFat: 22,
    muscleMass: 46.5,
    bmi: 23.9
  }
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'Primeira Semana',
    description: 'Complete 7 dias consecutivos',
    icon: '🏆',
    points: 100,
    unlockedAt: new Date('2024-01-07')
  },
  {
    id: '2',
    name: 'Hidratação Master',
    description: 'Beba 2L de água por 30 dias',
    icon: '💧',
    points: 200,
    unlockedAt: new Date('2024-01-30')
  },
  {
    id: '3',
    name: 'Força Total',
    description: 'Complete 50 treinos de força',
    icon: '💪',
    points: 500
  }
];

export const mockDailyLog: DailyLog = {
  id: '1',
  userId: '1',
  date: new Date(),
  caloriesConsumed: 1650,
  caloriesBurned: 350,
  waterIntake: 1800,
  workoutsCompleted: 1,
  mood: 'good',
  notes: 'Dia produtivo, me senti bem durante o treino!'
};

// Dados para gráficos
export const mockWeightData = [
  { date: 'Jan', weight: 68, target: 65 },
  { date: 'Fev', weight: 66.5, target: 65 },
  { date: 'Mar', weight: 65, target: 65 },
  { date: 'Abr', weight: 64.5, target: 65 },
  { date: 'Mai', weight: 64, target: 65 }
];

export const mockCaloriesData = [
  { day: 'Seg', consumed: 1650, burned: 350, target: 1800 },
  { day: 'Ter', consumed: 1750, burned: 280, target: 1800 },
  { day: 'Qua', consumed: 1600, burned: 420, target: 1800 },
  { day: 'Qui', consumed: 1850, burned: 300, target: 1800 },
  { day: 'Sex', consumed: 1700, burned: 380, target: 1800 },
  { day: 'Sáb', consumed: 1900, burned: 250, target: 1800 },
  { day: 'Dom', consumed: 1650, burned: 200, target: 1800 }
];
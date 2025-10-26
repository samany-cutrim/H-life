// Tipos para o aplicativo H-LIFE

export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goals: Goal[];
  restrictions: string[];
  preferences: string[];
  createdAt: Date;
}

export interface Goal {
  id: string;
  type: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'strength' | 'endurance';
  target: number;
  deadline: Date;
  progress: number;
}

export interface NutritionPlan {
  id: string;
  userId: string;
  name: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  meals: Meal[];
  duration: number; // dias
  createdAt: Date;
}

export interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foods: Food[];
  totalCalories: number;
  time: string;
}

export interface Food {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'mixed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // semanas
  workouts: Workout[];
  createdAt: Date;
}

export interface Workout {
  id: string;
  name: string;
  day: string;
  exercises: Exercise[];
  estimatedDuration: number; // minutos
  completed: boolean;
}

export interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility';
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // segundos
  restTime?: number; // segundos
  instructions: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface HealthMetrics {
  id: string;
  userId: string;
  date: Date;
  weight: number;
  bodyFat?: number;
  muscleMass?: number;
  bmi: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  notes?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: Date;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterIntake: number; // ml
  workoutsCompleted: number;
  mood: 'excellent' | 'good' | 'neutral' | 'tired' | 'stressed';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'image' | 'audio' | 'video';
  timestamp: Date;
  metadata?: {
    calories?: number;
    exercises?: string[];
    recommendations?: string[];
  };
}
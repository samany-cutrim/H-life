"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Dumbbell, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  Target,
  Video,
  Calendar,
  TrendingUp
} from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility';
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number; // em segundos
  restTime?: number; // em segundos
  completed: boolean;
  instructions: string;
}

interface Workout {
  id: string;
  name: string;
  day: string;
  exercises: Exercise[];
  estimatedDuration: number;
  completed: boolean;
}

export default function WorkoutTracker() {
  const [workouts] = useState<Workout[]>([
    {
      id: '1',
      name: 'Treino A - Força',
      day: 'Segunda',
      estimatedDuration: 45,
      completed: false,
      exercises: [
        {
          id: '1',
          name: 'Agachamento',
          type: 'strength',
          sets: 3,
          reps: 15,
          weight: 0,
          restTime: 60,
          completed: true,
          instructions: 'Mantenha os pés na largura dos ombros, desça até 90 graus e suba controladamente.'
        },
        {
          id: '2',
          name: 'Flexão',
          type: 'strength',
          sets: 3,
          reps: 10,
          restTime: 45,
          completed: false,
          instructions: 'Mantenha o corpo alinhado, desça até o peito quase tocar o chão.'
        },
        {
          id: '3',
          name: 'Prancha',
          type: 'strength',
          duration: 60,
          completed: false,
          instructions: 'Mantenha o corpo reto, contraindo abdômen e glúteos.'
        }
      ]
    },
    {
      id: '2',
      name: 'Treino B - Cardio',
      day: 'Quarta',
      estimatedDuration: 30,
      completed: false,
      exercises: [
        {
          id: '4',
          name: 'Corrida',
          type: 'cardio',
          duration: 1800, // 30 minutos
          completed: false,
          instructions: 'Mantenha ritmo moderado, respire pelo nariz.'
        },
        {
          id: '5',
          name: 'Burpees',
          type: 'cardio',
          sets: 3,
          reps: 10,
          restTime: 60,
          completed: false,
          instructions: 'Movimento completo: agachamento, prancha, flexão, salto.'
        }
      ]
    }
  ]);

  const [activeWorkout, setActiveWorkout] = useState<string>('1');
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentWorkoutData = workouts.find(w => w.id === activeWorkout);
  const completedExercises = currentWorkoutData?.exercises.filter(e => e.completed).length || 0;
  const totalExercises = currentWorkoutData?.exercises.length || 0;
  const workoutProgress = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleExerciseComplete = (exerciseId: string) => {
    // Simular toggle do exercício
    console.log(`Toggle exercise ${exerciseId}`);
  };

  const startTimer = (duration: number) => {
    setTimer(duration);
    setIsTimerRunning(true);
  };

  return (
    <div className="space-y-6">
      {/* Workout Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">{currentWorkoutData?.name}</h2>
              <p className="text-purple-100">
                {completedExercises} de {totalExercises} exercícios concluídos
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{Math.round(workoutProgress)}%</div>
              <div className="text-purple-100">Progresso</div>
            </div>
          </div>
          <Progress value={workoutProgress} className="mt-4 bg-purple-400" />
        </CardContent>
      </Card>

      <Tabs value={activeWorkout} onValueChange={setActiveWorkout}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="1">Treino A - Força</TabsTrigger>
          <TabsTrigger value="2">Treino B - Cardio</TabsTrigger>
        </TabsList>

        {workouts.map((workout) => (
          <TabsContent key={workout.id} value={workout.id} className="space-y-4">
            {/* Workout Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{workout.estimatedDuration}</div>
                  <div className="text-sm text-gray-600">minutos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Target className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{workout.exercises.length}</div>
                  <div className="text-sm text-gray-600">exercícios</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{workout.day}</div>
                  <div className="text-sm text-gray-600">dia da semana</div>
                </CardContent>
              </Card>
            </div>

            {/* Exercises */}
            <div className="space-y-4">
              {workout.exercises.map((exercise, index) => (
                <Card key={exercise.id} className={`${exercise.completed ? 'bg-green-50 border-green-200' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          exercise.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {exercise.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>
                        {exercise.name}
                      </CardTitle>
                      <Badge variant={exercise.type === 'strength' ? 'default' : exercise.type === 'cardio' ? 'secondary' : 'outline'}>
                        {exercise.type === 'strength' ? '💪 Força' : exercise.type === 'cardio' ? '🏃 Cardio' : '🧘 Flexibilidade'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{exercise.instructions}</p>
                    
                    {/* Exercise Details */}
                    <div className="flex flex-wrap gap-4 mb-4">
                      {exercise.sets && (
                        <div className="text-center">
                          <div className="text-lg font-bold">{exercise.sets}</div>
                          <div className="text-xs text-gray-600">séries</div>
                        </div>
                      )}
                      {exercise.reps && (
                        <div className="text-center">
                          <div className="text-lg font-bold">{exercise.reps}</div>
                          <div className="text-xs text-gray-600">repetições</div>
                        </div>
                      )}
                      {exercise.duration && (
                        <div className="text-center">
                          <div className="text-lg font-bold">{formatTime(exercise.duration)}</div>
                          <div className="text-xs text-gray-600">duração</div>
                        </div>
                      )}
                      {exercise.restTime && (
                        <div className="text-center">
                          <div className="text-lg font-bold">{exercise.restTime}s</div>
                          <div className="text-xs text-gray-600">descanso</div>
                        </div>
                      )}
                    </div>

                    {/* Timer for current exercise */}
                    {currentExercise === exercise.id && (
                      <Card className="bg-blue-50 border-blue-200 mb-4">
                        <CardContent className="p-4 text-center">
                          <div className="text-3xl font-bold text-blue-600 mb-2">
                            {formatTime(timer)}
                          </div>
                          <div className="flex justify-center gap-2">
                            <Button
                              size="sm"
                              variant={isTimerRunning ? "secondary" : "default"}
                              onClick={() => setIsTimerRunning(!isTimerRunning)}
                            >
                              {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setTimer(exercise.duration || 0)}>
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Exercise Actions */}
                    <div className="flex gap-2">
                      <Button
                        variant={exercise.completed ? "secondary" : "default"}
                        onClick={() => toggleExerciseComplete(exercise.id)}
                        className="flex-1"
                      >
                        {exercise.completed ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Concluído
                          </>
                        ) : (
                          'Marcar como Concluído'
                        )}
                      </Button>
                      
                      {exercise.duration && (
                        <Button
                          variant="outline"
                          onClick={() => {
                            setCurrentExercise(exercise.id);
                            startTimer(exercise.duration!);
                          }}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Timer
                        </Button>
                      )}
                      
                      <Button variant="outline">
                        <Video className="w-4 h-4 mr-1" />
                        Gravar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Workout Actions */}
            <div className="flex gap-4">
              <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700">
                <Video className="w-4 h-4 mr-2" />
                Gravar Treino Completo
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Reagendar
              </Button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* AI Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 Feedback da IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">✅ Execução Perfeita</p>
              <p className="text-sm text-green-700 mt-1">
                Seu agachamento está com ótima forma! Mantenha a profundidade e controle.
              </p>
            </div>
            
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">⚠️ Dica de Melhoria</p>
              <p className="text-sm text-yellow-700 mt-1">
                Nas flexões, tente manter os cotovelos mais próximos ao corpo para melhor ativação do tríceps.
              </p>
            </div>
            
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">💡 Sugestão</p>
              <p className="text-sm text-blue-700 mt-1">
                Que tal aumentar o peso do agachamento em 2.5kg na próxima semana?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
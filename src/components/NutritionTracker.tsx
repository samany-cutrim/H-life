"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Camera, Utensils, Clock, Plus, Trash2 } from 'lucide-react';

interface FoodItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  calories: number;
}

interface Meal {
  id: string;
  name: string;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
  foods: FoodItem[];
  totalCalories: number;
}

export default function NutritionTracker() {
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Café da Manhã',
      type: 'breakfast',
      time: '07:00',
      foods: [
        { id: '1', name: 'Aveia', quantity: 50, unit: 'g', calories: 190 },
        { id: '2', name: 'Banana', quantity: 1, unit: 'unidade', calories: 105 }
      ],
      totalCalories: 295
    }
  ]);

  const [newFood, setNewFood] = useState({
    name: '',
    quantity: 0,
    unit: 'g',
    calories: 0
  });

  const [selectedMeal, setSelectedMeal] = useState<string>('');
  const [showAddFood, setShowAddFood] = useState(false);

  const addFoodToMeal = () => {
    if (!selectedMeal || !newFood.name) return;

    const foodItem: FoodItem = {
      id: Date.now().toString(),
      ...newFood
    };

    setMeals(prev => prev.map(meal => {
      if (meal.id === selectedMeal) {
        const updatedFoods = [...meal.foods, foodItem];
        return {
          ...meal,
          foods: updatedFoods,
          totalCalories: updatedFoods.reduce((sum, food) => sum + food.calories, 0)
        };
      }
      return meal;
    }));

    setNewFood({ name: '', quantity: 0, unit: 'g', calories: 0 });
    setShowAddFood(false);
  };

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setMeals(prev => prev.map(meal => {
      if (meal.id === mealId) {
        const updatedFoods = meal.foods.filter(food => food.id !== foodId);
        return {
          ...meal,
          foods: updatedFoods,
          totalCalories: updatedFoods.reduce((sum, food) => sum + food.calories, 0)
        };
      }
      return meal;
    }));
  };

  const totalDailyCalories = meals.reduce((sum, meal) => sum + meal.totalCalories, 0);

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Resumo Nutricional</h2>
              <p className="text-emerald-100">Calorias consumidas hoje</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold">{totalDailyCalories}</div>
              <div className="text-emerald-100">de 1800 kcal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Macros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">45g</div>
            <div className="text-sm text-gray-600">Proteína</div>
            <div className="text-xs text-gray-500">Meta: 135g</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">85g</div>
            <div className="text-sm text-gray-600">Carboidratos</div>
            <div className="text-xs text-gray-500">Meta: 203g</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">15g</div>
            <div className="text-sm text-gray-600">Gorduras</div>
            <div className="text-xs text-gray-500">Meta: 50g</div>
          </CardContent>
        </Card>
      </div>

      {/* Meals */}
      <div className="space-y-4">
        {meals.map((meal) => (
          <Card key={meal.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-emerald-500" />
                  {meal.name}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">
                    <Clock className="w-3 h-3 mr-1" />
                    {meal.time}
                  </Badge>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    {meal.totalCalories} kcal
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {meal.foods.map((food) => (
                  <div key={food.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{food.name}</span>
                      <span className="text-sm text-gray-600 ml-2">
                        {food.quantity}{food.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{food.calories} kcal</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFoodFromMeal(meal.id, food.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedMeal(meal.id);
                    setShowAddFood(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Alimento
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-1" />
                  Fotografar Prato
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Food Modal */}
      {showAddFood && (
        <Card className="fixed inset-0 z-50 m-4 max-w-md mx-auto mt-20 h-fit bg-white shadow-2xl">
          <CardHeader>
            <CardTitle>Adicionar Alimento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="food-name">Nome do Alimento</Label>
              <Input
                id="food-name"
                value={newFood.name}
                onChange={(e) => setNewFood(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Ex: Arroz integral"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newFood.quantity}
                  onChange={(e) => setNewFood(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label htmlFor="unit">Unidade</Label>
                <Select value={newFood.unit} onValueChange={(value) => setNewFood(prev => ({ ...prev, unit: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="g">gramas</SelectItem>
                    <SelectItem value="ml">ml</SelectItem>
                    <SelectItem value="unidade">unidade</SelectItem>
                    <SelectItem value="colher">colher</SelectItem>
                    <SelectItem value="xícara">xícara</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="calories">Calorias</Label>
              <Input
                id="calories"
                type="number"
                value={newFood.calories}
                onChange={(e) => setNewFood(prev => ({ ...prev, calories: Number(e.target.value) }))}
              />
            </div>
            
            <div className="flex gap-2">
              <Button onClick={addFoodToMeal} className="flex-1">
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setShowAddFood(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🤖 Sugestões da IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">💡 Dica Nutricional</p>
              <p className="text-sm text-blue-700 mt-1">
                Você está consumindo poucas proteínas. Que tal adicionar ovos ou iogurte grego no lanche da tarde?
              </p>
            </div>
            
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">🎯 Meta do Dia</p>
              <p className="text-sm text-green-700 mt-1">
                Faltam apenas 1505 kcal para atingir sua meta diária. Continue assim!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
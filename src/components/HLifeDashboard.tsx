"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, 
  Apple, 
  Dumbbell, 
  Heart, 
  Target, 
  TrendingUp, 
  Droplets,
  MessageCircle,
  Trophy,
  Calendar,
  BarChart3,
  User,
  Camera,
  Mic,
  Video,
  Send,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertTriangle,
  Eye,
  Upload,
  Zap,
  Crown,
  Star,
  Lock,
  CreditCard,
  Check,
  BookOpen,
  PlayCircle,
  Clock,
  Repeat,
  Filter,
  Users,
  ShoppingCart,
  Package,
  Utensils,
  Truck,
  Phone,
  MessageSquare,
  DollarSign,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Coffee,
  Headphones
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockUser, mockDailyLog, mockHealthMetrics, mockAchievements, mockWeightData, mockCaloriesData } from '@/lib/mock-data';
import { calculateBMI, getBMICategory, getHealthScore, getMotivationalMessage, formatCalories, formatWeight } from '@/lib/health-utils';
import NutritionTracker from './NutritionTracker';
import WorkoutTracker from './WorkoutTracker';

export default function HLifeDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [waterIntake, setWaterIntake] = useState(mockDailyLog.waterIntake);
  const [chatMessage, setChatMessage] = useState('');
  const [supportChatMessage, setSupportChatMessage] = useState('');
  const [currentPlan, setCurrentPlan] = useState('free'); // free, premium, pro
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [selectedProfessional, setSelectedProfessional] = useState<any>(null);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Estados separados para os dois chats
  const [aiChatMessages, setAiChatMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Olá! Sou sua IA de saúde especializada. Posso ajudar você com:\n\n• 🏋️ Montagem de treinos personalizados\n• 🥗 Criação de dietas balanceadas\n• 📝 Listas de compras saudáveis\n• 💡 Dúvidas gerais sobre saúde e bem-estar\n\nComo posso ajudar você hoje?',
      timestamp: new Date()
    }
  ]);

  const [supportChatMessages, setSupportChatMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Olá! Bem-vindo ao suporte técnico da H-LIFE! 👋\n\nNossa equipe está aqui para ajudar com:\n\n• 🍱 Marmitas personalizadas e entregas\n• 📱 Dúvidas sobre o aplicativo\n• 💳 Problemas com pagamentos\n• 🔧 Suporte técnico geral\n• 📞 Agendamento de consultas\n\nComo podemos ajudar você?',
      timestamp: new Date()
    }
  ]);
  
  // Estados para análise de exercícios
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [exerciseAnalysis, setExerciseAnalysis] = useState<{
    exercise: string;
    correctness: number;
    feedback: string;
    improvements: string[];
  } | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Estados para análise de pratos
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [plateAnalysis, setPlateAnalysis] = useState<{
    foods: Array<{
      name: string;
      quantity: string;
      calories: number;
    }>;
    totalCalories: number;
    macros: {
      protein: number;
      carbs: number;
      fat: number;
    };
    healthScore: number;
    recommendations: string[];
  } | null>(null);

  // Frases motivacionais diárias
  const dailyMotivationalQuotes = [
    "Cada pequeno passo hoje é um grande salto amanhã! 🌟",
    "Seu corpo pode fazer isso. É sua mente que você precisa convencer! 💪",
    "O progresso, não a perfeição, é o que importa! 🎯",
    "Você está mais forte do que ontem! 🔥",
    "Cada refeição saudável é um investimento no seu futuro! 🥗",
    "Sua jornada de saúde é única e valiosa! ✨",
    "Hoje é o dia perfeito para cuidar de você! 🌅"
  ];

  // Selecionar frase do dia baseada na data
  const getTodayMotivationalQuote = () => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
    return dailyMotivationalQuotes[dayOfYear % dailyMotivationalQuotes.length];
  };

  // Base de dados de profissionais
  const professionals = [
    {
      id: 1,
      name: 'Dr. Ana Silva',
      specialty: 'Nutricionista',
      rating: 4.9,
      reviews: 127,
      price: 150,
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
      description: 'Especialista em nutrição esportiva e emagrecimento saudável',
      experience: '8 anos',
      certifications: ['CRN-3', 'Pós-graduação em Nutrição Esportiva'],
      availability: 'Seg-Sex: 8h-18h',
      languages: ['Português', 'Inglês'],
      consultationType: ['Presencial', 'Online']
    },
    {
      id: 2,
      name: 'Prof. Carlos Santos',
      specialty: 'Personal Trainer',
      rating: 4.8,
      reviews: 89,
      price: 120,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&crop=face',
      description: 'Personal trainer especializado em hipertrofia e condicionamento físico',
      experience: '6 anos',
      certifications: ['CREF', 'Certificação ACSM'],
      availability: 'Seg-Sáb: 6h-20h',
      languages: ['Português'],
      consultationType: ['Presencial', 'Online']
    },
    {
      id: 3,
      name: 'Dra. Maria Oliveira',
      specialty: 'Endocrinologista',
      rating: 5.0,
      reviews: 203,
      price: 300,
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face',
      description: 'Médica endocrinologista especialista em metabolismo e diabetes',
      experience: '12 anos',
      certifications: ['CRM-SP', 'Título de Especialista SBEM'],
      availability: 'Ter-Qui: 14h-18h',
      languages: ['Português', 'Inglês', 'Espanhol'],
      consultationType: ['Presencial']
    },
    {
      id: 4,
      name: 'Psic. João Costa',
      specialty: 'Psicólogo',
      rating: 4.7,
      reviews: 156,
      price: 180,
      image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face',
      description: 'Psicólogo especializado em comportamento alimentar e ansiedade',
      experience: '10 anos',
      certifications: ['CRP-06', 'Especialização em TCC'],
      availability: 'Seg-Sex: 9h-17h',
      languages: ['Português'],
      consultationType: ['Presencial', 'Online']
    }
  ];

  // Base de dados de produtos
  const products = [
    // Suplementos
    {
      id: 1,
      name: 'Whey Protein Isolado',
      category: 'suplementos',
      price: 89.90,
      originalPrice: 119.90,
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=400&fit=crop',
      description: 'Proteína isolada de alta qualidade para ganho de massa muscular',
      brand: 'NutriMax',
      rating: 4.8,
      reviews: 234,
      inStock: true,
      features: ['25g de proteína por dose', 'Baixo carboidrato', 'Sabor chocolate'],
      nutritionalInfo: {
        serving: '30g',
        calories: 110,
        protein: 25,
        carbs: 2,
        fat: 1
      }
    },
    {
      id: 2,
      name: 'Creatina Monohidratada',
      category: 'suplementos',
      price: 45.90,
      originalPrice: 59.90,
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
      description: 'Creatina pura para aumento de força e performance',
      brand: 'PowerFit',
      rating: 4.9,
      reviews: 189,
      inStock: true,
      features: ['100% pura', 'Sem sabor', '300g'],
      nutritionalInfo: {
        serving: '3g',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0
      }
    },
    // Marmitas
    {
      id: 3,
      name: 'Marmita Fit - Frango Grelhado',
      category: 'marmitas',
      price: 18.90,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
      description: 'Peito de frango grelhado com batata doce e brócolis',
      brand: 'FitMeals',
      rating: 4.6,
      reviews: 78,
      inStock: true,
      features: ['450 kcal', 'Rico em proteína', 'Sem conservantes'],
      nutritionalInfo: {
        serving: '400g',
        calories: 450,
        protein: 35,
        carbs: 40,
        fat: 12
      }
    },
    {
      id: 4,
      name: 'Marmita Vegana - Quinoa',
      category: 'marmitas',
      price: 16.90,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
      description: 'Quinoa com legumes refogados e tofu grelhado',
      brand: 'VeggieFit',
      rating: 4.4,
      reviews: 45,
      inStock: true,
      features: ['380 kcal', '100% vegano', 'Rico em fibras'],
      nutritionalInfo: {
        serving: '350g',
        calories: 380,
        protein: 18,
        carbs: 45,
        fat: 14
      }
    },
    // Alimentação Saudável
    {
      id: 5,
      name: 'Mix de Castanhas Premium',
      category: 'alimentacao',
      price: 24.90,
      originalPrice: 29.90,
      image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=400&h=400&fit=crop',
      description: 'Mix de castanhas, nozes e amêndoas sem sal',
      brand: 'NutriNuts',
      rating: 4.7,
      reviews: 92,
      inStock: true,
      features: ['200g', 'Sem sal adicionado', 'Rico em ômega-3'],
      nutritionalInfo: {
        serving: '30g',
        calories: 180,
        protein: 6,
        carbs: 5,
        fat: 16
      }
    },
    {
      id: 6,
      name: 'Granola Artesanal Zero Açúcar',
      category: 'alimentacao',
      price: 19.90,
      originalPrice: null,
      image: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=400&fit=crop',
      description: 'Granola artesanal adoçada com tâmaras',
      brand: 'GranolaFit',
      rating: 4.5,
      reviews: 67,
      inStock: false,
      features: ['300g', 'Zero açúcar', 'Com frutas desidratadas'],
      nutritionalInfo: {
        serving: '40g',
        calories: 160,
        protein: 5,
        carbs: 22,
        fat: 7
      }
    }
  ];

  // Base de dados de exercícios com vídeos
  const exerciseDatabase = {
    peito: [
      {
        id: 1,
        name: 'Flexão de Braço',
        category: 'peito',
        difficulty: 'Iniciante',
        duration: '3-4 séries de 8-12 repetições',
        equipment: 'Peso corporal',
        videoUrl: 'https://www.youtube.com/embed/IODxDxX7oi4',
        description: 'Exercício fundamental para fortalecer peito, ombros e tríceps.',
        instructions: [
          'Posicione-se em prancha com mãos na largura dos ombros',
          'Mantenha o corpo reto da cabeça aos pés',
          'Desça o peito até quase tocar o chão',
          'Empurre de volta à posição inicial'
        ],
        tips: [
          'Mantenha o core contraído',
          'Não deixe os quadris caírem',
          'Controle o movimento na descida'
        ]
      },
      {
        id: 2,
        name: 'Supino com Halteres',
        category: 'peito',
        difficulty: 'Intermediário',
        duration: '3-4 séries de 8-10 repetições',
        equipment: 'Halteres, banco',
        videoUrl: 'https://www.youtube.com/embed/VmB1G1K7v94',
        description: 'Exercício clássico para desenvolvimento do peitoral maior.',
        instructions: [
          'Deite no banco com halteres nas mãos',
          'Posicione os halteres na altura do peito',
          'Empurre os pesos para cima até extensão completa',
          'Desça controladamente até a posição inicial'
        ],
        tips: [
          'Mantenha os pés firmes no chão',
          'Não arqueie excessivamente as costas',
          'Controle o peso na descida'
        ]
      }
    ],
    costas: [
      {
        id: 3,
        name: 'Remada Curvada',
        category: 'costas',
        difficulty: 'Intermediário',
        duration: '3-4 séries de 8-10 repetições',
        equipment: 'Barra ou halteres',
        videoUrl: 'https://www.youtube.com/embed/FWJR5Ve8bnQ',
        description: 'Excelente exercício para fortalecer toda a musculatura das costas.',
        instructions: [
          'Fique em pé com pés na largura dos ombros',
          'Incline o tronco para frente mantendo as costas retas',
          'Puxe a barra em direção ao abdômen',
          'Retorne controladamente à posição inicial'
        ],
        tips: [
          'Mantenha o peito para fora',
          'Aperte as escápulas no final do movimento',
          'Não use impulso'
        ]
      },
      {
        id: 4,
        name: 'Pull-up (Barra Fixa)',
        category: 'costas',
        difficulty: 'Avançado',
        duration: '3-4 séries de 5-8 repetições',
        equipment: 'Barra fixa',
        videoUrl: 'https://www.youtube.com/embed/eGo4IYlbE5g',
        description: 'Um dos melhores exercícios para desenvolver força nas costas.',
        instructions: [
          'Pendure-se na barra com pegada pronada',
          'Puxe o corpo para cima até o queixo passar da barra',
          'Desça controladamente até extensão completa',
          'Repita o movimento'
        ],
        tips: [
          'Evite balançar o corpo',
          'Foque em puxar com as costas',
          'Desça completamente entre repetições'
        ]
      }
    ],
    pernas: [
      {
        id: 5,
        name: 'Agachamento',
        category: 'pernas',
        difficulty: 'Iniciante',
        duration: '3-4 séries de 10-15 repetições',
        equipment: 'Peso corporal ou barra',
        videoUrl: 'https://www.youtube.com/embed/Dy28eq2PjcM',
        description: 'O rei dos exercícios para pernas, trabalha quadríceps, glúteos e core.',
        instructions: [
          'Fique em pé com pés na largura dos ombros',
          'Desça como se fosse sentar em uma cadeira',
          'Mantenha o peito erguido e joelhos alinhados',
          'Suba empurrando pelos calcanhares'
        ],
        tips: [
          'Não deixe os joelhos passarem da ponta dos pés',
          'Desça até as coxas ficarem paralelas ao chão',
          'Mantenha o peso nos calcanhares'
        ]
      },
      {
        id: 6,
        name: 'Lunges (Afundo)',
        category: 'pernas',
        difficulty: 'Iniciante',
        duration: '3 séries de 10 repetições cada perna',
        equipment: 'Peso corporal ou halteres',
        videoUrl: 'https://www.youtube.com/embed/QOVaHwm-Q6U',
        description: 'Exercício unilateral excelente para quadríceps, glúteos e estabilidade.',
        instructions: [
          'Dê um passo à frente com uma perna',
          'Desça até ambos os joelhos formarem 90°',
          'Empurre com a perna da frente para voltar',
          'Alterne as pernas ou complete uma série de cada vez'
        ],
        tips: [
          'Mantenha o tronco ereto',
          'Não deixe o joelho da frente passar do pé',
          'Distribua o peso entre ambas as pernas'
        ]
      }
    ],
    bracos: [
      {
        id: 7,
        name: 'Rosca Bíceps',
        category: 'bracos',
        difficulty: 'Iniciante',
        duration: '3 séries de 10-12 repetições',
        equipment: 'Halteres ou barra',
        videoUrl: 'https://www.youtube.com/embed/ykJmrZ5v0Oo',
        description: 'Exercício clássico para desenvolvimento dos bíceps.',
        instructions: [
          'Fique em pé com halteres nas mãos',
          'Mantenha os cotovelos próximos ao corpo',
          'Flexione os braços levando os pesos aos ombros',
          'Desça controladamente à posição inicial'
        ],
        tips: [
          'Não balance o corpo',
          'Mantenha os cotovelos fixos',
          'Controle o movimento na descida'
        ]
      },
      {
        id: 8,
        name: 'Tríceps Testa',
        category: 'bracos',
        difficulty: 'Intermediário',
        duration: '3 séries de 8-10 repetições',
        equipment: 'Barra W ou halteres',
        videoUrl: 'https://www.youtube.com/embed/d_KZxkY_0cM',
        description: 'Exercício isolado para desenvolvimento dos tríceps.',
        instructions: [
          'Deite no banco segurando a barra',
          'Mantenha os braços perpendiculares ao chão',
          'Flexione apenas os antebraços descendo a barra',
          'Estenda os braços de volta à posição inicial'
        ],
        tips: [
          'Mantenha os cotovelos fixos',
          'Não deixe os cotovelos abrirem',
          'Controle o peso na descida'
        ]
      }
    ],
    core: [
      {
        id: 9,
        name: 'Prancha',
        category: 'core',
        difficulty: 'Iniciante',
        duration: '3 séries de 30-60 segundos',
        equipment: 'Peso corporal',
        videoUrl: 'https://www.youtube.com/embed/ASdvN_XEl_c',
        description: 'Exercício isométrico fundamental para fortalecimento do core.',
        instructions: [
          'Posicione-se em prancha sobre os antebraços',
          'Mantenha o corpo reto da cabeça aos pés',
          'Contraia o abdômen e glúteos',
          'Mantenha a posição pelo tempo determinado'
        ],
        tips: [
          'Não deixe os quadris caírem',
          'Respire normalmente',
          'Mantenha o pescoço neutro'
        ]
      },
      {
        id: 10,
        name: 'Abdominal Crunch',
        category: 'core',
        difficulty: 'Iniciante',
        duration: '3 séries de 15-20 repetições',
        equipment: 'Peso corporal',
        videoUrl: 'https://www.youtube.com/embed/Xyd_fa5zoEU',
        description: 'Exercício clássico para fortalecimento do reto abdominal.',
        instructions: [
          'Deite com joelhos flexionados',
          'Coloque as mãos atrás da cabeça',
          'Contraia o abdômen elevando o tronco',
          'Desça controladamente sem relaxar'
        ],
        tips: [
          'Não puxe o pescoço',
          'Foque na contração abdominal',
          'Mantenha os pés no chão'
        ]
      }
    ]
  };
  
  const user = mockUser;
  const dailyLog = mockDailyLog;
  const healthMetrics = mockHealthMetrics;
  const achievements = mockAchievements;
  
  const bmi = calculateBMI(user.weight, user.height);
  const bmiCategory = getBMICategory(bmi);
  
  const healthScore = getHealthScore({
    caloriesConsumed: dailyLog.caloriesConsumed,
    caloriesTarget: 1800,
    waterIntake: waterIntake,
    waterTarget: 2000,
    workoutsCompleted: dailyLog.workoutsCompleted,
    workoutsTarget: 1
  });
  
  const motivationalMessage = getMotivationalMessage(healthScore);
  
  const addWater = (amount: number) => {
    setWaterIntake(prev => Math.min(prev + amount, 3000));
  };

  // Planos disponíveis
  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: 'R$ 0',
      period: '/mês',
      features: [
        'Dashboard básico',
        'Registro manual de refeições',
        'Treinos básicos',
        '5 análises de IA por mês',
        'Suporte por email'
      ],
      limitations: [
        'Análise de pratos limitada',
        'Sem análise de exercícios',
        'Relatórios básicos'
      ],
      color: 'gray',
      current: currentPlan === 'free'
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 'R$ 29,90',
      period: '/mês',
      features: [
        'Tudo do plano Gratuito',
        'Análise ilimitada de pratos com IA',
        'Análise de exercícios com IA',
        'Planos personalizados',
        'Relatórios detalhados',
        'Chat com IA 24/7',
        'Sincronização com wearables'
      ],
      color: 'emerald',
      popular: true,
      current: currentPlan === 'premium'
    },
    {
      id: 'pro',
      name: 'Profissional',
      price: 'R$ 59,90',
      period: '/mês',
      features: [
        'Tudo do plano Premium',
        'Análise de exames médicos',
        'Consultoria nutricional IA',
        'Planos de treino avançados',
        'API para desenvolvedores',
        'Suporte prioritário',
        'Relatórios para profissionais',
        'Integração com clínicas'
      ],
      color: 'purple',
      current: currentPlan === 'pro'
    }
  ];

  // Verificar se funcionalidade está disponível no plano atual
  const hasFeature = (feature: string) => {
    const planFeatures = {
      free: ['basic-dashboard', 'manual-food', 'basic-workouts'],
      premium: ['basic-dashboard', 'manual-food', 'basic-workouts', 'ai-plate-analysis', 'ai-exercise-analysis', 'ai-chat'],
      pro: ['basic-dashboard', 'manual-food', 'basic-workouts', 'ai-plate-analysis', 'ai-exercise-analysis', 'ai-chat', 'medical-analysis', 'advanced-reports']
    };
    
    return planFeatures[currentPlan as keyof typeof planFeatures]?.includes(feature) || false;
  };

  // Componente de upgrade
  const UpgradePrompt = ({ feature, title }: { feature: string; title: string }) => (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6 text-center">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Crown className="w-8 h-8 text-orange-500" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">
        Esta funcionalidade está disponível nos planos Premium e Profissional
      </p>
      <Button 
        onClick={() => setShowPlanModal(true)}
        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
      >
        <Crown className="w-4 h-4 mr-2" />
        Fazer Upgrade
      </Button>
    </div>
  );

  // Modal de planos
  const PlanModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Escolha seu Plano</h2>
              <p className="text-gray-600">Desbloqueie todo o potencial da IA para sua saúde</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setShowPlanModal(false)}
              className="rounded-full w-10 h-10 p-0"
            >
              ✕
            </Button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div 
                key={plan.id}
                className={`relative rounded-2xl border-2 p-6 ${
                  plan.popular 
                    ? 'border-emerald-500 bg-gradient-to-b from-emerald-50 to-white' 
                    : plan.current
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white'
                } hover:shadow-lg transition-all`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-500 text-white px-3 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Mais Popular
                    </Badge>
                  </div>
                )}
                
                {plan.current && (
                  <div className="absolute -top-3 right-4">
                    <Badge className="bg-blue-500 text-white px-3 py-1">
                      Plano Atual
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-gray-600 ml-1">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.limitations && (
                  <ul className="space-y-2 mb-6 pb-4 border-b border-gray-200">
                    {plan.limitations.map((limitation, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Lock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-500">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Button 
                  className={`w-full ${
                    plan.current
                      ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                      : plan.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700'
                      : plan.color === 'purple'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                      : 'bg-gray-900 hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    if (!plan.current) {
                      setCurrentPlan(plan.id);
                      setShowPlanModal(false);
                    }
                  }}
                  disabled={plan.current}
                >
                  {plan.current ? (
                    'Plano Atual'
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 mr-2" />
                      {plan.id === 'free' ? 'Usar Gratuito' : 'Assinar Agora'}
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center text-sm text-gray-600">
            <p>💳 Pagamento seguro • 🔄 Cancele a qualquer momento • 📞 Suporte 24/7</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Modal de profissional
  const ProfessionalModal = () => {
    if (!selectedProfessional) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Agendar Consulta</h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedProfessional(null)}
                className="rounded-full w-10 h-10 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Aviso sobre Taxa e Regras */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Informações Importantes</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• O profissional paga uma taxa por cada cliente atendido</li>
                    <li>• É proibido passar número de telefone ou contatar fora do aplicativo</li>
                    <li>• Toda comunicação deve ser feita através da plataforma H-LIFE</li>
                    <li>• Violações podem resultar em suspensão da conta</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Perfil do Profissional */}
            <div className="flex items-start gap-4">
              <img 
                src={selectedProfessional.image} 
                alt={selectedProfessional.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold">{selectedProfessional.name}</h3>
                <p className="text-emerald-600 font-medium">{selectedProfessional.specialty}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(selectedProfessional.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedProfessional.rating} ({selectedProfessional.reviews} avaliações)
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">R$ {selectedProfessional.price}</div>
                <div className="text-sm text-gray-600">por consulta</div>
              </div>
            </div>

            {/* Informações Detalhadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">📋 Sobre</h4>
                <p className="text-sm text-gray-700 mb-4">{selectedProfessional.description}</p>
                
                <h4 className="font-semibold mb-2">🎓 Certificações</h4>
                <ul className="space-y-1">
                  {selectedProfessional.certifications.map((cert, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-center gap-2">
                      <Check className="w-3 h-3 text-green-500" />
                      {cert}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">⏰ Disponibilidade</h4>
                <p className="text-sm text-gray-700 mb-4">{selectedProfessional.availability}</p>
                
                <h4 className="font-semibold mb-2">💬 Idiomas</h4>
                <div className="flex gap-2 mb-4">
                  {selectedProfessional.languages.map((lang, index) => (
                    <Badge key={index} variant="outline">{lang}</Badge>
                  ))}
                </div>

                <h4 className="font-semibold mb-2">📍 Tipo de Consulta</h4>
                <div className="flex gap-2">
                  {selectedProfessional.consultationType.map((type, index) => (
                    <Badge key={index} className="bg-blue-100 text-blue-700">{type}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Agendamento */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold mb-3">📅 Escolha data e horário</h4>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {['Hoje 14:00', 'Amanhã 10:00', 'Amanhã 16:00', 'Sex 09:00', 'Sex 15:00', 'Sáb 11:00'].map((slot, index) => (
                  <Button key={index} variant="outline" size="sm" className="text-xs">
                    {slot}
                  </Button>
                ))}
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3">
              <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar Consulta
              </Button>
              <Button variant="outline">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat Interno
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modal de produto
  const ProductModal = () => {
    if (!selectedProduct) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Detalhes do Produto</h2>
              <Button 
                variant="outline" 
                onClick={() => setSelectedProduct(null)}
                className="rounded-full w-10 h-10 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Imagem e Preço */}
            <div className="flex items-start gap-6">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name}
                className="w-32 h-32 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{selectedProduct.name}</h3>
                <p className="text-gray-600 mb-3">{selectedProduct.description}</p>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(selectedProduct.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {selectedProduct.rating} ({selectedProduct.reviews} avaliações)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-emerald-600">R$ {selectedProduct.price.toFixed(2)}</span>
                  {selectedProduct.originalPrice && (
                    <span className="text-lg text-gray-500 line-through">R$ {selectedProduct.originalPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Informações Nutricionais */}
            {selectedProduct.nutritionalInfo && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">📊 Informações Nutricionais (por {selectedProduct.nutritionalInfo.serving})</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{selectedProduct.nutritionalInfo.calories}</div>
                    <div className="text-sm text-gray-600">kcal</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{selectedProduct.nutritionalInfo.protein}g</div>
                    <div className="text-sm text-gray-600">Proteína</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600">{selectedProduct.nutritionalInfo.carbs}g</div>
                    <div className="text-sm text-gray-600">Carboidratos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600">{selectedProduct.nutritionalInfo.fat}g</div>
                    <div className="text-sm text-gray-600">Gorduras</div>
                  </div>
                </div>
              </div>
            )}

            {/* Características */}
            <div>
              <h4 className="font-semibold mb-3">✨ Características</h4>
              <ul className="space-y-2">
                {selectedProduct.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Status e Ações */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex items-center gap-2">
                {selectedProduct.inStock ? (
                  <>
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600">Em estoque</span>
                  </>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-600">Fora de estoque</span>
                  </>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    const existingItem = cartItems.find(item => item.id === selectedProduct.id);
                    if (existingItem) {
                      setCartItems(cartItems.map(item => 
                        item.id === selectedProduct.id 
                          ? { ...item, quantity: item.quantity + 1 }
                          : item
                      ));
                    } else {
                      setCartItems([...cartItems, { ...selectedProduct, quantity: 1 }]);
                    }
                  }}
                  disabled={!selectedProduct.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Adicionar ao Carrinho
                </Button>
                <Button 
                  className="bg-gradient-to-r from-emerald-500 to-teal-600"
                  disabled={!selectedProduct.inStock}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Comprar Agora
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Função para enviar mensagem no IA Chat
  const sendAiMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Verificar se tem acesso ao chat IA
    if (!hasFeature('ai-chat')) {
      setShowPlanModal(true);
      return;
    }
    
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: chatMessage,
      timestamp: new Date()
    };
    
    setAiChatMessages(prev => [...prev, newMessage]);
    setChatMessage('');
    
    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Entendi sua solicitação! Vou analisar seus dados e criar uma resposta personalizada. Em um app real, aqui seria processado pela IA especializada em saúde.',
        timestamp: new Date()
      };
      setAiChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  // Função para enviar mensagem no Suporte Técnico
  const sendSupportMessage = () => {
    if (!supportChatMessage.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: supportChatMessage,
      timestamp: new Date()
    };
    
    setSupportChatMessages(prev => [...prev, newMessage]);
    setSupportChatMessage('');
    
    // Simular resposta da equipe de suporte
    setTimeout(() => {
      const supportResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Obrigado por entrar em contato! Nossa equipe recebeu sua mensagem e irá responder em breve. Para marmitas personalizadas, podemos criar um plano especial baseado na sua dieta. Como podemos ajudar especificamente?',
        timestamp: new Date()
      };
      setSupportChatMessages(prev => [...prev, supportResponse]);
    }, 1500);
  };

  // Função para iniciar gravação de exercício
  const startRecording = () => {
    if (!hasFeature('ai-exercise-analysis')) {
      setShowPlanModal(true);
      return;
    }
    
    setIsRecording(true);
    setRecordingTime(0);
    setExerciseAnalysis(null);
    setShowAnalysis(false);
    
    // Simular timer de gravação
    const timer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // Simular análise após 10 segundos
    setTimeout(() => {
      setIsRecording(false);
      clearInterval(timer);
      analyzeExercise();
    }, 10000);
  };

  // Função para parar gravação
  const stopRecording = () => {
    setIsRecording(false);
    analyzeExercise();
  };

  // Função para analisar exercício
  const analyzeExercise = () => {
    // Simular análise da IA
    setTimeout(() => {
      const mockAnalysis = {
        exercise: 'Agachamento',
        correctness: 85,
        feedback: 'Boa execução! Sua postura está correta na maior parte do movimento.',
        improvements: [
          'Mantenha o peito mais erguido durante a descida',
          'Desça um pouco mais para ativar melhor os glúteos',
          'Mantenha os joelhos alinhados com os pés'
        ]
      };
      
      setExerciseAnalysis(mockAnalysis);
      setShowAnalysis(true);
    }, 2000);
  };

  // Função para selecionar imagem do prato
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!hasFeature('ai-plate-analysis')) {
      setShowPlanModal(true);
      return;
    }
    
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
      setPlateAnalysis(null);
    }
  };

  // Função para analisar prato
  const analyzePlate = () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    
    // Simular análise da IA
    setTimeout(() => {
      const mockPlateAnalysis = {
        foods: [
          { name: 'Peito de frango grelhado', quantity: '150g', calories: 248 },
          { name: 'Arroz integral', quantity: '100g', calories: 111 },
          { name: 'Brócolis refogado', quantity: '80g', calories: 27 },
          { name: 'Batata doce assada', quantity: '120g', calories: 103 },
          { name: 'Azeite extra virgem', quantity: '1 colher de sopa', calories: 119 }
        ],
        totalCalories: 608,
        macros: {
          protein: 45,
          carbs: 52,
          fat: 18
        },
        healthScore: 92,
        recommendations: [
          'Excelente combinação de proteína magra e carboidratos complexos',
          'Adicione mais vegetais coloridos para aumentar antioxidantes',
          'Considere reduzir um pouco o azeite se o objetivo é perda de peso'
        ]
      };
      
      setPlateAnalysis(mockPlateAnalysis);
      setIsAnalyzing(false);
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filtrar exercícios por categoria
  const getFilteredExercises = () => {
    if (selectedCategory === 'todos') {
      return Object.values(exerciseDatabase).flat();
    }
    return exerciseDatabase[selectedCategory as keyof typeof exerciseDatabase] || [];
  };

  // Filtrar produtos por categoria
  const getFilteredProducts = (category: string) => {
    if (category === 'todos') {
      return products;
    }
    return products.filter(product => product.category === category);
  };

  // Modal de detalhes do exercício
  const ExerciseModal = () => {
    if (!selectedExercise) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{selectedExercise.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className={`${
                    selectedExercise.difficulty === 'Iniciante' ? 'bg-green-100 text-green-700' :
                    selectedExercise.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {selectedExercise.difficulty}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedExercise.duration}
                  </Badge>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedExercise(null)}
                className="rounded-full w-10 h-10 p-0"
              >
                ✕
              </Button>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Vídeo */}
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={selectedExercise.videoUrl}
                title={selectedExercise.name}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Informações */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">📝 Descrição</h3>
                <p className="text-gray-700 mb-4">{selectedExercise.description}</p>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Dumbbell className="w-4 h-4 text-blue-600" />
                    <span className="font-medium text-blue-800">Equipamento</span>
                  </div>
                  <p className="text-blue-700">{selectedExercise.equipment}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">🎯 Como Executar</h3>
                <ol className="space-y-2 mb-4">
                  {selectedExercise.instructions.map((instruction: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-sm text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>

                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800">Dicas Importantes</span>
                  </div>
                  <ul className="space-y-1">
                    {selectedExercise.tips.map((tip: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                        <span className="text-yellow-500 mt-1">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-3 pt-4 border-t">
              <Button className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600">
                <Play className="w-4 h-4 mr-2" />
                Iniciar Treino
              </Button>
              <Button variant="outline">
                <Heart className="w-4 h-4 mr-2" />
                Favoritar
              </Button>
              <Button variant="outline">
                <Calendar className="w-4 h-4 mr-2" />
                Agendar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Lista de abas para navegação lateral
  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
    { id: 'nutrition', name: 'Nutrição', icon: Apple },
    { id: 'workout', name: 'Treino', icon: Dumbbell },
    { id: 'exercises', name: 'Exercícios', icon: BookOpen },
    { id: 'health', name: 'Saúde', icon: Activity },
    { id: 'achievements', name: 'Conquistas', icon: Trophy },
    { id: 'professionals', name: 'Profissionais', icon: Users },
    { id: 'store', name: 'Loja', icon: ShoppingBag },
    { id: 'ai-chat', name: 'IA Chat', icon: MessageCircle, premium: !hasFeature('ai-chat') },
    { id: 'support-chat', name: 'Suporte Técnico', icon: Headphones }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {/* Menu Mobile */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              <div className="w-10 h-10 rounded-xl flex items-center justify-center">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/adb2cb61-ca85-4fd2-8d60-bbb7eabd9363.png" 
                  alt="H-LIFE Logo" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  H-LIFE
                </h1>
                <p className="text-sm text-gray-600">Saúde Inteligente com IA</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Indicador do Plano */}
              <div className="flex items-center gap-2">
                <Badge 
                  className={`${
                    currentPlan === 'free' 
                      ? 'bg-gray-100 text-gray-700' 
                      : currentPlan === 'premium'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-purple-100 text-purple-700'
                  }`}
                >
                  {currentPlan === 'free' && <User className="w-3 h-3 mr-1" />}
                  {currentPlan === 'premium' && <Crown className="w-3 h-3 mr-1" />}
                  {currentPlan === 'pro' && <Star className="w-3 h-3 mr-1" />}
                  {plans.find(p => p.id === currentPlan)?.name}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowPlanModal(true)}
                  className="text-xs"
                >
                  Upgrade
                </Button>
              </div>
              
              {/* Carrinho */}
              <div className="relative">
                <Button variant="outline" size="sm" className="relative">
                  <ShoppingCart className="w-4 h-4" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                Score: {healthScore}%
              </Badge>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Lateral */}
        <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className="flex flex-col h-full pt-20 lg:pt-4">
            {/* Header do Sidebar */}
            <div className="flex items-center justify-between px-4 py-4 lg:hidden">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Lista de Abas */}
            <nav className="flex-1 px-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-100 text-emerald-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                    {tab.premium && (
                      <Lock className="w-3 h-3 ml-auto text-orange-500" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Footer do Sidebar */}
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={() => setShowPlanModal(true)}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-sm"
                size="sm"
              >
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Premium
              </Button>
            </div>
          </div>
        </div>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Conteúdo Principal */}
        <div className="flex-1 lg:ml-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                {/* Motivational Banner */}
                <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold mb-2">Olá, {user.name}! 👋</h2>
                        <p className="text-emerald-100">{motivationalMessage}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold">{healthScore}%</div>
                        <div className="text-emerald-100">Score de Saúde</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Frase Motivacional Diária */}
                <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-yellow-800 mb-1">Frase do Dia</h3>
                        <p className="text-yellow-700 text-sm">{getTodayMotivationalQuote()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Calorias Hoje</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {dailyLog.caloriesConsumed}
                          </p>
                          <p className="text-xs text-gray-500">Meta: 1800 kcal</p>
                        </div>
                        <Apple className="w-8 h-8 text-emerald-500" />
                      </div>
                      <Progress 
                        value={(dailyLog.caloriesConsumed / 1800) * 100} 
                        className="mt-3"
                      />
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Água</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {(waterIntake / 1000).toFixed(1)}L
                          </p>
                          <p className="text-xs text-gray-500">Meta: 2.0L</p>
                        </div>
                        <Droplets className="w-8 h-8 text-blue-500" />
                      </div>
                      <Progress 
                        value={(waterIntake / 2000) * 100} 
                        className="mt-3"
                      />
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" onClick={() => addWater(250)}>
                          +250ml
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => addWater(500)}>
                          +500ml
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Treinos</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {dailyLog.workoutsCompleted}
                          </p>
                          <p className="text-xs text-gray-500">Hoje</p>
                        </div>
                        <Dumbbell className="w-8 h-8 text-purple-500" />
                      </div>
                      <Badge variant="secondary" className="mt-3 bg-purple-100 text-purple-700">
                        45 min concluído
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">Peso Atual</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatWeight(user.weight)}
                          </p>
                          <p className="text-xs text-gray-500">IMC: {bmi} ({bmiCategory})</p>
                        </div>
                        <Target className="w-8 h-8 text-orange-500" />
                      </div>
                      <div className="mt-3">
                        <div className="flex items-center text-sm text-green-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          -3kg este mês
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Evolução do Peso</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={mockWeightData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="weight" 
                            stroke="#10b981" 
                            strokeWidth={3}
                            dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="target" 
                            stroke="#6b7280" 
                            strokeDasharray="5 5"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Calorias da Semana</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={mockCaloriesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="consumed" fill="#10b981" name="Consumidas" />
                          <Bar dataKey="burned" fill="#f59e0b" name="Queimadas" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Nutrition Tab */}
            {activeTab === 'nutrition' && (
              <div className="space-y-6">
                <NutritionTracker />
                
                {/* Seção de Marmitas Personalizadas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-orange-500" />
                      Marmitas Personalizadas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                          <Coffee className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-orange-800 mb-2">
                            Quer marmitas personalizadas com sua dieta?
                          </h3>
                          <p className="text-orange-700 text-sm mb-4">
                            Nossa equipe pode preparar marmitas especiais seguindo exatamente seu plano alimentar personalizado. 
                            Ingredientes frescos, porções calculadas e entrega na sua casa!
                          </p>
                          <Button 
                            onClick={() => setActiveTab('support-chat')}
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Falar no Chat do App
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Análise de Pratos com IA */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      Análise de Pratos com IA
                      {!hasFeature('ai-plate-analysis') && (
                        <Badge className="bg-orange-100 text-orange-700 ml-2">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!hasFeature('ai-plate-analysis') ? (
                      <UpgradePrompt 
                        feature="ai-plate-analysis" 
                        title="Análise de Pratos com IA"
                      />
                    ) : (
                      <>
                        {/* Upload de Foto */}
                        <div className="bg-gray-100 rounded-lg p-6">
                          {!imagePreview ? (
                            <div className="text-center space-y-4">
                              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                                <Camera className="w-12 h-12 text-orange-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Fotografe seu prato</h3>
                                <p className="text-gray-600 mb-4">
                                  A IA irá identificar os alimentos e calcular as calorias automaticamente
                                </p>
                                <label htmlFor="plate-image" className="cursor-pointer">
                                  <Button 
                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                    asChild
                                  >
                                    <span>
                                      <Upload className="w-4 h-4 mr-2" />
                                      Selecionar Foto
                                    </span>
                                  </Button>
                                </label>
                                <input
                                  id="plate-image"
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageSelect}
                                  className="hidden"
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              <div className="relative">
                                <img 
                                  src={imagePreview} 
                                  alt="Prato selecionado" 
                                  className="w-full max-w-md mx-auto rounded-lg shadow-lg"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setImagePreview(null);
                                    setSelectedImage(null);
                                    setPlateAnalysis(null);
                                  }}
                                  className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm"
                                >
                                  ✕
                                </Button>
                              </div>
                              
                              {!plateAnalysis && !isAnalyzing && (
                                <div className="text-center">
                                  <Button 
                                    onClick={analyzePlate}
                                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                                  >
                                    <Zap className="w-4 h-4 mr-2" />
                                    Analisar com IA
                                  </Button>
                                </div>
                              )}

                              {isAnalyzing && (
                                <div className="text-center space-y-3">
                                  <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                  <p className="text-gray-600">Analisando alimentos...</p>
                                </div>
                              )}

                              {plateAnalysis && (
                                <div className="bg-white rounded-lg p-6 border space-y-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-lg font-semibold">Análise Nutricional</h4>
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm text-gray-600">Score Saúde:</span>
                                      <Badge className="bg-green-100 text-green-700">
                                        {plateAnalysis.healthScore}%
                                      </Badge>
                                    </div>
                                  </div>

                                  {/* Total de Calorias */}
                                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 text-center">
                                    <div className="text-3xl font-bold text-orange-600 mb-1">
                                      {plateAnalysis.totalCalories} kcal
                                    </div>
                                    <div className="text-sm text-gray-600">Total estimado</div>
                                  </div>

                                  {/* Macronutrientes */}
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                                      <div className="text-xl font-bold text-blue-600">{plateAnalysis.macros.protein}g</div>
                                      <div className="text-sm text-gray-600">Proteína</div>
                                    </div>
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                      <div className="text-xl font-bold text-green-600">{plateAnalysis.macros.carbs}g</div>
                                      <div className="text-sm text-gray-600">Carboidratos</div>
                                    </div>
                                    <div className="text-center p-3 bg-yellow-50 rounded-lg">
                                      <div className="text-xl font-bold text-yellow-600">{plateAnalysis.macros.fat}g</div>
                                      <div className="text-sm text-gray-600">Gorduras</div>
                                    </div>
                                  </div>

                                  {/* Alimentos Identificados */}
                                  <div>
                                    <h5 className="font-medium mb-3">🍽️ Alimentos Identificados</h5>
                                    <div className="space-y-2">
                                      {plateAnalysis.foods.map((food, index) => (
                                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                          <div>
                                            <span className="font-medium">{food.name}</span>
                                            <span className="text-sm text-gray-600 ml-2">({food.quantity})</span>
                                          </div>
                                          <span className="text-sm font-semibold text-orange-600">
                                            {food.calories} kcal
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  {/* Recomendações */}
                                  <div>
                                    <h5 className="font-medium text-green-700 mb-2">💡 Recomendações da IA</h5>
                                    <ul className="space-y-1">
                                      {plateAnalysis.recommendations.map((rec, index) => (
                                        <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                          {rec}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>

                                  {/* Ações */}
                                  <div className="flex gap-2 pt-4 border-t">
                                    <Button 
                                      className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600"
                                    >
                                      Adicionar ao Diário
                                    </Button>
                                    <Button 
                                      variant="outline"
                                      onClick={() => {
                                        setImagePreview(null);
                                        setSelectedImage(null);
                                        setPlateAnalysis(null);
                                      }}
                                    >
                                      Nova Foto
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Histórico de Análises */}
                        <div>
                          <h4 className="font-semibold mb-3">Histórico de Análises</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Almoço - Prato Saudável</span>
                                <Badge className="bg-green-100 text-green-700">608 kcal</Badge>
                              </div>
                              <p className="text-sm text-gray-600">Hoje • Score: 92%</p>
                            </div>
                            
                            <div className="bg-white border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Café da Manhã</span>
                                <Badge className="bg-blue-100 text-blue-700">320 kcal</Badge>
                              </div>
                              <p className="text-sm text-gray-600">Hoje • Score: 85%</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Workout Tab */}
            {activeTab === 'workout' && (
              <div className="space-y-6">
                <WorkoutTracker />
                
                {/* Análise de Exercícios com IA */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5 text-purple-500" />
                      Análise de Exercícios com IA
                      {!hasFeature('ai-exercise-analysis') && (
                        <Badge className="bg-orange-100 text-orange-700 ml-2">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {!hasFeature('ai-exercise-analysis') ? (
                      <UpgradePrompt 
                        feature="ai-exercise-analysis" 
                        title="Análise de Exercícios com IA"
                      />
                    ) : (
                      <>
                        {/* Gravação de Vídeo */}
                        <div className="bg-gray-100 rounded-lg p-6 text-center">
                          {!isRecording && !showAnalysis && (
                            <div className="space-y-4">
                              <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                                <Video className="w-12 h-12 text-purple-500" />
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Grave seu exercício</h3>
                                <p className="text-gray-600 mb-4">
                                  A IA irá analisar sua execução e dar feedback em tempo real
                                </p>
                                <Button 
                                  onClick={startRecording}
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Iniciar Gravação
                                </Button>
                              </div>
                            </div>
                          )}

                          {isRecording && (
                            <div className="space-y-4">
                              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                              </div>
                              <div>
                                <h3 className="text-lg font-semibold mb-2">Gravando...</h3>
                                <div className="text-2xl font-mono text-red-500 mb-4">
                                  {formatTime(recordingTime)}
                                </div>
                                <p className="text-gray-600 mb-4">
                                  IA analisando seus movimentos em tempo real
                                </p>
                                <Button 
                                  onClick={stopRecording}
                                  variant="outline"
                                  className="border-red-500 text-red-500 hover:bg-red-50"
                                >
                                  <Square className="w-4 h-4 mr-2" />
                                  Parar Gravação
                                </Button>
                              </div>
                            </div>
                          )}

                          {showAnalysis && exerciseAnalysis && (
                            <div className="space-y-4 text-left">
                              <div className="flex items-center justify-center mb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                  <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                              </div>
                              
                              <div className="bg-white rounded-lg p-4 border">
                                <h4 className="font-semibold text-lg mb-2">
                                  Análise: {exerciseAnalysis.exercise}
                                </h4>
                                
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-sm text-gray-600">Precisão:</span>
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-1000"
                                      style={{ width: `${exerciseAnalysis.correctness}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm font-semibold text-green-600">
                                    {exerciseAnalysis.correctness}%
                                  </span>
                                </div>

                                <div className="mb-4">
                                  <h5 className="font-medium text-green-700 mb-2">✅ Feedback Geral</h5>
                                  <p className="text-sm text-gray-700">{exerciseAnalysis.feedback}</p>
                                </div>

                                <div>
                                  <h5 className="font-medium text-orange-700 mb-2">💡 Sugestões de Melhoria</h5>
                                  <ul className="space-y-1">
                                    {exerciseAnalysis.improvements.map((improvement, index) => (
                                      <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                                        <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                        {improvement}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </div>

                              <div className="flex gap-2 justify-center">
                                <Button 
                                  onClick={() => {
                                    setShowAnalysis(false);
                                    setExerciseAnalysis(null);
                                    setRecordingTime(0);
                                  }}
                                  variant="outline"
                                >
                                  Nova Análise
                                </Button>
                                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600">
                                  Salvar Progresso
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Histórico de Análises */}
                        <div>
                          <h4 className="font-semibold mb-3">Histórico de Análises</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Agachamento</span>
                                <Badge className="bg-green-100 text-green-700">92%</Badge>
                              </div>
                              <p className="text-sm text-gray-600">Ontem • 3 séries</p>
                            </div>
                            
                            <div className="bg-white border rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-medium">Flexão</span>
                                <Badge className="bg-yellow-100 text-yellow-700">78%</Badge>
                              </div>
                              <p className="text-sm text-gray-600">2 dias atrás • 2 séries</p>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Exercises Tab */}
            {activeTab === 'exercises' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-500" />
                      Biblioteca de Exercícios
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Filtros */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={selectedCategory === 'todos' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory('todos')}
                        className="flex items-center gap-2"
                      >
                        <Filter className="w-4 h-4" />
                        Todos
                      </Button>
                      <Button
                        variant={selectedCategory === 'peito' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory('peito')}
                      >
                        💪 Peito
                      </Button>
                      <Button
                        variant={selectedCategory === 'costas' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory('costas')}
                      >
                        🏋️ Costas
                      </Button>
                      <Button
                        variant={selectedCategory === 'pernas' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory('pernas')}
                      >
                        🦵 Pernas
                      </Button>
                      <Button
                        variant={selectedCategory === 'bracos' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory('bracos')}
                      >
                        💪 Braços
                      </Button>
                      <Button
                        variant={selectedCategory === 'core' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setSelectedCategory('core')}
                      >
                        🎯 Core
                      </Button>
                    </div>

                    {/* Grid de Exercícios */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {getFilteredExercises().map((exercise) => (
                        <Card key={exercise.id} className="hover:shadow-lg transition-all cursor-pointer group">
                          <CardContent className="p-0">
                            {/* Thumbnail do Vídeo */}
                            <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
                              <iframe
                                src={exercise.videoUrl.replace('embed/', 'embed/').replace('watch?v=', 'embed/')}
                                title={exercise.name}
                                className="w-full h-full"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <PlayCircle className="w-6 h-6 text-blue-600" />
                                </div>
                              </div>
                            </div>

                            {/* Informações do Exercício */}
                            <div className="p-4 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{exercise.name}</h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{exercise.description}</p>
                              </div>

                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className={`${
                                  exercise.difficulty === 'Iniciante' ? 'bg-green-100 text-green-700' :
                                  exercise.difficulty === 'Intermediário' ? 'bg-yellow-100 text-yellow-700' :
                                  'bg-red-100 text-red-700'
                                }`}>
                                  {exercise.difficulty}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {exercise.duration}
                                </Badge>
                              </div>

                              <div className="flex items-center text-sm text-gray-600">
                                <Dumbbell className="w-4 h-4 mr-2" />
                                {exercise.equipment}
                              </div>

                              <div className="flex gap-2 pt-2">
                                <Button 
                                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                                  onClick={() => setSelectedExercise(exercise)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Detalhes
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {getFilteredExercises().length === 0 && (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum exercício encontrado</h3>
                        <p className="text-gray-500">Tente selecionar uma categoria diferente</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Health Tab */}
            {activeTab === 'health' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-red-500" />
                        Métricas de Saúde
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                          <div className="text-2xl font-bold text-red-600">{user.weight}kg</div>
                          <div className="text-sm text-gray-600">Peso</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{bmi}</div>
                          <div className="text-sm text-gray-600">IMC</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">22%</div>
                          <div className="text-sm text-gray-600">Gordura</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">46.5kg</div>
                          <div className="text-sm text-gray-600">Massa Magra</div>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-medium mb-3">Análise IA Preventiva</h4>
                        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                            <div>
                              <p className="text-sm text-green-800 font-medium">Status: Saudável</p>
                              <p className="text-sm text-green-700 mt-1">
                                Seus indicadores estão dentro dos parâmetros normais. Continue com o plano atual.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        Upload de Exames
                        {!hasFeature('medical-analysis') && (
                          <Badge className="bg-purple-100 text-purple-700 ml-2">
                            <Star className="w-3 h-3 mr-1" />
                            Pro
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {!hasFeature('medical-analysis') ? (
                        <div className="text-center space-y-3">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                            <Lock className="w-6 h-6 text-purple-500" />
                          </div>
                          <p className="text-sm text-gray-600">
                            Análise de exames disponível no plano Profissional
                          </p>
                          <Button 
                            size="sm"
                            onClick={() => setShowPlanModal(true)}
                            className="bg-gradient-to-r from-purple-500 to-pink-500"
                          >
                            Upgrade Pro
                          </Button>
                        </div>
                      ) : (
                        <>
                          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                            <div className="text-gray-500 mb-2">📄</div>
                            <p className="text-sm text-gray-600">
                              Arraste seus exames aqui ou clique para selecionar
                            </p>
                          </div>
                          
                          <Button variant="outline" className="w-full">
                            📊 Analisar com IA
                          </Button>
                          
                          <div className="text-xs text-gray-500">
                            Formatos aceitos: PDF, JPG, PNG
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Health Evolution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução das Métricas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={healthMetrics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <YAxis />
                        <Tooltip labelFormatter={(date) => new Date(date).toLocaleDateString()} />
                        <Line type="monotone" dataKey="weight" stroke="#ef4444" name="Peso (kg)" />
                        <Line type="monotone" dataKey="bodyFat" stroke="#f97316" name="Gordura (%)" />
                        <Line type="monotone" dataKey="muscleMass" stroke="#10b981" name="Massa Magra (kg)" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Achievements Tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement) => (
                    <Card key={achievement.id} className={`hover:shadow-lg transition-shadow ${
                      achievement.unlockedAt ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'
                    }`}>
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-3">{achievement.icon}</div>
                        <h3 className="font-bold text-lg mb-2">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <Badge variant={achievement.unlockedAt ? "default" : "secondary"}>
                            {achievement.points} pontos
                          </Badge>
                          {achievement.unlockedAt && (
                            <Badge className="bg-yellow-500 text-white">
                              Conquistado!
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Professionals Tab */}
            {activeTab === 'professionals' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-emerald-500" />
                      Consulte Profissionais de Saúde
                      <Badge className="bg-emerald-100 text-emerald-700 ml-2">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Pago
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Banner Informativo */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                            Conecte-se com Especialistas
                          </h3>
                          <p className="text-emerald-700 text-sm mb-3">
                            Agende consultas com nutricionistas, personal trainers, médicos e psicólogos especializados em saúde e bem-estar.
                          </p>
                          <div className="flex items-center gap-4 text-sm text-emerald-600">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Profissionais verificados
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Consultas online e presenciais
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Pagamento seguro
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filtros */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="default" size="sm">
                        Todos os Profissionais
                      </Button>
                      <Button variant="outline" size="sm">
                        🥗 Nutricionistas
                      </Button>
                      <Button variant="outline" size="sm">
                        💪 Personal Trainers
                      </Button>
                      <Button variant="outline" size="sm">
                        🩺 Médicos
                      </Button>
                      <Button variant="outline" size="sm">
                        🧠 Psicólogos
                      </Button>
                    </div>

                    {/* Grid de Profissionais */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {professionals.map((professional) => (
                        <Card key={professional.id} className="hover:shadow-lg transition-all cursor-pointer group">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                              <img 
                                src={professional.image} 
                                alt={professional.name}
                                className="w-16 h-16 rounded-full object-cover"
                              />
                              <div className="flex-1">
                                <h3 className="font-bold text-lg mb-1">{professional.name}</h3>
                                <p className="text-emerald-600 font-medium mb-2">{professional.specialty}</p>
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star 
                                        key={i} 
                                        className={`w-4 h-4 ${i < Math.floor(professional.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                      />
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-600">
                                    {professional.rating} ({professional.reviews} avaliações)
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 mb-3">{professional.description}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-emerald-600">R$ {professional.price}</div>
                                <div className="text-sm text-gray-600">por consulta</div>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                              <div>
                                <span className="text-gray-600">Experiência:</span>
                                <div className="font-medium">{professional.experience}</div>
                              </div>
                              <div>
                                <span className="text-gray-600">Disponibilidade:</span>
                                <div className="font-medium text-xs">{professional.availability}</div>
                              </div>
                            </div>

                            <div className="flex gap-2 mb-4">
                              {professional.consultationType.map((type, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {type}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex gap-2">
                              <Button 
                                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600"
                                onClick={() => setSelectedProfessional(professional)}
                              >
                                <Calendar className="w-4 h-4 mr-2" />
                                Agendar Consulta
                              </Button>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Seção de Benefícios */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Por que consultar um profissional?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Target className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Plano Personalizado</h4>
                              <p className="text-sm text-gray-600">Receba orientações específicas para seus objetivos e necessidades</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Acompanhamento Profissional</h4>
                              <p className="text-sm text-gray-600">Monitore seu progresso com orientação especializada</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <Heart className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Cuidado Integral</h4>
                              <p className="text-sm text-gray-600">Abordagem completa para sua saúde física e mental</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <Zap className="w-4 h-4 text-orange-600" />
                            </div>
                            <div>
                              <h4 className="font-medium">Resultados Mais Rápidos</h4>
                              <p className="text-sm text-gray-600">Alcance seus objetivos de forma mais eficiente</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Store Tab */}
            {activeTab === 'store' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-blue-500" />
                      Loja H-LIFE
                      <Badge className="bg-blue-100 text-blue-700 ml-2">
                        <Truck className="w-3 h-3 mr-1" />
                        Entrega Rápida
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Banner da Loja */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-blue-800 mb-2">
                            Produtos Selecionados para sua Saúde
                          </h3>
                          <p className="text-blue-700 text-sm mb-3">
                            Suplementos premium, marmitas fitness e alimentos saudáveis entregues na sua casa.
                          </p>
                          <div className="flex items-center gap-4 text-sm text-blue-600">
                            <div className="flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              Produtos verificados
                            </div>
                            <div className="flex items-center gap-1">
                              <Truck className="w-4 h-4" />
                              Entrega em 24h
                            </div>
                            <div className="flex items-center gap-1">
                              <CreditCard className="w-4 h-4" />
                              Pagamento seguro
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Filtros de Categoria */}
                    <div className="flex flex-wrap gap-2">
                      <Button variant="default" size="sm">
                        Todos os Produtos
                      </Button>
                      <Button variant="outline" size="sm">
                        💊 Suplementos
                      </Button>
                      <Button variant="outline" size="sm">
                        🍱 Marmitas Fit
                      </Button>
                      <Button variant="outline" size="sm">
                        🥗 Alimentação Saudável
                      </Button>
                    </div>

                    {/* Grid de Produtos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map((product) => (
                        <Card key={product.id} className="hover:shadow-lg transition-all cursor-pointer group">
                          <CardContent className="p-0">
                            {/* Imagem do Produto */}
                            <div className="relative aspect-square bg-gray-100 rounded-t-lg overflow-hidden">
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              {product.originalPrice && (
                                <div className="absolute top-2 left-2">
                                  <Badge className="bg-red-500 text-white">
                                    -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                  </Badge>
                                </div>
                              )}
                              {!product.inStock && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                  <Badge className="bg-red-500 text-white">Fora de Estoque</Badge>
                                </div>
                              )}
                            </div>

                            {/* Informações do Produto */}
                            <div className="p-4 space-y-3">
                              <div>
                                <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                                <p className="text-xs text-gray-500">{product.brand}</p>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-gray-600">
                                  {product.rating} ({product.reviews})
                                </span>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-xl font-bold text-blue-600">R$ {product.price.toFixed(2)}</span>
                                  {product.originalPrice && (
                                    <span className="text-sm text-gray-500 line-through ml-2">
                                      R$ {product.originalPrice.toFixed(2)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  {product.inStock ? (
                                    <>
                                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                      <span className="text-xs text-green-600">Em estoque</span>
                                    </>
                                  ) : (
                                    <>
                                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                      <span className="text-xs text-red-600">Indisponível</span>
                                    </>
                                  )}
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button 
                                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600"
                                  onClick={() => setSelectedProduct(product)}
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  Ver Detalhes
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    const existingItem = cartItems.find(item => item.id === product.id);
                                    if (existingItem) {
                                      setCartItems(cartItems.map(item => 
                                        item.id === product.id 
                                          ? { ...item, quantity: item.quantity + 1 }
                                          : item
                                      ));
                                    } else {
                                      setCartItems([...cartItems, { ...product, quantity: 1 }]);
                                    }
                                  }}
                                  disabled={!product.inStock}
                                >
                                  <ShoppingCart className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {/* Seção de Benefícios da Loja */}
                    <div className="bg-white border rounded-lg p-6">
                      <h3 className="text-lg font-semibold mb-4">Vantagens da Loja H-LIFE</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <h4 className="font-medium mb-2">Produtos Verificados</h4>
                          <p className="text-sm text-gray-600">Todos os produtos passam por rigoroso controle de qualidade</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Truck className="w-6 h-6 text-blue-600" />
                          </div>
                          <h4 className="font-medium mb-2">Entrega Rápida</h4>
                          <p className="text-sm text-gray-600">Receba seus produtos em até 24h na região metropolitana</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Heart className="w-6 h-6 text-purple-600" />
                          </div>
                          <h4 className="font-medium mb-2">Recomendações IA</h4>
                          <p className="text-sm text-gray-600">Produtos sugeridos baseados no seu perfil de saúde</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Chat Tab */}
            {activeTab === 'ai-chat' && (
              <div className="space-y-6">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-blue-500" />
                      IA Chat - Treinos, Dietas e Saúde
                      {!hasFeature('ai-chat') && (
                        <Badge className="bg-orange-100 text-orange-700 ml-2">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {!hasFeature('ai-chat') ? (
                      <div className="flex-1 flex items-center justify-center">
                        <UpgradePrompt 
                          feature="ai-chat" 
                          title="Chat com IA 24/7"
                        />
                      </div>
                    ) : (
                      <>
                        {/* Banner de Boas-vindas */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <MessageCircle className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-blue-800 mb-1">IA Especializada em Saúde</h3>
                              <p className="text-blue-700 text-sm mb-2">
                                Sua assistente pessoal para uma vida mais saudável! Posso ajudar com:
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-xs text-blue-600">
                                <div>• Montagem de treinos</div>
                                <div>• Criação de dietas</div>
                                <div>• Listas de compras</div>
                                <div>• Dúvidas sobre saúde</div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                          <div className="space-y-4">
                            {aiChatMessages.map((message) => (
                              <div key={message.id} className={`flex items-start gap-3 ${
                                message.role === 'user' ? 'justify-end' : ''
                              }`}>
                                {message.role === 'assistant' && (
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                    <img 
                                      src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/adb2cb61-ca85-4fd2-8d60-bbb7eabd9363.png" 
                                      alt="H-LIFE IA" 
                                      className="w-8 h-8 object-contain"
                                    />
                                  </div>
                                )}
                                <div className={`p-3 rounded-lg shadow-sm max-w-md ${
                                  message.role === 'user' 
                                    ? 'bg-emerald-500 text-white' 
                                    : 'bg-white'
                                }`}>
                                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                                </div>
                                {message.role === 'user' && (
                                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <User className="w-4 h-4 text-gray-600" />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Mic className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Video className="w-4 h-4" />
                          </Button>
                          <div className="flex-1">
                            <input 
                              type="text" 
                              value={chatMessage}
                              onChange={(e) => setChatMessage(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && sendAiMessage()}
                              placeholder="Ex: Crie minha dieta para emagrecimento..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                          </div>
                          <Button 
                            className="bg-gradient-to-r from-emerald-500 to-teal-600"
                            onClick={sendAiMessage}
                          >
                            <Send className="w-4 h-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Support Chat Tab */}
            {activeTab === 'support-chat' && (
              <div className="space-y-6">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Headphones className="w-5 h-5 text-green-500" />
                      Suporte Técnico - Equipe H-LIFE
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Banner de Boas-vindas */}
                    <div className="bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Headphones className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-green-800 mb-1">Suporte Técnico H-LIFE</h3>
                          <p className="text-green-700 text-sm mb-2">
                            Nossa equipe está aqui para ajudar! Fale conosco sobre:
                          </p>
                          <div className="grid grid-cols-2 gap-2 text-xs text-green-600">
                            <div>• Marmitas personalizadas</div>
                            <div>• Problemas no app</div>
                            <div>• Dúvidas sobre produtos</div>
                            <div>• Suporte geral</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
                      <div className="space-y-4">
                        {supportChatMessages.map((message) => (
                          <div key={message.id} className={`flex items-start gap-3 ${
                            message.role === 'user' ? 'justify-end' : ''
                          }`}>
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                <Headphones className="w-4 h-4 text-green-600" />
                              </div>
                            )}
                            <div className={`p-3 rounded-lg shadow-sm max-w-md ${
                              message.role === 'user' 
                                ? 'bg-green-500 text-white' 
                                : 'bg-white'
                            }`}>
                              <p className="text-sm whitespace-pre-line">{message.content}</p>
                            </div>
                            {message.role === 'user' && (
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Camera className="w-4 h-4" />
                      </Button>
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={supportChatMessage}
                          onChange={(e) => setSupportChatMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendSupportMessage()}
                          placeholder="Ex: Gostaria de marmitas personalizadas..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <Button 
                        className="bg-gradient-to-r from-green-500 to-teal-600"
                        onClick={sendSupportMessage}
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Planos */}
      {showPlanModal && <PlanModal />}
      
      {/* Modal de Exercício */}
      {selectedExercise && <ExerciseModal />}
      
      {/* Modal de Profissional */}
      {selectedProfessional && <ProfessionalModal />}
      
      {/* Modal de Produto */}
      {selectedProduct && <ProductModal />}
    </div>
  );
}
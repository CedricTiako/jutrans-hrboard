import React from 'react';
import { DashboardKPI } from '../../types/hr';
import { 
  Users, 
  Calendar, 
  Clock, 
  UserPlus, 
  UserX,
  Target,
  TrendingUp,
  Award,
  Shield,
  AlertTriangle,
  Star,
  DollarSign,
  Heart,
  Zap
} from 'lucide-react';

interface UnifiedStatsCardsProps {
  kpis: DashboardKPI;
  advancedStats?: {
    totalFiltered: number;
    totalOriginal: number;
    filterEfficiency: string;
    highRetirementRisk: number;
    highTurnoverRisk: number;
    lowPerformance: number;
    highPerformers: number;
    readyForPromotion: number;
    expertLevel: number;
    genderBalance: { male: number; female: number };
    avgInclusionScore: number;
    avgSalary: number;
    salaryRange: { min: number; max: number };
    avgRetentionProbability: number;
    successorsPipeline: number;
  };
  loading?: boolean;
  variant?: 'basic' | 'advanced' | 'complete';
}

const UnifiedStatsCards: React.FC<UnifiedStatsCardsProps> = ({ 
  kpis, 
  advancedStats, 
  loading = false, 
  variant = 'basic' 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        {Array.from({ length: variant === 'complete' ? 10 : variant === 'advanced' ? 7 : 5 }).map((_, i) => (
          <div key={i} className="card bg-base-100 shadow-lg animate-pulse">
            <div className="card-body p-4">
              <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-base-300 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-base-300 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentage = (value: number, total: number) => {
    return total > 0 ? ((value / total) * 100).toFixed(1) : '0';
  };

  const getGenderBalanceStatus = () => {
    const total = kpis.genderRatio.male + kpis.genderRatio.female;
    const femalePercentage = (kpis.genderRatio.female / total) * 100;
    
    if (femalePercentage >= 40 && femalePercentage <= 60) return { status: 'Équilibré', color: 'text-green-200' };
    if (femalePercentage >= 30 && femalePercentage <= 70) return { status: 'Acceptable', color: 'text-yellow-200' };
    return { status: 'Déséquilibré', color: 'text-red-200' };
  };

  const getPerformanceStatus = () => {
    if (kpis.performanceIndex >= 80) return { status: 'Excellent', color: 'text-green-200' };
    if (kpis.performanceIndex >= 70) return { status: 'Bon', color: 'text-blue-200' };
    if (kpis.performanceIndex >= 60) return { status: 'Satisfaisant', color: 'text-yellow-200' };
    return { status: 'À améliorer', color: 'text-red-200' };
  };

  const getRetentionStatus = () => {
    if (kpis.retentionRate >= 85) return { status: 'Excellent', color: 'text-green-200' };
    if (kpis.retentionRate >= 75) return { status: 'Bon', color: 'text-blue-200' };
    if (kpis.retentionRate >= 65) return { status: 'Moyen', color: 'text-yellow-200' };
    return { status: 'Faible', color: 'text-red-200' };
  };

  const genderBalance = getGenderBalanceStatus();
  const performanceStatus = getPerformanceStatus();
  const retentionStatus = getRetentionStatus();

  // Configuration des cartes selon le variant
  const getCardsConfig = () => {
    const basicCards = [
      {
        title: 'Effectif Total',
        value: kpis.totalEmployees,
        subtitle: 'Employés actifs',
        icon: <Users className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
      },
      {
        title: 'Âge Moyen',
        value: `${kpis.avgAge} ans`,
        subtitle: 'Moyenne d\'âge',
        icon: <Calendar className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-green-500 to-emerald-500',
      },
      {
        title: 'Ancienneté Moyenne',
        value: `${kpis.avgTenure} ans`,
        subtitle: 'Expérience moyenne',
        icon: <Clock className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-purple-500 to-indigo-500',
      },
      {
        title: 'Nouvelles Recrues',
        value: kpis.newHires,
        subtitle: `${((kpis.newHires / kpis.totalEmployees) * 100).toFixed(1)}% de l'effectif`,
        icon: <UserPlus className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      },
      {
        title: 'Proche Retraite',
        value: kpis.nearRetirement,
        subtitle: `${((kpis.nearRetirement / kpis.totalEmployees) * 100).toFixed(1)}% de l'effectif`,
        icon: <UserX className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-orange-500 to-red-500',
      }
    ];

    const advancedCards = [
      ...basicCards,
      {
        title: 'Équilibre H/F',
        value: `${kpis.genderRatio.male}H/${kpis.genderRatio.female}F`,
        subtitle: genderBalance.status,
        icon: <Target className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-pink-500 to-rose-500',
        statusColor: genderBalance.color,
      },
      {
        title: 'Performance Globale',
        value: `${kpis.performanceIndex}%`,
        subtitle: performanceStatus.status,
        icon: <Award className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-emerald-500 to-green-500',
        statusColor: performanceStatus.color,
      }
    ];

    const completeCards = [
      ...advancedCards,
      {
        title: 'Indice Diversité',
        value: `${kpis.diversityIndex}%`,
        subtitle: 'Score de diversité',
        icon: <TrendingUp className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      },
      {
        title: 'Taux de Rétention',
        value: `${kpis.retentionRate}%`,
        subtitle: retentionStatus.status,
        icon: <Shield className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-teal-500 to-cyan-500',
        statusColor: retentionStatus.color,
      }
    ];

    // Ajouter les cartes avancées si disponibles
    if (variant === 'complete' && advancedStats) {
      completeCards.push({
        title: 'Hauts Performeurs',
        value: advancedStats.highPerformers,
        subtitle: `${getPercentage(advancedStats.highPerformers, advancedStats.totalFiltered)}% excellent/bon`,
        icon: <Star className="w-6 h-6" />,
        gradient: 'bg-gradient-to-br from-amber-500 to-yellow-500',
      });
    }

    switch (variant) {
      case 'basic': return basicCards;
      case 'advanced': return advancedCards;
      case 'complete': return completeCards;
      default: return basicCards;
    }
  };

  const cards = getCardsConfig();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`card shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${card.gradient}`}
        >
          <div className="card-body p-4 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium opacity-90 mb-1">
                  {card.title}
                </h3>
                <div className="text-2xl font-bold mb-1">
                  {card.value}
                </div>
                <p className={`text-xs leading-tight ${card.statusColor || 'opacity-75'}`}>
                  {card.subtitle}
                </p>
              </div>
              <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                {card.icon}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UnifiedStatsCards;
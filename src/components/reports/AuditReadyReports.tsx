import React, { useState } from 'react';
import { Employee, DashboardKPI, HRInsight } from '../../types/hr';
import { 
  FileText, 
  Download, 
  Printer, 
  Share2, 
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Users,
  Shield,
  Award,
  Calendar,
  Target,
  TrendingUp,
  Clock,
  Truck
} from 'lucide-react';

interface AuditReadyReportsProps {
  employees: Employee[];
  kpis: DashboardKPI;
  insights: HRInsight[];
  year: number;
  loading?: boolean;
}

const AuditReadyReports: React.FC<AuditReadyReportsProps> = ({ 
  employees, 
  kpis, 
  insights, 
  year, 
  loading = false 
}) => {
  const [selectedReport, setSelectedReport] = useState<'compliance' | 'performance' | 'risks' | 'strategic'>('compliance');

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body animate-pulse">
          <div className="h-8 bg-base-300 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 bg-base-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const generateComplianceReport = () => {
    const totalEmployees = employees.length;
    const genderBalance = (kpis.genderRatio.female / (kpis.genderRatio.male + kpis.genderRatio.female)) * 100;
    const avgAge = kpis.avgAge;
    const avgTenure = kpis.avgTenure;
    
    return {
      title: 'Rapport de Conformité RH - JUTRANS SARL',
      sections: [
        {
          title: 'Conformité Légale',
          items: [
            { label: 'Égalité professionnelle H/F', value: genderBalance >= 40 && genderBalance <= 60 ? 'Conforme' : 'À surveiller', status: genderBalance >= 40 && genderBalance <= 60 ? 'success' : 'warning' },
            { label: 'Index égalité professionnelle', value: '85/100', status: 'success' },
            { label: 'Formation obligatoire', value: '98% complété', status: 'success' },
            { label: 'Entretiens annuels', value: '100% réalisés', status: 'success' },
          ]
        },
        {
          title: 'Indicateurs Démographiques',
          items: [
            { label: 'Effectif total', value: totalEmployees.toString(), status: 'info' },
            { label: 'Âge moyen', value: `${avgAge} ans`, status: 'info' },
            { label: 'Ancienneté moyenne', value: `${avgTenure} ans`, status: 'info' },
            { label: 'Taux de féminisation', value: `${genderBalance.toFixed(1)}%`, status: 'info' },
          ]
        },
        {
          title: 'Obligations Sociales',
          items: [
            { label: 'Déclaration sociale nominative', value: 'À jour', status: 'success' },
            { label: 'Bilan social', value: 'Complété', status: 'success' },
            { label: 'BDES (Base de données)', value: 'Mise à jour', status: 'success' },
            { label: 'Accord égalité professionnelle', value: 'Signé', status: 'success' },
          ]
        }
      ]
    };
  };

  const generatePerformanceReport = () => {
    return {
      title: 'Rapport de Performance RH - JUTRANS SARL',
      sections: [
        {
          title: 'Indicateurs de Performance',
          items: [
            { label: 'Performance globale', value: `${kpis.performanceIndex}%`, status: kpis.performanceIndex >= 75 ? 'success' : 'warning' },
            { label: 'Taux de rétention', value: `${kpis.retentionRate}%`, status: kpis.retentionRate >= 80 ? 'success' : 'warning' },
            { label: 'Satisfaction employés', value: '4.2/5', status: 'success' },
            { label: 'Productivité transport', value: '+12% vs N-1', status: 'success' },
          ]
        },
        {
          title: 'Développement des Talents',
          items: [
            { label: 'Formations dispensées', value: '156 heures/employé', status: 'success' },
            { label: 'Promotions internes', value: '23% des postes', status: 'success' },
            { label: 'Mobilité interne', value: '15% des employés', status: 'info' },
            { label: 'Plans de succession', value: '78% couverts', status: 'warning' },
          ]
        },
        {
          title: 'Innovation RH',
          items: [
            { label: 'Digitalisation processus', value: '85% complété', status: 'success' },
            { label: 'Télétravail', value: '60% éligibles', status: 'info' },
            { label: 'Bien-être au travail', value: 'Programme actif', status: 'success' },
            { label: 'Marque employeur transport', value: 'Score 8.5/10', status: 'success' },
          ]
        }
      ]
    };
  };

  const generateRiskReport = () => {
    const criticalInsights = insights.filter(i => i.priority === 'critical').length;
    const highInsights = insights.filter(i => i.priority === 'high').length;
    
    return {
      title: 'Rapport d\'Analyse des Risques RH - JUTRANS SARL',
      sections: [
        {
          title: 'Risques Critiques',
          items: [
            { label: 'Alertes critiques', value: criticalInsights.toString(), status: criticalInsights > 0 ? 'error' : 'success' },
            { label: 'Risque de départ retraite', value: `${kpis.nearRetirement} employés`, status: kpis.nearRetirement > 5 ? 'warning' : 'info' },
            { label: 'Postes à risque unique', value: '3 identifiés', status: 'warning' },
            { label: 'Transfert connaissances', value: '67% planifié', status: 'warning' },
          ]
        },
        {
          title: 'Risques Opérationnels Transport',
          items: [
            { label: 'Turnover chauffeurs', value: '8.5%', status: 'info' },
            { label: 'Absentéisme', value: '3.2%', status: 'success' },
            { label: 'Accidents du travail', value: '0.8%', status: 'success' },
            { label: 'Conflits sociaux', value: 'Aucun', status: 'success' },
          ]
        },
        {
          title: 'Mitigation des Risques',
          items: [
            { label: 'Plans de continuité', value: '12 activés', status: 'info' },
            { label: 'Assurance responsabilité', value: 'Couverte', status: 'success' },
            { label: 'Procédures d\'urgence', value: 'Testées', status: 'success' },
            { label: 'Veille réglementaire transport', value: 'Active', status: 'success' },
          ]
        }
      ]
    };
  };

  const generateStrategicReport = () => {
    return {
      title: 'Rapport Stratégique RH - JUTRANS SARL',
      sections: [
        {
          title: 'Vision Stratégique Transport',
          items: [
            { label: 'Alignement stratégie entreprise', value: '92%', status: 'success' },
            { label: 'Objectifs RH atteints', value: '87%', status: 'success' },
            { label: 'Transformation digitale', value: 'En cours', status: 'info' },
            { label: 'Culture d\'entreprise transport', value: 'Renforcée', status: 'success' },
          ]
        },
        {
          title: 'Investissements RH',
          items: [
            { label: 'Budget formation', value: '2.8% masse salariale', status: 'success' },
            { label: 'ROI formations', value: '+180%', status: 'success' },
            { label: 'Coût du recrutement', value: '15% optimisé', status: 'success' },
            { label: 'Investissement technologique', value: '€125k', status: 'info' },
          ]
        },
        {
          title: 'Perspectives d\'Évolution',
          items: [
            { label: 'Croissance prévue', value: '+8% effectifs', status: 'info' },
            { label: 'Nouveaux métiers transport', value: '5 identifiés', status: 'info' },
            { label: 'Compétences futures', value: 'Cartographiées', status: 'success' },
            { label: 'Plan de succession', value: '2025-2027', status: 'info' },
          ]
        }
      ]
    };
  };

  const reports = {
    compliance: generateComplianceReport(),
    performance: generatePerformanceReport(),
    risks: generateRiskReport(),
    strategic: generateStrategicReport()
  };

  const currentReport = reports[selectedReport];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      case 'info': return 'text-info';
      default: return 'text-base-content';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'error': return <AlertTriangle className="w-4 h-4 text-error" />;
      case 'info': return <BarChart3 className="w-4 h-4 text-info" />;
      default: return null;
    }
  };

  const reportTypes = [
    { id: 'compliance', label: 'Conformité', icon: <Shield className="w-4 h-4" /> },
    { id: 'performance', label: 'Performance', icon: <Award className="w-4 h-4" /> },
    { id: 'risks', label: 'Risques', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'strategic', label: 'Stratégique', icon: <Target className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête des rapports d'audit JUTRANS */}
      <div className="card bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-xl">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Truck className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">JUTRANS SARL</h2>
                <h3 className="text-xl">Rapports d'Audit RH</h3>
                <p className="opacity-90">Documentation complète pour audits et contrôles</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-sm btn-outline btn-white gap-2">
                <Download className="w-4 h-4" />
                PDF
              </button>
              <button className="btn btn-sm btn-outline btn-white gap-2">
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              <button className="btn btn-sm btn-outline btn-white gap-2">
                <Share2 className="w-4 h-4" />
                Partager
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sélecteur de type de rapport */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-6">
          <h3 className="card-title mb-4">Type de Rapport</h3>
          <div className="tabs tabs-boxed bg-base-200 p-1">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedReport(type.id as any)}
                className={`tab gap-2 ${selectedReport === type.id ? 'tab-active' : ''}`}
              >
                {type.icon}
                {type.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Contenu du rapport */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-8">
          {/* En-tête du rapport */}
          <div className="border-b border-base-300 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Truck className="w-8 h-8 text-blue-600" />
                  <div>
                    <h1 className="text-2xl font-bold text-blue-800">JUTRANS SARL</h1>
                    <p className="text-sm text-blue-600">Solutions Transport & Logistique</p>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-base-content mb-2">
                  {currentReport.title}
                </h2>
                <div className="flex items-center gap-4 text-sm text-base-content/70">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Période: Année {year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Généré le: {new Date().toLocaleDateString('fr-FR')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Effectif: {employees.length} employés
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="badge badge-primary badge-lg">CONFIDENTIEL</div>
                <p className="text-xs text-base-content/60 mt-1">Document d'audit officiel</p>
                <p className="text-xs text-blue-600 mt-1">JUTRANS SARL</p>
              </div>
            </div>
          </div>

          {/* Sections du rapport */}
          <div className="space-y-8">
            {currentReport.sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                <h2 className="text-xl font-semibold text-base-content mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  {section.title}
                </h2>
                <div className="overflow-x-auto">
                  <table className="table table-zebra w-full">
                    <thead>
                      <tr>
                        <th className="text-left">Indicateur</th>
                        <th className="text-center">Valeur</th>
                        <th className="text-center">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {section.items.map((item, itemIndex) => (
                        <tr key={itemIndex}>
                          <td className="font-medium">{item.label}</td>
                          <td className="text-center font-mono">{item.value}</td>
                          <td className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              {getStatusIcon(item.status)}
                              <span className={`font-medium ${getStatusColor(item.status)}`}>
                                {item.status === 'success' ? 'Conforme' :
                                 item.status === 'warning' ? 'Attention' :
                                 item.status === 'error' ? 'Non conforme' : 'Information'}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>

          {/* Synthèse et recommandations */}
          <div className="mt-8 pt-6 border-t border-base-300">
            <h2 className="text-xl font-semibold text-base-content mb-4">Synthèse et Recommandations</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card bg-success/10 border border-success/20">
                <div className="card-body p-4">
                  <h3 className="font-semibold text-success mb-2">Points Forts JUTRANS</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Conformité réglementaire transport maintenue</li>
                    <li>• Performance RH au-dessus des standards secteur</li>
                    <li>• Processus de qualité certifiés</li>
                    <li>• Indicateurs sociaux positifs</li>
                    <li>• Culture d'entreprise transport forte</li>
                  </ul>
                </div>
              </div>
              <div className="card bg-warning/10 border border-warning/20">
                <div className="card-body p-4">
                  <h3 className="font-semibold text-warning mb-2">Points d'Amélioration</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Renforcer la planification de succession</li>
                    <li>• Améliorer la diversité des équipes</li>
                    <li>• Optimiser les processus de formation</li>
                    <li>• Développer l'engagement employé</li>
                    <li>• Anticiper les besoins métiers transport</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Signature et validation */}
          <div className="mt-8 pt-6 border-t border-base-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="font-medium">Préparé par:</p>
                <p className="text-sm text-base-content/70">Direction des Ressources Humaines</p>
                <p className="text-sm text-blue-600">JUTRANS SARL</p>
                <div className="mt-4 h-16 border-b border-base-300"></div>
                <p className="text-xs text-base-content/60 mt-1">Signature</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Validé par:</p>
                <p className="text-sm text-base-content/70">Direction Générale</p>
                <p className="text-sm text-blue-600">JUTRANS SARL</p>
                <div className="mt-4 h-16 border-b border-base-300"></div>
                <p className="text-xs text-base-content/60 mt-1">Signature</p>
              </div>
              <div className="text-center">
                <p className="font-medium">Approuvé par:</p>
                <p className="text-sm text-base-content/70">Conseil d'Administration</p>
                <p className="text-sm text-blue-600">JUTRANS SARL</p>
                <div className="mt-4 h-16 border-b border-base-300"></div>
                <p className="text-xs text-base-content/60 mt-1">Signature</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuditReadyReports;
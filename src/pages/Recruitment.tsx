import React from 'react';
import { useSupabaseAppContext } from '../context/SupabaseAppContext';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';

const Recruitment: React.FC = () => {
  const { year, employees, hiringsByYear } = useSupabaseAppContext();
  
  // Calculate number of new hires in the selected year
  const newHires = employees.filter(emp => emp.ANNEE_EMBAUCHE === year).length;
  
  // Calculate renewal rate (new hires / total employees)
  const renewalRate = employees.length > 0 ? Math.round((newHires / employees.length) * 100) : 0;
  
  // Prepare hiring trend data
  const hiringTrendData = {
    labels: Object.keys(hiringsByYear).map(year => year),
    datasets: [
      {
        label: 'New Hires',
        data: Object.values(hiringsByYear),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };
  
  // Get hiring by position
  const hiringsByPosition: Record<string, number> = {};
  employees
    .filter(emp => emp.ANNEE_EMBAUCHE === year)
    .forEach(emp => {
      if (hiringsByPosition[emp.POSTE]) {
        hiringsByPosition[emp.POSTE]++;
      } else {
        hiringsByPosition[emp.POSTE] = 1;
      }
    });
  
  // Sort positions by hiring count
  const positions = Object.keys(hiringsByPosition);
  const hireCounts = positions.map(pos => hiringsByPosition[pos]);
  
  const hiringsByPositionData = {
    labels: positions,
    datasets: [
      {
        label: 'New Hires',
        data: hireCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
    ],
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recruitment Analysis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analysis of hiring patterns and recruitment metrics for {year}
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">New Hires</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{newHires}</p>
          <p className="mt-1 text-sm text-gray-500">Employees hired in {year}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Renewal Rate</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{renewalRate}%</p>
          <p className="mt-1 text-sm text-gray-500">New hires as % of total workforce</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Positions Filled</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{positions.length}</p>
          <p className="mt-1 text-sm text-gray-500">Different positions hired for</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Hiring Trend */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Hiring Trend</h2>
          <LineChart data={hiringTrendData} height={250} />
        </div>
        
        {/* Hiring by Position */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Hiring by Position</h2>
          <BarChart data={hiringsByPositionData} vertical={false} height={250} />
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Recruitment Insights</h2>
        <div className="space-y-3 text-gray-600">
          <p>
            In {year}, the organization hired {newHires} new employees, representing a {renewalRate}% renewal rate of the workforce.
          </p>
          {positions.length > 0 ? (
            <>
              <p>
                The most actively recruited position was {positions[hireCounts.indexOf(Math.max(...hireCounts))]},
                with {Math.max(...hireCounts)} new hires.
              </p>
              <p>
                Recruitment was spread across {positions.length} different positions, indicating 
                {positions.length > 3 ? ' a diverse hiring strategy' : ' a focused hiring approach'}.
              </p>
            </>
          ) : (
            <p>There were no new hires recorded for {year}.</p>
          )}
          <p>
            {hiringsByYear[year] > hiringsByYear[year - 1] 
              ? `Hiring increased compared to the previous year (${hiringsByYear[year - 1] || 0} hires).` 
              : hiringsByYear[year] < hiringsByYear[year - 1]
                ? `Hiring decreased compared to the previous year (${hiringsByYear[year - 1] || 0} hires).`
                : `Hiring remained stable compared to the previous year (${hiringsByYear[year - 1] || 0} hires).`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Recruitment;
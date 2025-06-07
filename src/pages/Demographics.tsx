import React from 'react';
import { useSupabaseAppContext } from '../context/SupabaseAppContext';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import PyramidChart from '../components/charts/PyramidChart';

const Demographics: React.FC = () => {
  const { year, genderDistribution, ageDistribution, employees } = useSupabaseAppContext();
  
  // Prepare gender distribution data for the pie chart
  const genderData = {
    labels: ['Male', 'Female'],
    datasets: [
      {
        label: 'Gender Distribution',
        data: [genderDistribution.male, genderDistribution.female],
        backgroundColor: ['rgba(54, 162, 235, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        borderColor: ['rgba(54, 162, 235, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 1,
      },
    ],
  };
  
  // Prepare age distribution data for the bar chart
  const ageGroups = Object.keys(ageDistribution);
  const ageCounts = ageGroups.map(group => ageDistribution[group]);
  
  const ageData = {
    labels: ageGroups,
    datasets: [
      {
        label: 'Number of Employees',
        data: ageCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
    ],
  };
  
  // Prepare data for the age pyramid
  const maleByAge = ageGroups.map(group => 
    employees.filter(emp => emp.SEXE === 'M' && emp.TRANCHE_AGE === group).length
  );
  
  const femaleByAge = ageGroups.map(group => 
    employees.filter(emp => emp.SEXE === 'F' && emp.TRANCHE_AGE === group).length
  );
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Demographic Analysis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analysis of employee demographics for {year}
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Gender Distribution */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h2>
          <PieChart data={genderData} height={250} />
          <div className="mt-4 text-sm text-gray-600">
            <p>The organization has {genderDistribution.male} male employees ({Math.round((genderDistribution.male / (genderDistribution.male + genderDistribution.female)) * 100)}%) and {genderDistribution.female} female employees ({Math.round((genderDistribution.female / (genderDistribution.male + genderDistribution.female)) * 100)}%).</p>
          </div>
        </div>
        
        {/* Age Distribution */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Age Distribution</h2>
          <BarChart data={ageData} height={250} />
          <div className="mt-4 text-sm text-gray-600">
            <p>Most employees fall in the {ageGroups[ageCounts.indexOf(Math.max(...ageCounts))]} age range, with {Math.max(...ageCounts)} employees.</p>
          </div>
        </div>
      </div>
      
      {/* Age Pyramid */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Age Pyramid by Gender</h2>
        <PyramidChart 
          maleData={maleByAge} 
          femaleData={femaleByAge} 
          labels={ageGroups} 
          height={400} 
        />
        <div className="mt-4 text-sm text-gray-600">
          <p>The age pyramid visualizes the distribution of employees by age group and gender. Male employees are shown on the left side, and female employees on the right side.</p>
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Demographic Insights</h2>
        <div className="space-y-3 text-gray-600">
          <p>
            The demographic analysis for {year} reveals a workforce predominantly composed of male employees 
            ({Math.round((genderDistribution.male / (genderDistribution.male + genderDistribution.female)) * 100)}% of the total workforce).
          </p>
          <p>
            The age distribution indicates that the majority of employees are in the {ageGroups[ageCounts.indexOf(Math.max(...ageCounts))]} age range,
            suggesting a {ageCounts.indexOf(Math.max(...ageCounts)) < 3 ? 'relatively young' : 'mature'} workforce.
          </p>
          <p>
            There {femaleByAge.reduce((a, b) => a + b, 0) < 10 ? 'is a significant gender imbalance' : 'are some gender imbalances'} across age groups,
            with female representation being particularly {femaleByAge.reduce((a, b) => a + b, 0) < maleByAge.reduce((a, b) => a + b, 0) / 4 ? 'low' : 'moderate'}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Demographics;
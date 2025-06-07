import React from 'react';
import { useSupabaseAppContext } from '../context/SupabaseAppContext';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';

const Tenure: React.FC = () => {
  const { year, tenureDistribution, dashboardStats, employees } = useSupabaseAppContext();
  
  // Prepare tenure distribution data for the bar chart
  const tenureGroups = Object.keys(tenureDistribution);
  const tenureCounts = tenureGroups.map(group => tenureDistribution[group]);
  
  const tenureData = {
    labels: tenureGroups,
    datasets: [
      {
        label: 'Number of Employees',
        data: tenureCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.7)',
      },
    ],
  };
  
  // Calculate tenure percentages for the pie chart
  const totalEmployees = employees.length;
  const tenurePercentages = tenureGroups.map(group => ({
    group,
    percentage: totalEmployees > 0 ? Math.round((tenureDistribution[group] / totalEmployees) * 100) : 0
  }));
  
  const tenurePieData = {
    labels: tenureGroups,
    datasets: [
      {
        label: 'Tenure Distribution',
        data: tenureCounts,
        backgroundColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate long-term employees (>10 years)
  const longTermEmployees = employees.filter(emp => emp.ANCIENNETE > 10).length;
  const longTermPercentage = totalEmployees > 0 ? Math.round((longTermEmployees / totalEmployees) * 100) : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tenure Analysis</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analysis of employee tenure and seniority for {year}
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Average Tenure</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{dashboardStats.avgTenure} years</p>
          <p className="mt-1 text-sm text-gray-500">Average time employees have been with the company</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">New Employees</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{tenureDistribution['0 - 5']} employees</p>
          <p className="mt-1 text-sm text-gray-500">Employees with less than 5 years of tenure</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Long-term Employees</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{longTermEmployees} employees ({longTermPercentage}%)</p>
          <p className="mt-1 text-sm text-gray-500">Employees with more than 10 years of tenure</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Tenure Distribution Bar Chart */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tenure Distribution</h2>
          <BarChart data={tenureData} height={250} />
        </div>
        
        {/* Tenure Distribution Pie Chart */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Tenure Distribution (%)</h2>
          <PieChart data={tenurePieData} height={250} />
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Tenure Insights</h2>
        <div className="space-y-3 text-gray-600">
          <p>
            The tenure analysis for {year} shows an average tenure of {dashboardStats.avgTenure} years across all employees.
          </p>
          <p>
            {tenurePercentages[0]?.percentage || 0}% of employees have been with the company for less than 5 years,
            while {tenurePercentages.slice(2).reduce((sum, item) => sum + item.percentage, 0)}% have been with the company for more than 10 years.
          </p>
          <p>
            The most common tenure range is {tenureGroups[tenureCounts.indexOf(Math.max(...tenureCounts))]},
            representing {Math.max(...tenureCounts)} employees ({totalEmployees > 0 ? Math.round((Math.max(...tenureCounts) / totalEmployees) * 100) : 0}% of the workforce).
          </p>
          <p>
            {longTermPercentage > 30 
              ? 'This suggests a stable workforce with high retention rates.' 
              : longTermPercentage > 15 
                ? 'This suggests a balanced mix of experienced and newer employees.' 
                : 'This suggests a relatively new workforce or potential retention challenges.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Tenure;
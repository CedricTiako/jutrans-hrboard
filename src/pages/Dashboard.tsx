import React from 'react';
import { Users, Clock, UserPlus, BarChart as BarChartIcon } from 'lucide-react';
import StatCard from '../components/StatCard';
import PieChart from '../components/charts/PieChart';
import BarChart from '../components/charts/BarChart';
import { useYearContext } from '../context/YearContext';
import { 
  getEmployeesByYear, 
  getGenderDistribution, 
  getAverageAge, 
  getAverageTenure, 
  getPositionDistribution 
} from '../data/employeeData';

const Dashboard: React.FC = () => {
  const { selectedYear } = useYearContext();
  
  // Get data for the selected year
  const employees = getEmployeesByYear(selectedYear);
  const genderDistribution = getGenderDistribution(selectedYear);
  const positionDistribution = getPositionDistribution(selectedYear);
  const avgAge = getAverageAge(selectedYear);
  const avgTenure = getAverageTenure(selectedYear);
  
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
  
  // Prepare position distribution data for the bar chart
  const positions = Object.keys(positionDistribution).sort();
  const positionCounts = positions.map(pos => positionDistribution[pos]);
  
  const positionData = {
    labels: positions,
    datasets: [
      {
        label: 'Number of Employees',
        data: positionCounts,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
      },
    ],
  };
  
  // Calculate gender ratio as a percentage
  const totalEmployees = employees.length;
  const malePercentage = Math.round((genderDistribution.male / totalEmployees) * 100);
  const femalePercentage = Math.round((genderDistribution.female / totalEmployees) * 100);
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">HR Dashboard Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Key metrics and statistics for {selectedYear}
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Employees" 
          value={totalEmployees} 
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
        <StatCard 
          title="Average Age" 
          value={`${avgAge} years`} 
          icon={<BarChartIcon className="w-5 h-5 text-blue-600" />}
        />
        <StatCard 
          title="Average Tenure" 
          value={`${avgTenure} years`} 
          icon={<Clock className="w-5 h-5 text-blue-600" />}
        />
        <StatCard 
          title="Gender Ratio" 
          value={`${malePercentage}% Male / ${femalePercentage}% Female`} 
          icon={<Users className="w-5 h-5 text-blue-600" />}
        />
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution</h2>
          <PieChart data={genderData} height={250} />
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Position Distribution</h2>
          <BarChart data={positionData} vertical={false} height={250} />
        </div>
      </div>
      
      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Summary</h2>
        <p className="text-gray-600">
          In {selectedYear}, the organization has {totalEmployees} employees with an average age of {avgAge} years
          and an average tenure of {avgTenure} years. The workforce is composed of {malePercentage}% male and {femalePercentage}% female employees.
          The most common position is {positions[positionCounts.indexOf(Math.max(...positionCounts))]} with {Math.max(...positionCounts)} employees.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
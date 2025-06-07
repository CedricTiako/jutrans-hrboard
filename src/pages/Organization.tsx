import React from 'react';
import { useSupabaseAppContext } from '../context/SupabaseAppContext';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';

const Organization: React.FC = () => {
  const { year, positionDistribution, employees } = useSupabaseAppContext();
  
  // Prepare position distribution data for the bar chart
  const positions = positionDistribution.map(pos => pos.name);
  const positionCounts = positionDistribution.map(pos => pos.count);
  
  const positionData = {
    labels: positions,
    datasets: [
      {
        label: 'Number of Employees',
        data: positionCounts,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
    ],
  };
  
  // Categorize positions into management, support, and operations
  const categorizePosition = (position: string): string => {
    const positionLower = position.toLowerCase();
    if (positionLower.includes('directeur') || positionLower.includes('resp') || positionLower.includes('admin')) {
      return 'Management';
    } else if (positionLower.includes('chauffeur') || positionLower.includes('motor')) {
      return 'Operations';
    } else {
      return 'Support';
    }
  };
  
  const categories = {
    'Management': 0,
    'Operations': 0,
    'Support': 0
  };
  
  employees.forEach(emp => {
    const category = categorizePosition(emp.POSTE);
    categories[category]++;
  });
  
  const categoryData = {
    labels: Object.keys(categories),
    datasets: [
      {
        label: 'Department Distribution',
        data: Object.values(categories),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };
  
  // Calculate staff-to-management ratio
  const managementCount = categories['Management'];
  const staffCount = categories['Operations'] + categories['Support'];
  const staffToManagementRatio = managementCount > 0 ? Math.round((staffCount / managementCount) * 10) / 10 : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Organizational Structure</h1>
        <p className="mt-1 text-sm text-gray-500">
          Analysis of employee positions and organizational structure for {year}
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Total Positions</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{positions.length}</p>
          <p className="mt-1 text-sm text-gray-500">Unique job positions</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Management Staff</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{managementCount}</p>
          <p className="mt-1 text-sm text-gray-500">Employees in management roles</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Operations Staff</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{categories['Operations']}</p>
          <p className="mt-1 text-sm text-gray-500">Employees in operations roles</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Staff-to-Management</h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">{staffToManagementRatio}:1</p>
          <p className="mt-1 text-sm text-gray-500">Ratio of staff to management</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Position Distribution */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Position Distribution</h2>
          <BarChart data={positionData} vertical={false} height={400} />
        </div>
        
        {/* Department Distribution */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Department Distribution</h2>
          <PieChart data={categoryData} height={250} />
          <div className="mt-4 text-sm text-gray-600">
            <ul className="list-disc list-inside">
              <li>Management: {categories['Management']} employees ({Math.round((categories['Management'] / employees.length) * 100)}%)</li>
              <li>Operations: {categories['Operations']} employees ({Math.round((categories['Operations'] / employees.length) * 100)}%)</li>
              <li>Support: {categories['Support']} employees ({Math.round((categories['Support'] / employees.length) * 100)}%)</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Top Positions */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Top Positions by Headcount</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {positionDistribution.slice(0, 5).map((position, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{position.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{position.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {Math.round((position.count / employees.length) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Organization;
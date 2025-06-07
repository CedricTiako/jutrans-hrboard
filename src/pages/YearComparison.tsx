import React from 'react';
import { useSupabaseAppContext } from '../context/SupabaseAppContext';
import LineChart from '../components/charts/LineChart';
import BarChart from '../components/charts/BarChart';

const YearComparison: React.FC = () => {
  const { yearOverYearData } = useSupabaseAppContext();
  
  const {
    years,
    headcount,
    avgAge,
    avgTenure,
    newHires,
    maleHeadcount,
    femaleHeadcount
  } = yearOverYearData;
  
  // Prepare headcount data for chart
  const headcountData = {
    labels: years.map(String),
    datasets: [
      {
        label: 'Total Employees',
        data: headcount,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
      },
    ],
  };
  
  // Prepare age and tenure data for chart
  const ageAndTenureData = {
    labels: years.map(String),
    datasets: [
      {
        label: 'Average Age',
        data: avgAge,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4,
      },
      {
        label: 'Average Tenure',
        data: avgTenure,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4,
      },
    ],
  };
  
  // Prepare new hires data for chart
  const newHiresData = {
    labels: years.map(String),
    datasets: [
      {
        label: 'New Hires',
        data: newHires,
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
      },
    ],
  };
  
  // Prepare gender distribution data
  const genderData = {
    labels: years.map(String),
    datasets: [
      {
        label: 'Male',
        data: maleHeadcount,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
      },
      {
        label: 'Female',
        data: femaleHeadcount,
        backgroundColor: 'rgba(255, 99, 132, 0.7)',
      },
    ],
  };
  
  // Calculate year-over-year changes
  const headcountChange = headcount.length > 1 
    ? Math.round(((headcount[headcount.length - 1] - headcount[headcount.length - 2]) / headcount[headcount.length - 2]) * 100) 
    : 0;
  
  const avgAgeChange = avgAge.length > 1 
    ? Math.round(((avgAge[avgAge.length - 1] - avgAge[avgAge.length - 2]) / avgAge[avgAge.length - 2]) * 100 * 10) / 10 
    : 0;
  
  const avgTenureChange = avgTenure.length > 1 
    ? Math.round(((avgTenure[avgTenure.length - 1] - avgTenure[avgTenure.length - 2]) / avgTenure[avgTenure.length - 2]) * 100 * 10) / 10 
    : 0;
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Year-over-Year Comparison</h1>
        <p className="mt-1 text-sm text-gray-500">
          Comparison of key metrics across years (2023-2025)
        </p>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Headcount Change</h3>
          <p className={`mt-2 text-3xl font-bold ${headcountChange > 0 ? 'text-green-600' : headcountChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {headcountChange > 0 ? '+' : ''}{headcountChange}%
          </p>
          <p className="mt-1 text-sm text-gray-500">From {years[years.length - 2]} to {years[years.length - 1]}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Average Age Change</h3>
          <p className={`mt-2 text-3xl font-bold ${avgAgeChange > 0 ? 'text-red-600' : avgAgeChange < 0 ? 'text-green-600' : 'text-gray-600'}`}>
            {avgAgeChange > 0 ? '+' : ''}{avgAgeChange}%
          </p>
          <p className="mt-1 text-sm text-gray-500">From {years[years.length - 2]} to {years[years.length - 1]}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-5">
          <h3 className="text-lg font-medium text-gray-900">Average Tenure Change</h3>
          <p className={`mt-2 text-3xl font-bold ${avgTenureChange > 0 ? 'text-green-600' : avgTenureChange < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {avgTenureChange > 0 ? '+' : ''}{avgTenureChange}%
          </p>
          <p className="mt-1 text-sm text-gray-500">From {years[years.length - 2]} to {years[years.length - 1]}</p>
        </div>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Headcount Trend */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Headcount Trend</h2>
          <LineChart data={headcountData} height={250} />
        </div>
        
        {/* Age and Tenure Trend */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Age and Tenure Trend</h2>
          <LineChart data={ageAndTenureData} height={250} />
        </div>
        
        {/* New Hires Trend */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">New Hires by Year</h2>
          <BarChart data={newHiresData} height={250} />
        </div>
        
        {/* Gender Distribution Trend */}
        <div className="bg-white rounded-lg shadow p-5">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Gender Distribution by Year</h2>
          <BarChart data={genderData} height={250} />
        </div>
      </div>
      
      {/* Insights */}
      <div className="bg-white rounded-lg shadow p-5">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Year-over-Year Insights</h2>
        <div className="space-y-3 text-gray-600">
          <p>
            From {years[0]} to {years[years.length - 1]}, the organization's headcount 
            {headcount[headcount.length - 1] > headcount[0] 
              ? ` increased by ${Math.round(((headcount[headcount.length - 1] - headcount[0]) / headcount[0]) * 100)}%` 
              : headcount[headcount.length - 1] < headcount[0]
                ? ` decreased by ${Math.round(((headcount[0] - headcount[headcount.length - 1]) / headcount[0]) * 100)}%`
                : ' remained stable'}.
          </p>
          <p>
            The average age of employees has 
            {avgAge[avgAge.length - 1] > avgAge[0] 
              ? ' increased' 
              : avgAge[avgAge.length - 1] < avgAge[0]
                ? ' decreased'
                : ' remained stable'}
            , while the average tenure has 
            {avgTenure[avgTenure.length - 1] > avgTenure[0] 
              ? ' increased' 
              : avgTenure[avgTenure.length - 1] < avgTenure[0]
                ? ' decreased'
                : ' remained stable'}.
          </p>
          <p>
            Hiring patterns show that 
            {newHires[newHires.length - 1] > newHires[0] 
              ? ' recruitment has increased over the years' 
              : newHires[newHires.length - 1] < newHires[0]
                ? ' recruitment has decreased over the years'
                : ' recruitment has remained relatively stable'}.
          </p>
          <p>
            The gender distribution 
            {(femaleHeadcount[femaleHeadcount.length - 1] / (femaleHeadcount[femaleHeadcount.length - 1] + maleHeadcount[maleHeadcount.length - 1])) > 
             (femaleHeadcount[0] / (femaleHeadcount[0] + maleHeadcount[0])) 
              ? ' has shifted towards more female representation' 
              : (femaleHeadcount[femaleHeadcount.length - 1] / (femaleHeadcount[femaleHeadcount.length - 1] + maleHeadcount[maleHeadcount.length - 1])) <
                (femaleHeadcount[0] / (femaleHeadcount[0] + maleHeadcount[0]))
                ? ' has shifted towards more male representation'
                : ' has remained relatively stable'}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default YearComparison;
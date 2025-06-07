import React from 'react';
import { useYearContext } from '../context/YearContext';

const YearSelector: React.FC = () => {
  const { selectedYear, setSelectedYear } = useYearContext();
  
  return (
    <div className="relative">
      <select
        value={selectedYear}
        onChange={(e) => setSelectedYear(Number(e.target.value))}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-xs sm:text-sm bg-white py-1 px-2 sm:py-2 sm:pl-3 sm:pr-8 text-gray-700"
      >
        <option value={2023}>2023</option>
        <option value={2024}>2024</option>
        <option value={2025}>2025</option>
      </select>
    </div>
  );
};

export default YearSelector;
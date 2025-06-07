import React, { createContext, useContext, useState } from 'react';

type YearContextType = {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
};

const YearContext = createContext<YearContextType | undefined>(undefined);

export const YearProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedYear, setSelectedYear] = useState(2023);

  return (
    <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
      {children}
    </YearContext.Provider>
  );
};

export const useYearContext = (): YearContextType => {
  const context = useContext(YearContext);
  if (context === undefined) {
    throw new Error('useYearContext must be used within a YearProvider');
  }
  return context;
};
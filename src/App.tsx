import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SupabaseAppProvider } from './context/SupabaseAppContext';
import SupabaseDashboardPage from './pages/SupabaseDashboardPage';
import Demographics from './pages/Demographics';
import Tenure from './pages/Tenure';
import Organization from './pages/Organization';
import Recruitment from './pages/Recruitment';
import YearComparison from './pages/YearComparison';
import EmployeeList from './pages/EmployeeList';
import RiskAnalysis from './pages/RiskAnalysis';
import TurnoverAnalysis from './pages/TurnoverAnalysis';
import JutransLayout from './components/layout/JutransLayout';

function App() {
  return (
    <SupabaseAppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<JutransLayout />}>
            <Route index element={<SupabaseDashboardPage />} />
            <Route path="employees" element={<EmployeeList />} />
            <Route path="demographics" element={<Demographics />} />
            <Route path="tenure" element={<Tenure />} />
            <Route path="organization" element={<Organization />} />
            <Route path="recruitment" element={<Recruitment />} />
            <Route path="comparison" element={<YearComparison />} />
            <Route path="risks" element={<RiskAnalysis />} />
            <Route path="turnover" element={<TurnoverAnalysis />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SupabaseAppProvider>
  );
}

export default App;
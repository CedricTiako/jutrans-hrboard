import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import JutransSidebar from './layout/JutransSidebar';
import JutransHeader from './layout/JutransHeader';
import { YearProvider } from '../context/YearContext';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <YearProvider>
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <JutransSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        
        <div className="flex flex-col flex-1 overflow-hidden">
          <JutransHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-base-200 via-base-100 to-base-200">
            <div className="p-4 md:p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </YearProvider>
  );
};

export default Layout;
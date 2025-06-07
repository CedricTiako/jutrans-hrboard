import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import JutransSidebar from './JutransSidebar';
import JutransHeader from './JutransHeader';
import { YearProvider } from '../../context/YearContext';
import { FadeInView, Floating } from '../common/JutransAnimations';
import { Truck, Wifi, WifiOff, Globe } from 'lucide-react';

const JutransLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);
  const [showLanguageNotification, setShowLanguageNotification] = useState(false);
  const { i18n } = useTranslation();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
      setTimeout(() => setShowOfflineAlert(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Effet pour afficher une notification lors du changement de langue
  useEffect(() => {
    const handleLanguageChanged = () => {
      setShowLanguageNotification(true);
      setTimeout(() => setShowLanguageNotification(false), 3000);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  // Fermer le sidebar sur les petits écrans lors d'un changement de route
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <YearProvider>
      <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 overflow-hidden">
        {/* Sidebar avec animation */}
        <FadeInView direction="left" duration={400}>
          <JutransSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        </FadeInView>
        
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Header avec animation */}
          <FadeInView direction="down" duration={300}>
            <JutransHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          </FadeInView>
          
          {/* Indicateur de connexion */}
          <div className="fixed top-2 right-2 sm:top-4 sm:right-4 z-50">
            <div className={`
              flex items-center gap-1 sm:gap-2 px-2 py-1 rounded-full text-xs font-medium
              transition-all duration-300 transform
              ${isOnline 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-red-100 text-red-800 border border-red-200'
              }
              ${showOfflineAlert ? 'scale-110 animate-pulse' : 'scale-100'}
            `}>
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span className="hidden sm:inline">En ligne</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span className="hidden sm:inline">Hors ligne</span>
                </>
              )}
            </div>
          </div>

          {/* Notification de changement de langue */}
          {showLanguageNotification && (
            <div className="fixed top-10 sm:top-16 right-2 sm:right-4 z-50 animate-fade-in-up">
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-2 bg-blue-600 text-white rounded-lg shadow-lg">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-medium">
                  {i18n.language === 'fr' ? 'Langue changée en Français' : 'Language changed to English'}
                </span>
              </div>
            </div>
          )}

          {/* Alert hors ligne */}
          {showOfflineAlert && (
            <FadeInView direction="down" duration={300}>
              <div className="alert alert-warning mx-2 sm:mx-4 mt-2 animate-slide-down">
                <WifiOff className="w-4 h-4 sm:w-5 sm:h-5" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">Connexion perdue</h3>
                  <div className="text-xs">Certaines fonctionnalités peuvent être limitées</div>
                </div>
              </div>
            </FadeInView>
          )}
          
          {/* Contenu principal avec animations */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gradient-to-br from-base-200 via-base-100 to-base-200 relative">
            {/* Pattern de fond animé */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute top-10 left-10">
                <Floating amplitude={5} duration={4}>
                  <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </Floating>
              </div>
              <div className="absolute top-32 right-20">
                <Floating amplitude={8} duration={6}>
                  <Truck className="w-4 h-4 sm:w-6 sm:h-6 text-blue-500" />
                </Floating>
              </div>
              <div className="absolute bottom-20 left-1/4">
                <Floating amplitude={6} duration={5}>
                  <Truck className="w-5 h-5 sm:w-7 sm:h-7 text-blue-400" />
                </Floating>
              </div>
              <div className="absolute bottom-40 right-1/3">
                <Floating amplitude={4} duration={7}>
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                </Floating>
              </div>
            </div>

            {/* Contenu avec animation d'entrée */}
            <div className="relative z-10 p-2 sm:p-4 md:p-6">
              <FadeInView direction="up" duration={500} delay={200}>
                <Outlet />
              </FadeInView>
            </div>

            {/* Scroll indicator */}
            <div className="fixed bottom-4 right-4 z-40 hidden sm:block">
              <div className="w-1 h-20 bg-base-300 rounded-full overflow-hidden">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-full transition-all duration-300"
                  style={{
                    height: `${(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
                  }}
                />
              </div>
            </div>
          </main>
        </div>

        {/* Loading overlay pour les transitions */}
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center opacity-0 pointer-events-none transition-opacity duration-300" id="page-loader">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Truck className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600 animate-bounce" />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
            <div className="text-blue-600 font-medium">JUTRANS SARL</div>
            <div className="text-sm text-blue-500">Chargement...</div>
          </div>
        </div>
      </div>
    </YearProvider>
  );
};

export default JutransLayout;
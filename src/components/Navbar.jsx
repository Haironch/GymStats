import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Calculator, Activity, Timer, Pill, Dumbbell, LogOut, Music } from 'lucide-react';
import { getAuth, signOut } from 'firebase/auth';

const Navbar = ({ user, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const location = useLocation();
  const auth = getAuth();
  const navRef = useRef(null);
  const navItemsContainerRef = useRef(null);

  const navItems = [
    { path: '/peso', icon: Calculator, text: 'Calcula tu peso' },
    { path: '/calorias', icon: Activity, text: 'Requerimientos calóricos' },
    { path: '/cronometro', icon: Timer, text: 'Cronómetro' },
    { path: '/suplementos', icon: Dumbbell, text: 'Suplementos' },
    { path: '/medicamentos', icon: Pill, text: 'Medicamentos' },
    { path: '/playlist', icon: Music, text: 'Playlist' },
  ];

  useEffect(() => {
    const checkOverflow = () => {
      if (navRef.current && navItemsContainerRef.current) {
        const navWidth = navRef.current.offsetWidth;
        const itemsWidth = navItemsContainerRef.current.scrollWidth;
        const logoWidth = 200; // Aproximado para el logo
        const logoutWidth = 50; // Aproximado para el botón de logout
        const availableSpace = navWidth - logoWidth - logoutWidth;
        
        setIsMobileView(itemsWidth > availableSpace);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-[#2C2C2E] border-b border-gray-700" ref={navRef}>
      <div className="w-full px-4">
        <div className="flex h-16">
          {/* Logo */}
          <div className="flex items-center">
            {isMobileView ? (
              <div className="flex items-center">
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="flex items-center p-2 hover:text-[#FF3B30]"
                  aria-label="Toggle menu"
                >
                  <Menu className="h-6 w-6 text-[#FF3B30]" />
                </button>
                <Link to="/" className="ml-2">
                  <span className="text-[#FFFFFF] font-bold text-lg hover:text-[#FF3B30] transition-colors">
                    MyGymStats
                  </span>
                </Link>
              </div>
            ) : (
              <Link to="/" className="flex items-center">
                <Menu className="h-6 w-6 text-[#FF3B30]" />
                <span className="ml-3 text-[#FFFFFF] font-bold text-lg hover:text-[#FF3B30] transition-colors">
                  MyGymStats
                </span>
              </Link>
            )}
          </div>

          {/* Desktop Navigation */}
          {!isMobileView && (
            <div className="flex items-center justify-end flex-1 space-x-8" ref={navItemsContainerRef}>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center whitespace-nowrap ${
                      isActive(item.path) 
                        ? 'text-[#FF3B30]' 
                        : 'text-[#F0F0F0] hover:text-[#FF3B30]'
                    } transition-colors`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    <span>{item.text}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center text-[#FF3B30] hover:text-red-700 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          {isMobileView && (
            <div className="flex items-center ml-auto">
              <button
                onClick={handleLogout}
                className="text-[#FF3B30] hover:text-red-700 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {isMobileView && isMobileMenuOpen && (
          <div className="bg-[#2C2C2E] border-t border-gray-700">
            <div className="px-2 py-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg whitespace-nowrap ${
                      isActive(item.path) 
                        ? 'text-[#FF3B30] bg-gray-700/50' 
                        : 'text-[#F0F0F0] hover:text-[#FF3B30] hover:bg-gray-700/25'
                    } transition-colors`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    <span>{item.text}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
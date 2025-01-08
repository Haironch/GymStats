import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Calculator, Activity, Timer, Pill, Dumbbell } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/peso', icon: Calculator, text: 'Calcula tu peso' },
    { path: '/calorias', icon: Activity, text: 'Requerimientos calóricos' },
    { path: '/cronometro', icon: Timer, text: 'Cronómetro' },
    { path: '/suplementos', icon: Dumbbell, text: 'Suplementos' },
    { path: '/medicamentos', icon: Pill, text: 'Medicamentos' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-[#2C2C2E] border-b border-gray-700">
      <div className="w-full px-4">
        <div className="flex h-16">
          {/* Logo - pegado a la izquierda */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Menu className="h-6 w-6 text-[#FF3B30]" />
              <span className="ml-3 text-[#FFFFFF] font-bold text-lg">
                MyGymStats
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - distribuido en el espacio restante */}
          <div className="hidden md:flex items-center justify-end flex-1 space-x-8">
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
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center ml-auto">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-[#F0F0F0] hover:text-[#FF3B30] transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#2C2C2E] border-t border-gray-700">
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
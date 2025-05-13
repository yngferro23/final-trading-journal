import React from 'react';
import { Sun, Moon, Menu, LogOut } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  darkMode, 
  toggleDarkMode, 
  onMenuClick
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 transition-colors duration-200">
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 mr-2 text-gray-500 dark:text-gray-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-blue-800 dark:text-blue-500">
            TraderJournal
          </h1>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          className="w-10 h-10 p-0 rounded-full"
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
};

export default Header;
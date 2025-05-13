import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookPlus, 
  History, 
  BarChart, 
  Calendar, 
  Settings,
  X,
  PlayCircle
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/' },
    { label: 'Add Trade', icon: <BookPlus size={20} />, path: '/add-trade' },
    { label: 'Trade History', icon: <History size={20} />, path: '/history' },
    { label: 'Analytics', icon: <BarChart size={20} />, path: '/analytics' },
    { label: 'Calendar', icon: <Calendar size={20} />, path: '/calendar' },
    { label: 'Chart Replay', icon: <PlayCircle size={20} />, path: '/chart-replay' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/settings' },
  ];
  
  const sidebarClasses = `${isOpen ? 'translate-x-0' : '-translate-x-full'} 
    fixed top-0 left-0 z-40 h-screen w-64 
    bg-white dark:bg-gray-900 
    border-r border-gray-200 dark:border-gray-800 
    transition-transform duration-300 ease-in-out 
    lg:translate-x-0 lg:static lg:shrink-0`;
    
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={sidebarClasses}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          <h2 className="text-xl font-bold text-blue-800 dark:text-blue-500">TraderJournal</h2>
          <button 
            onClick={onClose} 
            className="p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
import React from 'react';
import { Menu, CheckSquare, Users, User, Bell } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface HeaderProps {
  activeView: 'todos' | 'social' | 'profile';
  setActiveView: (view: 'todos' | 'social' | 'profile') => void;
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeView, 
  setActiveView, 
  setSidebarOpen 
}) => {
  const { state } = useUser();
  const { currentUser, notifications } = state;
  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <header className="bg-navy-950 border-b border-crimson-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <CheckSquare className="w-8 h-8 text-crimson-500" />
              <h1 className="text-xl font-bold text-white hidden sm:block">
                Cool Todo v1
              </h1>
            </div>
          </div>

          {/* Center navigation */}
          <nav className="hidden md:flex space-x-1">
            <button
              onClick={() => setActiveView('todos')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeView === 'todos'
                  ? 'bg-crimson-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <CheckSquare className="w-4 h-4 inline mr-2" />
              Todos
            </button>
            <button
              onClick={() => setActiveView('social')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeView === 'social'
                  ? 'bg-crimson-500 text-white shadow-lg'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Social
            </button>
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-crimson-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* User profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium text-white">
                  {currentUser.name}
                </div>
                <div className="text-xs text-slate-400">
                  Level {currentUser.level} • {currentUser.xp} XP
                </div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-br from-crimson-500 to-crimson-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
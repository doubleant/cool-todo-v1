import React from 'react';
import { X, CheckSquare, Users, User, Trophy, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeView: 'todos' | 'social' | 'profile';
  setActiveView: (view: 'todos' | 'social' | 'profile') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  setIsOpen,
  activeView,
  setActiveView
}) => {
  const { state } = useUser();
  const { currentUser } = state;

  const menuItems = [
    { id: 'todos', label: 'My Todos', icon: CheckSquare },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-navy-900 border-r border-slate-700 transform transition-transform duration-300 ease-in-out z-50 lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <CheckSquare className="w-6 h-6 text-crimson-500" />
              <span className="font-bold text-white">Cool Todo v1</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-crimson-500 to-crimson-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="font-medium text-white">{currentUser.name}</div>
                <div className="text-sm text-slate-400">Level {currentUser.level}</div>
              </div>
            </div>
            
            {/* XP Progress */}
            <div className="mt-3">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>{currentUser.xp} XP</span>
                <span>{currentUser.xp + currentUser.xpToNextLevel} XP</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-crimson-500 to-crimson-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(currentUser.xp / (currentUser.xp + currentUser.xpToNextLevel)) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id as any);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg font-medium transition-all ${
                    activeView === item.id
                      ? 'bg-crimson-500 text-white shadow-lg'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats */}
          <div className="p-4 border-t border-slate-700">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-crimson-500">
                  {currentUser.totalTasksCompleted}
                </div>
                <div className="text-xs text-slate-400">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-crimson-500">
                  {currentUser.streak}
                </div>
                <div className="text-xs text-slate-400">Day Streak</div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
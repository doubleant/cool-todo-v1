import React, { useState, useEffect } from 'react';
import { TodoProvider } from './contexts/TodoContext';
import { UserProvider } from './contexts/UserContext';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { AddTodo } from './components/AddTodo';
import { Sidebar } from './components/Sidebar';
import { SocialPanel } from './components/SocialPanel';

function App() {
  const [activeView, setActiveView] = useState<'todos' | 'social' | 'profile'>('todos');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <UserProvider>
      <TodoProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-navy-900 to-slate-800">
          <Header 
            activeView={activeView} 
            setActiveView={setActiveView}
            setSidebarOpen={setSidebarOpen}
          />
          
          <div className="flex">
            <Sidebar 
              isOpen={sidebarOpen} 
              setIsOpen={setSidebarOpen}
              activeView={activeView}
              setActiveView={setActiveView}
            />
            
            <main className="flex-1 p-4 lg:p-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {activeView === 'todos' && (
                    <>
                      <AddTodo />
                      <TodoList />
                    </>
                  )}
                  {activeView === 'social' && <SocialPanel />}
                </div>
                
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    {/* Profile stats will be shown here */}
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </TodoProvider>
    </UserProvider>
  );
}

export default App;
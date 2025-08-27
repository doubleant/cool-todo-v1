import React, { useMemo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { useTodos } from '../contexts/TodoContext';
import { TodoItem } from './TodoItem';
import { TodoFilters } from './TodoFilters';

export const TodoList: React.FC = () => {
  const { state, dispatch } = useTodos();
  const { todos, filter, searchTerm, selectedCategory } = state;

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Filter by status
      if (filter === 'active' && (todo.completed || todo.deleted)) return false;
      if (filter === 'completed' && (!todo.completed || todo.deleted)) return false;
      if (filter === 'deleted' && !todo.deleted) return false;
      if (filter === 'all' && todo.deleted) return false;

      // Filter by search term
      if (searchTerm && !todo.text.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Filter by category
      if (selectedCategory !== 'all' && todo.category !== selectedCategory) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort by priority (high -> medium -> low) then by creation date
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [todos, filter, searchTerm, selectedCategory]);

  const stats = useMemo(() => {
    const activeTodos = todos.filter(t => !t.completed && !t.deleted);
    const completedTodos = todos.filter(t => t.completed && !t.deleted);
    const deletedTodos = todos.filter(t => t.deleted);
    
    return {
      total: todos.filter(t => !t.deleted).length,
      active: activeTodos.length,
      completed: completedTodos.length,
      deleted: deletedTodos.length
    };
  }, [todos]);

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search todos..."
                value={searchTerm}
                onChange={(e) => dispatch({ type: 'SET_SEARCH', payload: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
        
        <TodoFilters />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-navy-800 rounded-lg border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-white">{stats.total}</div>
          <div className="text-sm text-slate-400">Total</div>
        </div>
        <div className="bg-navy-800 rounded-lg border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-yellow-500">{stats.active}</div>
          <div className="text-sm text-slate-400">Active</div>
        </div>
        <div className="bg-navy-800 rounded-lg border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
          <div className="text-sm text-slate-400">Completed</div>
        </div>
        <div className="bg-navy-800 rounded-lg border border-slate-700 p-4 text-center">
          <div className="text-2xl font-bold text-red-500">{stats.deleted}</div>
          <div className="text-sm text-slate-400">Deleted</div>
        </div>
      </div>

      {/* Todo List */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 shadow-xl">
        {filteredTodos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-slate-400 text-lg mb-2">
              {searchTerm ? 'No todos match your search' : 'No todos found'}
            </div>
            <div className="text-slate-500 text-sm">
              {searchTerm ? 'Try different search terms' : 'Add your first todo to get started!'}
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-700">
            {filteredTodos.map((todo, index) => (
              <TodoItem 
                key={todo.id} 
                todo={todo} 
                isFirst={index === 0}
                isLast={index === filteredTodos.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
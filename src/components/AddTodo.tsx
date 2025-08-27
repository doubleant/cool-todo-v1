import React, { useState, useRef } from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useTodos } from '../contexts/TodoContext';
import { useUser } from '../contexts/UserContext';

export const AddTodo: React.FC = () => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [category, setCategory] = useState('Personal');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { addTodo } = useTodos();
  const { addXP } = useUser();

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Shopping', 'Other'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setError('Todo text is required');
      inputRef.current?.focus();
      return;
    }

    if (text.length > 200) {
      setError('Todo text must be less than 200 characters');
      return;
    }

    addTodo({
      text: text.trim(),
      completed: false,
      deleted: false,
      priority,
      category
    });

    // Add XP for creating a todo
    addXP(5);

    setText('');
    setError('');
    setCategory('Personal');
    setPriority('medium');
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 mb-6 shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
        <Plus className="w-5 h-5 mr-2 text-crimson-500" />
        Add New Todo
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="todo-text" className="block text-sm font-medium text-slate-300 mb-2">
            What needs to be done?
          </label>
          <input
            ref={inputRef}
            id="todo-text"
            type="text"
            value={text}
            onChange={handleTextChange}
            placeholder="Enter your todo..."
            className={`w-full px-4 py-3 bg-slate-900 border rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent transition-all ${
              error ? 'border-red-500' : 'border-slate-600'
            }`}
            maxLength={200}
            aria-describedby={error ? 'todo-error' : undefined}
          />
          {error && (
            <p id="todo-error" className="mt-2 text-sm text-red-400 flex items-center">
              <AlertCircle className="w-4 h-4 mr-1" />
              {error}
            </p>
          )}
          <div className="mt-1 text-xs text-slate-400">
            {text.length}/200 characters
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="todo-priority" className="block text-sm font-medium text-slate-300 mb-2">
              Priority
            </label>
            <select
              id="todo-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>

          <div>
            <label htmlFor="todo-category" className="block text-sm font-medium text-slate-300 mb-2">
              Category
            </label>
            <select
              id="todo-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-crimson-500 to-crimson-600 text-white font-medium rounded-lg hover:from-crimson-600 hover:to-crimson-700 focus:outline-none focus:ring-2 focus:ring-crimson-500 focus:ring-offset-2 focus:ring-offset-slate-900 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          <Plus className="w-4 h-4 inline mr-2" />
          Add Todo
        </button>
      </form>
    </div>
  );
};
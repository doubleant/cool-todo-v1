import React from 'react';
import { useTodos } from '../contexts/TodoContext';

export const TodoFilters: React.FC = () => {
  const { state, dispatch } = useTodos();
  const { filter, selectedCategory } = state;

  const filters = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'active', label: 'Active', count: 0 },
    { key: 'completed', label: 'Completed', count: 0 },
    { key: 'deleted', label: 'Deleted', count: 0 },
  ];

  const categories = ['all', 'Personal', 'Work', 'Health', 'Learning', 'Shopping', 'Other'];

  return (
    <div className="mt-4 flex flex-col sm:flex-row gap-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => dispatch({ type: 'SET_FILTER', payload: f.key as any })}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f.key
                ? 'bg-crimson-500 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2">
        <label htmlFor="category-filter" className="text-sm text-slate-400">
          Category:
        </label>
        <select
          id="category-filter"
          value={selectedCategory}
          onChange={(e) => dispatch({ type: 'SET_CATEGORY', payload: e.target.value })}
          className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-crimson-500"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
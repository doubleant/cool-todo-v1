import React, { useState, useRef, useEffect } from 'react';
import { 
  Check, 
  Trash2, 
  RotateCcw, 
  Edit3, 
  Save, 
  X, 
  Flag,
  Calendar,
  Tag
} from 'lucide-react';
import { useTodos, Todo } from '../contexts/TodoContext';
import { useUser } from '../contexts/UserContext';

interface TodoItemProps {
  todo: Todo;
  isFirst: boolean;
  isLast: boolean;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, isFirst, isLast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editCategory, setEditCategory] = useState(todo.category);
  const editInputRef = useRef<HTMLInputElement>(null);

  const { toggleTodo, deleteTodo, restoreTodo, editTodo } = useTodos();
  const { addXP } = useUser();

  const categories = ['Personal', 'Work', 'Health', 'Learning', 'Shopping', 'Other'];

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleToggle = () => {
    toggleTodo(todo.id);
    if (!todo.completed) {
      // Add XP for completing a task
      const xpAmount = todo.priority === 'high' ? 20 : todo.priority === 'medium' ? 15 : 10;
      addXP(xpAmount);
    }
  };

  const handleDelete = () => {
    deleteTodo(todo.id);
  };

  const handleRestore = () => {
    restoreTodo(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
  };

  const handleSave = () => {
    if (editText.trim()) {
      editTodo(todo.id, editText.trim(), editPriority, editCategory);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setEditCategory(todo.category);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/20';
      case 'medium': return 'text-yellow-500 bg-yellow-500/20';
      case 'low': return 'text-green-500 bg-green-500/20';
    }
  };

  const getPriorityBorder = (priority: Todo['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
    }
  };

  return (
    <div 
      className={`p-4 border-l-4 ${getPriorityBorder(todo.priority)} hover:bg-slate-800/50 transition-all duration-200 ${
        isFirst ? 'rounded-t-xl' : ''
      } ${isLast ? 'rounded-b-xl' : ''}`}
    >
      <div className="flex items-start space-x-3">
        {/* Checkbox */}
        {!todo.deleted && (
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
              todo.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-slate-400 hover:border-crimson-500 hover:bg-crimson-500/10'
            }`}
            aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          >
            {todo.completed && <Check className="w-4 h-4" />}
          </button>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-3">
              <input
                ref={editInputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-crimson-500"
                maxLength={200}
              />
              <div className="flex flex-wrap gap-2">
                <select
                  value={editPriority}
                  onChange={(e) => setEditPriority(e.target.value as Todo['priority'])}
                  className="px-3 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="px-3 py-1 bg-slate-900 border border-slate-600 rounded text-white text-sm"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <>
              <div className={`text-white ${todo.completed ? 'line-through opacity-60' : ''} ${todo.deleted ? 'opacity-40' : ''}`}>
                {todo.text}
              </div>
              
              {/* Meta information */}
              <div className="flex flex-wrap items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(todo.priority)}`}>
                  <Flag className="w-3 h-3 mr-1" />
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
                
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-700">
                  <Tag className="w-3 h-3 mr-1" />
                  {todo.category}
                </span>
                
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-slate-400 bg-slate-700">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(todo.createdAt).toLocaleDateString()}
                </span>
                
                {todo.completed && todo.completedAt && (
                  <span className="text-xs text-green-500">
                    ✓ Completed {new Date(todo.completedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="p-2 text-green-500 hover:bg-green-500/20 rounded-lg transition-colors"
                aria-label="Save changes"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-2 text-slate-400 hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            <>
              {todo.deleted ? (
                <button
                  onClick={handleRestore}
                  className="p-2 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors"
                  aria-label="Restore todo"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={handleEdit}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
                    aria-label="Edit todo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                    aria-label="Delete todo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
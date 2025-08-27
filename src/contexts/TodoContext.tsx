import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  deleted: boolean;
  createdAt: Date;
  completedAt?: Date;
  deletedAt?: Date;
  priority: 'low' | 'medium' | 'high';
  category: string;
  userId: string;
}

interface TodoState {
  todos: Todo[];
  filter: 'all' | 'active' | 'completed' | 'deleted';
  searchTerm: string;
  selectedCategory: string;
}

type TodoAction =
  | { type: 'ADD_TODO'; payload: Omit<Todo, 'id' | 'createdAt' | 'userId'> }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'RESTORE_TODO'; payload: string }
  | { type: 'EDIT_TODO'; payload: { id: string; text: string; priority: Todo['priority']; category: string } }
  | { type: 'SET_FILTER'; payload: TodoState['filter'] }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'LOAD_TODOS'; payload: Todo[] };

const TodoContext = createContext<{
  state: TodoState;
  dispatch: React.Dispatch<TodoAction>;
  addTodo: (todo: Omit<Todo, 'id' | 'createdAt' | 'userId'>) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  restoreTodo: (id: string) => void;
  editTodo: (id: string, text: string, priority: Todo['priority'], category: string) => void;
} | null>(null);

const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
  switch (action.type) {
    case 'LOAD_TODOS':
      return { ...state, todos: action.payload };
    
    case 'ADD_TODO':
      const newTodo: Todo = {
        ...action.payload,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        userId: 'current-user' // In a real app, this would come from auth
      };
      return { ...state, todos: [...state.todos, newTodo] };
    
    case 'TOGGLE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { 
                ...todo, 
                completed: !todo.completed,
                completedAt: !todo.completed ? new Date() : undefined
              }
            : todo
        )
      };
    
    case 'DELETE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, deleted: true, deletedAt: new Date() }
            : todo
        )
      };
    
    case 'RESTORE_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, deleted: false, deletedAt: undefined }
            : todo
        )
      };
    
    case 'EDIT_TODO':
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id
            ? { 
                ...todo, 
                text: action.payload.text,
                priority: action.payload.priority,
                category: action.payload.category
              }
            : todo
        )
      };
    
    case 'SET_FILTER':
      return { ...state, filter: action.payload };
    
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    default:
      return state;
  }
};

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, {
    todos: [],
    filter: 'all',
    searchTerm: '',
    selectedCategory: 'all'
  });

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('cool-todo-v1-todos');
    if (savedTodos) {
      try {
        const todos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
          deletedAt: todo.deletedAt ? new Date(todo.deletedAt) : undefined,
        }));
        dispatch({ type: 'LOAD_TODOS', payload: todos });
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem('cool-todo-v1-todos', JSON.stringify(state.todos));
  }, [state.todos]);

  const addTodo = (todo: Omit<Todo, 'id' | 'createdAt' | 'userId'>) => {
    dispatch({ type: 'ADD_TODO', payload: todo });
  };

  const toggleTodo = (id: string) => {
    dispatch({ type: 'TOGGLE_TODO', payload: id });
  };

  const deleteTodo = (id: string) => {
    dispatch({ type: 'DELETE_TODO', payload: id });
  };

  const restoreTodo = (id: string) => {
    dispatch({ type: 'RESTORE_TODO', payload: id });
  };

  const editTodo = (id: string, text: string, priority: Todo['priority'], category: string) => {
    dispatch({ type: 'EDIT_TODO', payload: { id, text, priority, category } });
  };

  return (
    <TodoContext.Provider value={{
      state,
      dispatch,
      addTodo,
      toggleTodo,
      deleteTodo,
      restoreTodo,
      editTodo
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};
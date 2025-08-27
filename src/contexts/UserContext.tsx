import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalTasksCompleted: number;
  streak: number;
  achievements: Achievement[];
  friends: Friend[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

export interface Friend {
  id: string;
  name: string;
  level: number;
  isOnline: boolean;
  lastActive: Date;
}

interface UserState {
  currentUser: User;
  notifications: Notification[];
}

interface Notification {
  id: string;
  type: 'achievement' | 'friend_request' | 'level_up';
  message: string;
  createdAt: Date;
  read: boolean;
}

type UserAction =
  | { type: 'ADD_XP'; payload: number }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'ADD_FRIEND'; payload: Friend }
  | { type: 'UPDATE_STREAK'; payload: number }
  | { type: 'ADD_NOTIFICATION'; payload: Omit<Notification, 'id' | 'createdAt'> }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'LOAD_USER'; payload: User };

const UserContext = createContext<{
  state: UserState;
  dispatch: React.Dispatch<UserAction>;
  addXP: (amount: number) => void;
  addAchievement: (achievement: Omit<Achievement, 'unlockedAt'>) => void;
} | null>(null);

const calculateLevel = (xp: number): { level: number; xpToNext: number } => {
  const level = Math.floor(xp / 100) + 1;
  const xpToNext = (level * 100) - xp;
  return { level, xpToNext };
};

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case 'LOAD_USER':
      return { ...state, currentUser: action.payload };
    
    case 'ADD_XP':
      const newXP = state.currentUser.xp + action.payload;
      const { level, xpToNext } = calculateLevel(newXP);
      const leveledUp = level > state.currentUser.level;
      
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          xp: newXP,
          level,
          xpToNextLevel: xpToNext,
          totalTasksCompleted: state.currentUser.totalTasksCompleted + (action.payload > 0 ? 1 : 0)
        },
        notifications: leveledUp ? [
          ...state.notifications,
          {
            id: crypto.randomUUID(),
            type: 'level_up',
            message: `Congratulations! You've reached level ${level}!`,
            createdAt: new Date(),
            read: false
          }
        ] : state.notifications
      };
    
    case 'ADD_ACHIEVEMENT':
      const newAchievement = { ...action.payload, unlockedAt: new Date() };
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          achievements: [...state.currentUser.achievements, newAchievement]
        },
        notifications: [
          ...state.notifications,
          {
            id: crypto.randomUUID(),
            type: 'achievement',
            message: `Achievement unlocked: ${action.payload.name}!`,
            createdAt: new Date(),
            read: false
          }
        ]
      };
    
    case 'ADD_FRIEND':
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          friends: [...state.currentUser.friends, action.payload]
        }
      };
    
    case 'UPDATE_STREAK':
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          streak: action.payload
        }
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            ...action.payload,
            id: crypto.randomUUID(),
            createdAt: new Date()
          }
        ]
      };
    
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        )
      };
    
    default:
      return state;
  }
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, {
    currentUser: {
      id: 'current-user',
      name: 'Cool Todo User',
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      totalTasksCompleted: 0,
      streak: 0,
      achievements: [],
      friends: [
        {
          id: 'friend-1',
          name: 'Alice Johnson',
          level: 5,
          isOnline: true,
          lastActive: new Date()
        },
        {
          id: 'friend-2',
          name: 'Bob Smith',
          level: 3,
          isOnline: false,
          lastActive: new Date(Date.now() - 3600000) // 1 hour ago
        }
      ]
    },
    notifications: []
  });

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('cool-todo-v1-user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        // Convert date strings back to Date objects
        user.achievements = user.achievements?.map((ach: any) => ({
          ...ach,
          unlockedAt: new Date(ach.unlockedAt)
        })) || [];
        user.friends = user.friends?.map((friend: any) => ({
          ...friend,
          lastActive: new Date(friend.lastActive)
        })) || [];
        dispatch({ type: 'LOAD_USER', payload: user });
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      }
    }
  }, []);

  // Save user data whenever it changes
  useEffect(() => {
    localStorage.setItem('cool-todo-v1-user', JSON.stringify(state.currentUser));
  }, [state.currentUser]);

  const addXP = (amount: number) => {
    dispatch({ type: 'ADD_XP', payload: amount });
    
    // Check for achievements
    const newTotal = state.currentUser.totalTasksCompleted + 1;
    
    if (newTotal === 1) {
      addAchievement({
        id: 'first-task',
        name: 'Getting Started',
        description: 'Complete your first task',
        icon: '🎯'
      });
    } else if (newTotal === 10) {
      addAchievement({
        id: 'ten-tasks',
        name: 'Task Master',
        description: 'Complete 10 tasks',
        icon: '⭐'
      });
    } else if (newTotal === 50) {
      addAchievement({
        id: 'fifty-tasks',
        name: 'Productivity Pro',
        description: 'Complete 50 tasks',
        icon: '🏆'
      });
    }
  };

  const addAchievement = (achievement: Omit<Achievement, 'unlockedAt'>) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
  };

  return (
    <UserContext.Provider value={{
      state,
      dispatch,
      addXP,
      addAchievement
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
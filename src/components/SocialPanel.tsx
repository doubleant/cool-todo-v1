import React, { useState } from 'react';
import { Users, UserPlus, MessageCircle, Trophy, Star } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { useTodos } from '../contexts/TodoContext';

export const SocialPanel: React.FC = () => {
  const { state: userState } = useUser();
  const { state: todoState } = useTodos();
  const { currentUser } = userState;
  const [activeTab, setActiveTab] = useState<'friends' | 'leaderboard' | 'achievements'>('friends');

  // Mock friend todos for demonstration
  const friendTodos = [
    {
      id: '1',
      friendName: 'Alice Johnson',
      friendLevel: 5,
      text: 'Finish quarterly report',
      completed: true,
      priority: 'high' as const,
      category: 'Work',
      completedAt: new Date()
    },
    {
      id: '2',
      friendName: 'Alice Johnson',
      friendLevel: 5,
      text: 'Morning workout',
      completed: false,
      priority: 'medium' as const,
      category: 'Health',
      completedAt: undefined
    },
    {
      id: '3',
      friendName: 'Bob Smith',
      friendLevel: 3,
      text: 'Read 20 pages of new book',
      completed: true,
      priority: 'low' as const,
      category: 'Learning',
      completedAt: new Date()
    }
  ];

  const leaderboard = [
    { name: 'Alice Johnson', level: 5, xp: 2450, tasksCompleted: 89 },
    { name: 'Current User', level: currentUser.level, xp: currentUser.xp, tasksCompleted: currentUser.totalTasksCompleted },
    { name: 'Bob Smith', level: 3, xp: 1200, tasksCompleted: 45 },
    { name: 'Carol Davis', level: 4, xp: 1850, tasksCompleted: 67 },
  ].sort((a, b) => b.xp - a.xp);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-navy-800 rounded-xl border border-slate-700 p-6 shadow-xl">
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'friends'
                ? 'bg-crimson-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Users className="w-4 h-4 inline mr-2" />
            Friends
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-crimson-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Trophy className="w-4 h-4 inline mr-2" />
            Leaderboard
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeTab === 'achievements'
                ? 'bg-crimson-500 text-white shadow-lg'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Star className="w-4 h-4 inline mr-2" />
            Achievements
          </button>
        </div>

        {/* Friends Tab */}
        {activeTab === 'friends' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-white">Your Friends</h3>
              <button className="px-4 py-2 bg-crimson-500 text-white rounded-lg hover:bg-crimson-600 transition-colors">
                <UserPlus className="w-4 h-4 inline mr-2" />
                Add Friend
              </button>
            </div>

            <div className="grid gap-4">
              {currentUser.friends.map((friend) => (
                <div key={friend.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {friend.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-white">{friend.name}</div>
                        <div className="text-sm text-slate-400">Level {friend.level}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${friend.isOnline ? 'bg-green-500' : 'bg-slate-500'}`} />
                      <span className="text-sm text-slate-400">
                        {friend.isOnline ? 'Online' : 'Offline'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold text-white mb-4">Friend Activity</h4>
              <div className="space-y-3">
                {friendTodos.map((todo) => (
                  <div key={todo.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-white">{todo.friendName}</span>
                          <span className="text-xs text-slate-400">Level {todo.friendLevel}</span>
                        </div>
                        <div className={`text-slate-300 ${todo.completed ? 'line-through opacity-60' : ''}`}>
                          {todo.text}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            todo.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                            todo.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-green-500/20 text-green-400'
                          }`}>
                            {todo.priority}
                          </span>
                          <span className="text-xs text-slate-400">{todo.category}</span>
                        </div>
                      </div>
                      {todo.completed && (
                        <div className="text-green-500">
                          <span className="text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Tab */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Leaderboard</h3>
            <div className="space-y-3">
              {leaderboard.map((user, index) => (
                <div
                  key={user.name}
                  className={`bg-slate-900 rounded-lg p-4 border ${
                    user.name === 'Current User' 
                      ? 'border-crimson-500 bg-crimson-500/10' 
                      : 'border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-yellow-900' :
                        index === 1 ? 'bg-slate-400 text-slate-900' :
                        index === 2 ? 'bg-orange-600 text-orange-100' :
                        'bg-slate-700 text-slate-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium text-white">
                          {user.name === 'Current User' ? 'You' : user.name}
                        </div>
                        <div className="text-sm text-slate-400">
                          Level {user.level} • {user.tasksCompleted} tasks completed
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-crimson-500">{user.xp} XP</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Your Achievements</h3>
            {currentUser.achievements.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <div className="text-slate-400">No achievements yet</div>
                <div className="text-sm text-slate-500">Complete tasks to unlock achievements!</div>
              </div>
            ) : (
              <div className="grid gap-4">
                {currentUser.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <div className="font-medium text-white">{achievement.name}</div>
                        <div className="text-sm text-slate-400">{achievement.description}</div>
                        <div className="text-xs text-slate-500 mt-1">
                          Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
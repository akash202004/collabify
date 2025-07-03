import React from 'react';
import { LogOut, Activity, Users } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onShowActivity: () => void;
  userCount: number;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, onShowActivity, userCount }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">K</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">KanbanFlow</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-gray-600">
            <Users className="w-4 h-4" />
            <span className="text-sm">{userCount} users</span>
          </div>
          
          <button
            onClick={onShowActivity}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors duration-200"
          >
            <Activity className="w-4 h-4" />
            <span>Activity</span>
          </button>

          <div className="flex items-center space-x-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: user.color }}
            >
              {user.username[0].toUpperCase()}
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user.username}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};
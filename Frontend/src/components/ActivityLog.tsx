import React from 'react';
import { Activity, Clock, User } from 'lucide-react';
import { ActivityLog as ActivityLogType } from '../types';

interface ActivityLogProps {
  activityLog: ActivityLogType[];
  isOpen: boolean;
  onClose: () => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activityLog, isOpen, onClose }) => {
  if (!isOpen) return null;

  const getActivityIcon = (action: string) => {
    switch (action) {
      case 'created':
        return '🆕';
      case 'updated':
        return '✏️';
      case 'moved':
        return '🔄';
      case 'deleted':
        return '🗑️';
      case 'smart-assigned':
        return '🤖';
      case 'conflict-resolved':
        return '🔧';
      default:
        return '📝';
    }
  };

  const getActivityColor = (action: string) => {
    switch (action) {
      case 'created':
        return 'bg-green-100 text-green-800';
      case 'updated':
        return 'bg-blue-100 text-blue-800';
      case 'moved':
        return 'bg-purple-100 text-purple-800';
      case 'deleted':
        return 'bg-red-100 text-red-800';
      case 'smart-assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'conflict-resolved':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold">Activity Log</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {activityLog.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              No activity yet. Start creating and managing tasks!
            </div>
          ) : (
            activityLog.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="text-2xl">{getActivityIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-800">{log.username}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(log.action)}`}>
                      {log.action}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{log.details}</p>
                  <div className="flex items-center space-x-1 text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
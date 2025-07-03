import React from 'react';
import { AlertTriangle, User, Clock } from 'lucide-react';
import { TaskConflict, User as UserType } from '../types';

interface ConflictModalProps {
  conflicts: TaskConflict[];
  users: UserType[];
  onResolve: (taskId: string, resolution: 'merge' | 'overwrite', version: any) => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  conflicts,
  users,
  onResolve,
}) => {
  if (conflicts.length === 0) return null;

  const conflict = conflicts[0]; // Handle one conflict at a time

  const currentUser = users.find(u => u.username === conflict.currentUser);
  const conflictingUser = users.find(u => u.username === conflict.conflictingUser);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[80vh] overflow-hidden">
        <div className="flex items-center space-x-2 mb-6">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h2 className="text-xl font-semibold text-red-800">Conflict Detected</h2>
        </div>

        <div className="mb-6">
          <p className="text-gray-700">
            Two users have edited the same task simultaneously. Please choose how to resolve this conflict:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Current Version */}
          <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-800">Your Version</h3>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Title:</span>
                <p className="text-sm text-gray-900">{conflict.currentVersion.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Description:</span>
                <p className="text-sm text-gray-900">{conflict.currentVersion.description}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Priority:</span>
                <span className="text-sm text-gray-900 capitalize ml-1">
                  {conflict.currentVersion.priority}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  Modified: {new Date(conflict.currentVersion.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Conflicting Version */}
          <div className="border border-red-200 rounded-lg p-4 bg-red-50">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-5 h-5 text-red-600" />
              <h3 className="font-semibold text-red-800">
                {conflict.conflictingUser}'s Version
              </h3>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">Title:</span>
                <p className="text-sm text-gray-900">{conflict.incomingVersion.title}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Description:</span>
                <p className="text-sm text-gray-900">{conflict.incomingVersion.description}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Priority:</span>
                <span className="text-sm text-gray-900 capitalize ml-1">
                  {conflict.incomingVersion.priority}
                </span>
              </div>
              <div className="flex items-center space-x-1 text-gray-500">
                <Clock className="w-3 h-3" />
                <span className="text-xs">
                  Modified: {new Date(conflict.incomingVersion.updatedAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => onResolve(conflict.taskId, 'overwrite', conflict.currentVersion)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
          >
            Keep My Version
          </button>
          <button
            onClick={() => onResolve(conflict.taskId, 'overwrite', conflict.incomingVersion)}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Use Their Version
          </button>
          <button
            onClick={() => {
              // Simple merge: combine descriptions
              const mergedVersion = {
                ...conflict.incomingVersion,
                description: `${conflict.currentVersion.description}\n\n--- Merged with ${conflict.conflictingUser}'s version ---\n${conflict.incomingVersion.description}`,
              };
              onResolve(conflict.taskId, 'merge', mergedVersion);
            }}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Merge Both
          </button>
        </div>
      </div>
    </div>
  );
};
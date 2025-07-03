import React, { useState } from 'react';
import { User, Clock, MoreVertical, Edit, Trash2, Zap, Info, X } from 'lucide-react';
import { Task, User as UserType } from '../types';

interface TaskCardProps {
  task: Task;
  users: UserType[];
  currentUser: UserType;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onSmartAssign: (taskId: string) => void;
  isDragging: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  users,
  currentUser,
  onUpdate,
  onDelete,
  onSmartAssign,
  isDragging,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);

  const assignedUser = users.find(u => u.id === task.assignedTo);
  const createdUser = users.find(u => u.id === task.createdBy);

  const priorityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  const priorityIcons = {
    low: '🟢',
    medium: '🟡',
    high: '🔴',
  };

  const handleSave = () => {
    if (editTitle.trim() && editDescription.trim()) {
      onUpdate(task.id, { title: editTitle, description: editDescription });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setIsEditing(false);
  };

  return (
    <>
      <div
        className={`relative group ${isDragging ? 'opacity-50 transform rotate-2 scale-105' : ''} transition-all duration-200`}
      >
        <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 border-l-4 border-purple-500 relative">
          {/* Priority indicator and menu */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{priorityIcons[task.priority]}</span>
              <span className={`w-2 h-2 rounded-full ${priorityColors[task.priority]}`}></span>
              <span className="text-xs font-medium text-gray-500 capitalize">{task.priority}</span>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="w-4 h-4 text-gray-500" />
              </button>
              {showMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowMenu(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit Task</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowDetails(true);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm"
                    >
                      <Info className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={() => {
                        onSmartAssign(task.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center space-x-2 text-sm"
                    >
                      <Zap className="w-4 h-4 text-yellow-500" />
                      <span>Smart Assign</span>
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        onDelete(task.id);
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 flex items-center space-x-2 text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Task content */}
          {isEditing ? (
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Task description"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-sm bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">{task.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">{task.description}</p>
              
              {/* Task footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {assignedUser && (
                    <>
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: assignedUser.color }}
                      >
                        {assignedUser.username[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-600 truncate max-w-20">{assignedUser.username}</span>
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-1 text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span className="text-xs">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Task Details</h3>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4 overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md">{task.title}</p>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900 bg-gray-50 p-2 rounded-md min-h-[60px] whitespace-pre-wrap">{task.description}</p>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{priorityIcons[task.priority]}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${priorityColors[task.priority]}`}>
                    {task.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {task.status.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              {/* Assigned User */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                {assignedUser && (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: assignedUser.color }}
                    >
                      {assignedUser.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{assignedUser.username}</p>
                      <p className="text-xs text-gray-500">{assignedUser.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Created By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created By</label>
                {createdUser && (
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: createdUser.color }}
                    >
                      {createdUser.username[0].toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{createdUser.username}</p>
                      <p className="text-xs text-gray-500">{createdUser.email}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <p className="text-sm text-gray-600">{new Date(task.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-sm text-gray-600">{new Date(task.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Version */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
                  v{task.version}
                </span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end space-x-2 p-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowDetails(false);
                  setIsEditing(true);
                }}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}models
    </>
  );
};
import React, { useState } from "react";
import { Plus } from "lucide-react";
import { Task, User, DragItem } from "../types";
import { TaskCard } from "./TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  users: User[];
  onCreateTask: (
    title: string,
    description: string,
    priority: "low" | "medium" | "high"
  ) => boolean;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onMoveTask: (
    taskId: string,
    newStatus: "todo" | "in-progress" | "done"
  ) => void;
  onDeleteTask: (taskId: string) => void;
  onSmartAssign: (taskId: string) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  users,
  onCreateTask,
  onUpdateTask,
  onMoveTask,
  onDeleteTask,
  onSmartAssign,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [error, setError] = useState("");

  const columns = [
    { id: "todo", title: "To Do", color: "bg-red-500" },
    { id: "in-progress", title: "In Progress", color: "bg-yellow-500" },
    { id: "done", title: "Done", color: "bg-green-500" },
  ];

  const handleCreateTask = () => {
    if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
      setError("Title and description are required");
      return;
    }

    const success = onCreateTask(
      newTaskTitle,
      newTaskDescription,
      newTaskPriority
    );
    if (success) {
      setNewTaskTitle("");
      setNewTaskDescription("");
      setNewTaskPriority("medium");
      setShowCreateForm(false);
      setError("");
    } else {
      setError("Task title must be unique and cannot match column names");
    }
  };

  const handleDragStart = (e: React.DragEvent, task: Task, index: number) => {
    const dragItem: DragItem = {
      id: task.id,
      status: task.status,
      index,
    };
    setDraggedItem(dragItem);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(columnId);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== columnId) {
      onMoveTask(draggedItem.id, columnId as "todo" | "in-progress" | "done");
    }
    setDraggedItem(null);
    setDragOverColumn(null);
  };

  const getTasksByStatus = (status: string) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="flex-1 p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((column) => (
            <div
              key={column.id}
              className={`bg-white rounded-lg shadow-sm border-2 transition-all duration-200 ${
                dragOverColumn === column.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200"
              }`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${column.color}`}
                    ></div>
                    <h2 className="text-lg font-semibold text-gray-800">
                      {column.title}
                    </h2>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                    {getTasksByStatus(column.id).length}
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-3 min-h-[400px]">
                {getTasksByStatus(column.id).map((task, index) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, index)}
                    className="cursor-move"
                  >
                    <TaskCard
                      task={task}
                      users={users}
                      onUpdate={onUpdateTask}
                      onDelete={onDeleteTask}
                      onSmartAssign={onSmartAssign}
                      isDragging={draggedItem?.id === task.id}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold mb-4">Create New Task</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newTaskDescription}
                    onChange={(e) => setNewTaskDescription(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    placeholder="Enter task description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={newTaskPriority}
                    onChange={(e) =>
                      setNewTaskPriority(
                        e.target.value as "low" | "medium" | "high"
                      )
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {error && <div className="text-red-600 text-sm">{error}</div>}

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setError("");
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateTask}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                  >
                    Create Task
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

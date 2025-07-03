import { useState, useEffect } from 'react';
import { Task, User, ActivityLog, TaskConflict } from '../types';

export const useKanban = (currentUser: User | null) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [conflicts, setConflicts] = useState<TaskConflict[]>([]);

  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedUsers = localStorage.getItem('users');
    const savedActivityLog = localStorage.getItem('activityLog');

    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedUsers) setUsers(JSON.parse(savedUsers));
    if (savedActivityLog) setActivityLog(JSON.parse(savedActivityLog));
  }, []);

  const addActivity = (action: string, taskId?: string, taskTitle?: string, details?: string) => {
    if (!currentUser) return;

    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      userId: currentUser.id,
      username: currentUser.username,
      action,
      taskId,
      taskTitle,
      timestamp: new Date(),
      details: details || '',
    };

    const updatedLog = [newActivity, ...activityLog].slice(0, 20);
    setActivityLog(updatedLog);
    localStorage.setItem('activityLog', JSON.stringify(updatedLog));
  };

  const createTask = (title: string, description: string, priority: 'low' | 'medium' | 'high') => {
    if (!currentUser) return false;

    // Validation: unique titles and no column names
    const columnNames = ['todo', 'in-progress', 'done'];
    if (tasks.some(task => task.title.toLowerCase() === title.toLowerCase()) || 
        columnNames.includes(title.toLowerCase())) {
      return false;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title,
      description,
      priority,
      assignedTo: currentUser.id,
      createdBy: currentUser.id,
      status: 'todo',
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    addActivity('created', newTask.id, newTask.title, `Created task "${title}"`);
    return true;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    if (!currentUser) return;

    const existingTask = tasks.find(t => t.id === taskId);
    if (!existingTask) return;

    // Check for conflicts
    const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const savedTask = savedTasks.find((t: Task) => t.id === taskId);
    
    if (savedTask && savedTask.version > existingTask.version) {
      const conflict: TaskConflict = {
        taskId,
        currentVersion: existingTask,
        incomingVersion: { ...existingTask, ...updates, version: existingTask.version + 1 },
        currentUser: currentUser.username,
        conflictingUser: users.find(u => u.id === savedTask.editedBy)?.username || 'Unknown',
      };
      setConflicts(prev => [...prev, conflict]);
      return;
    }

    const updatedTask = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
      editedBy: currentUser.id,
      version: existingTask.version + 1,
    };

    const updatedTasks = tasks.map(task => 
      task.id === taskId ? updatedTask : task
    );

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    addActivity('updated', taskId, updatedTask.title, `Updated task "${updatedTask.title}"`);
  };

  const moveTask = (taskId: string, newStatus: 'todo' | 'in-progress' | 'done') => {
    updateTask(taskId, { status: newStatus });
    addActivity('moved', taskId, tasks.find(t => t.id === taskId)?.title, 
      `Moved task to ${newStatus.replace('-', ' ')}`);
  };

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTasks = tasks.filter(t => t.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    addActivity('deleted', taskId, task.title, `Deleted task "${task.title}"`);
  };

  const smartAssign = (taskId: string) => {
    if (!currentUser) return;

    const activeTasks = tasks.filter(t => t.status !== 'done');
    const userTaskCounts = users.reduce((acc, user) => {
      acc[user.id] = activeTasks.filter(t => t.assignedTo === user.id).length;
      return acc;
    }, {} as Record<string, number>);

    const userWithFewestTasks = users.reduce((min, user) => 
      userTaskCounts[user.id] < userTaskCounts[min.id] ? user : min
    );

    updateTask(taskId, { assignedTo: userWithFewestTasks.id });
    addActivity('smart-assigned', taskId, tasks.find(t => t.id === taskId)?.title,
      `Smart assigned to ${userWithFewestTasks.username}`);
  };

  const resolveConflict = (taskId: string, resolution: 'merge' | 'overwrite', version: Task) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...version, version: version.version + 1 } : task
    );

    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setConflicts(prev => prev.filter(c => c.taskId !== taskId));
    addActivity('conflict-resolved', taskId, version.title, 
      `Resolved conflict with ${resolution}`);
  };

  return {
    tasks,
    users,
    activityLog,
    conflicts,
    createTask,
    updateTask,
    moveTask,
    deleteTask,
    smartAssign,
    resolveConflict,
  };
};
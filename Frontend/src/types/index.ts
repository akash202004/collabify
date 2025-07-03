export interface User {
    id: string;
    username: string;
    email: string;
    color: string;
    createdAt: Date;
  }
  
  export interface Task {
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    assignedTo: string;
    createdBy: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: Date;
    updatedAt: Date;
    editedBy?: string;
    version: number;
  }
  
  export interface ActivityLog {
    id: string;
    userId: string;
    username: string;
    action: string;
    taskId?: string;
    taskTitle?: string;
    timestamp: Date;
    details: string;
  }
  
  export interface TaskConflict {
    taskId: string;
    currentVersion: Task;
    incomingVersion: Task;
    currentUser: string;
    conflictingUser: string;
  }
  
  export interface DragItem {
    id: string;
    status: string;
    index: number;
  }
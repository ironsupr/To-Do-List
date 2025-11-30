/**
 * Core type definitions for the Todo List Application
 */

export type TaskStatus = 'Pending' | 'InProgress' | 'Completed';
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  save(key: string, data: any): Promise<void>;
  load(key: string): Promise<any>;
  remove(key: string): Promise<void>;
  clear(): Promise<void>;
}

export interface ITaskRepository {
  create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task>;
  getById(id: string): Promise<Task | null>;
  getAll(): Promise<Task[]>;
  update(id: string, updates: Partial<Task>): Promise<Task>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
}

export interface ITaskService {
  addTask(description: string, priority?: TaskPriority, dueDate?: Date): Promise<Task>;
  completeTask(id: string): Promise<Task>;
  uncompleteTask(id: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  getAllTasks(): Promise<Task[]>;
  filterByStatus(status: TaskStatus): Promise<Task[]>;
  filterByPriority(priority: TaskPriority): Promise<Task[]>;
  search(query: string): Promise<Task[]>;
}

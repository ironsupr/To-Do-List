/**
 * Task Repository for data access
 */

import { ITaskRepository, IStorage, Task, TaskPriority, TaskStatus } from '../types';
import { TaskModel } from '../models/Task';

export class TaskRepository implements ITaskRepository {
  private storage: IStorage;
  private readonly STORAGE_KEY = 'tasks';

  constructor(storage: IStorage) {
    this.storage = storage;
  }

  async create(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask = new TaskModel(
      task.description,
      task.priority,
      task.dueDate,
      undefined,
      undefined,
      undefined,
      task.status
    );

    const allTasks = await this.getAll();
    allTasks.push(newTask);
    await this.storage.save(this.STORAGE_KEY, allTasks);

    return newTask;
  }

  async getById(id: string): Promise<Task | null> {
    const allTasks = await this.getAll();
    const task = allTasks.find(t => t.id === id);
    return task || null;
  }

  async getAll(): Promise<Task[]> {
    try {
      const data = await this.storage.load(this.STORAGE_KEY);
      if (!data) {
        return [];
      }

      if (!Array.isArray(data)) {
        return [];
      }

      return data.map(taskData => this.deserializeTask(taskData));
    } catch (error) {
      return [];
    }
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const allTasks = await this.getAll();
    const taskIndex = allTasks.findIndex(t => t.id === id);

    if (taskIndex === -1) {
      throw new Error(`Task with id ${id} not found`);
    }

    const task = allTasks[taskIndex];
    const updatedTask = {
      ...task,
      ...updates,
      id: task.id,
      createdAt: task.createdAt,
      updatedAt: new Date(),
    };

    allTasks[taskIndex] = updatedTask;
    await this.storage.save(this.STORAGE_KEY, allTasks);

    return updatedTask;
  }

  async delete(id: string): Promise<void> {
    const allTasks = await this.getAll();
    const filteredTasks = allTasks.filter(t => t.id !== id);
    await this.storage.save(this.STORAGE_KEY, filteredTasks);
  }

  async clear(): Promise<void> {
    await this.storage.save(this.STORAGE_KEY, []);
  }

  private deserializeTask(taskData: any): Task {
    return {
      id: taskData.id,
      description: taskData.description,
      status: taskData.status as TaskStatus,
      priority: taskData.priority as TaskPriority,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate) : undefined,
      createdAt: new Date(taskData.createdAt),
      updatedAt: new Date(taskData.updatedAt),
    };
  }
}

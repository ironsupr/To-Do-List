/**
 * Task Service for business logic
 */

import { ITaskService, ITaskRepository, Task, TaskStatus, TaskPriority } from '../types';
import { TaskModel } from '../models/Task';

export class TaskService implements ITaskService {
  private repository: ITaskRepository;

  constructor(repository: ITaskRepository) {
    this.repository = repository;
  }

  async addTask(
    description: string,
    priority: TaskPriority = 'Medium',
    dueDate?: Date
  ): Promise<Task> {
    TaskModel.validateDescription(description);

    return this.repository.create({
      description,
      priority,
      dueDate,
      status: 'Pending',
    });
  }

  async completeTask(id: string): Promise<Task> {
    const task = await this.repository.getById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    return this.repository.update(id, { status: 'Completed' });
  }

  async uncompleteTask(id: string): Promise<Task> {
    const task = await this.repository.getById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    return this.repository.update(id, { status: 'Pending' });
  }

  async deleteTask(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task> {
    const task = await this.repository.getById(id);
    if (!task) {
      throw new Error(`Task with id ${id} not found`);
    }

    if (updates.description) {
      TaskModel.validateDescription(updates.description);
    }

    if (updates.priority) {
      TaskModel.validatePriority(updates.priority);
    }

    return this.repository.update(id, updates);
  }

  async getAllTasks(): Promise<Task[]> {
    return this.repository.getAll();
  }

  async filterByStatus(status: TaskStatus): Promise<Task[]> {
    const allTasks = await this.repository.getAll();
    return allTasks.filter(task => task.status === status);
  }

  async filterByPriority(priority: TaskPriority): Promise<Task[]> {
    const allTasks = await this.repository.getAll();
    return allTasks.filter(task => task.priority === priority);
  }

  async search(query: string): Promise<Task[]> {
    const allTasks = await this.repository.getAll();
    const lowerQuery = query.toLowerCase();
    return allTasks.filter(task => task.description.toLowerCase().includes(lowerQuery));
  }
}

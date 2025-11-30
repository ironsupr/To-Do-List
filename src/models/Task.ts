/**
 * Task Model with validation
 */

import { v4 as uuidv4 } from 'uuid';
import { Task, TaskStatus, TaskPriority } from '../types';

export class TaskModel implements Task {
  id: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    description: string,
    priority: TaskPriority = 'Medium',
    dueDate?: Date,
    id?: string,
    createdAt?: Date,
    updatedAt?: Date,
    status: TaskStatus = 'Pending'
  ) {
    this.validateDescription(description);
    this.validatePriority(priority);
    if (dueDate) {
      this.validateDueDate(dueDate);
    }

    this.id = id || uuidv4();
    this.description = description;
    this.status = status;
    this.priority = priority;
    this.dueDate = dueDate;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  private validateDescription(description: string): void {
    if (!description || description.trim().length === 0) {
      throw new Error('Task description cannot be empty or contain only whitespace');
    }
    if (description.length > 500) {
      throw new Error('Task description cannot exceed 500 characters');
    }
  }

  private validatePriority(priority: TaskPriority): void {
    const validPriorities: TaskPriority[] = ['High', 'Medium', 'Low'];
    if (!validPriorities.includes(priority)) {
      throw new Error(`Invalid priority. Must be one of: ${validPriorities.join(', ')}`);
    }
  }

  private validateDueDate(dueDate: Date): void {
    if (!(dueDate instanceof Date) || isNaN(dueDate.getTime())) {
      throw new Error('Invalid due date');
    }
  }

  static validateDescription(description: string): boolean {
    return !!(description && description.trim().length > 0 && description.length <= 500);
  }

  static validatePriority(priority: string): boolean {
    return ['High', 'Medium', 'Low'].includes(priority);
  }

  static validateStatus(status: string): boolean {
    return ['Pending', 'InProgress', 'Completed'].includes(status);
  }
}

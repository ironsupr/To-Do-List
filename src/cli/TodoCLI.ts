/**
 * CLI interface for Todo List Application
 */

import { ITaskService, TaskPriority, TaskStatus } from '../types';

export class TodoCLI {
  private service: ITaskService;

  constructor(service: ITaskService) {
    this.service = service;
  }

  async displayAllTasks(): Promise<void> {
    const tasks = await this.service.getAllTasks();

    if (tasks.length === 0) {
      console.log('No tasks found.');
      return;
    }

    console.log('\n=== All Tasks ===');
    tasks.forEach((task, index) => {
      this.displayTask(task, index + 1);
    });
    console.log('');
  }

  async addTask(description: string, priority?: TaskPriority, dueDate?: Date): Promise<void> {
    try {
      const task = await this.service.addTask(description, priority, dueDate);
      console.log(`✓ Task added: "${task.description}" (ID: ${task.id})`);
    } catch (error) {
      console.error(`✗ Error adding task: ${error}`);
    }
  }

  async completeTask(id: string): Promise<void> {
    try {
      const task = await this.service.completeTask(id);
      console.log(`✓ Task completed: "${task.description}"`);
    } catch (error) {
      console.error(`✗ Error completing task: ${error}`);
    }
  }

  async uncompleteTask(id: string): Promise<void> {
    try {
      const task = await this.service.uncompleteTask(id);
      console.log(`✓ Task marked as pending: "${task.description}"`);
    } catch (error) {
      console.error(`✗ Error uncompleting task: ${error}`);
    }
  }

  async deleteTask(id: string): Promise<void> {
    try {
      await this.service.deleteTask(id);
      console.log(`✓ Task deleted (ID: ${id})`);
    } catch (error) {
      console.error(`✗ Error deleting task: ${error}`);
    }
  }

  async updateTask(id: string, updates: { description?: string; priority?: TaskPriority; dueDate?: Date }): Promise<void> {
    try {
      const task = await this.service.updateTask(id, updates);
      console.log(`✓ Task updated: "${task.description}"`);
    } catch (error) {
      console.error(`✗ Error updating task: ${error}`);
    }
  }

  async filterByStatus(status: TaskStatus): Promise<void> {
    const tasks = await this.service.filterByStatus(status);

    if (tasks.length === 0) {
      console.log(`No tasks with status "${status}".`);
      return;
    }

    console.log(`\n=== Tasks with status: ${status} ===`);
    tasks.forEach((task, index) => {
      this.displayTask(task, index + 1);
    });
    console.log('');
  }

  async filterByPriority(priority: TaskPriority): Promise<void> {
    const tasks = await this.service.filterByPriority(priority);

    if (tasks.length === 0) {
      console.log(`No tasks with priority "${priority}".`);
      return;
    }

    console.log(`\n=== Tasks with priority: ${priority} ===`);
    tasks.forEach((task, index) => {
      this.displayTask(task, index + 1);
    });
    console.log('');
  }

  async search(query: string): Promise<void> {
    const tasks = await this.service.search(query);

    if (tasks.length === 0) {
      console.log(`No tasks found matching "${query}".`);
      return;
    }

    console.log(`\n=== Search results for "${query}" ===`);
    tasks.forEach((task, index) => {
      this.displayTask(task, index + 1);
    });
    console.log('');
  }

  private displayTask(task: any, index: number): void {
    const status = task.status === 'Completed' ? '✓' : '○';
    const dueDate = task.dueDate ? ` (Due: ${new Date(task.dueDate).toLocaleDateString()})` : '';
    console.log(`${index}. [${status}] ${task.description} [${task.priority}]${dueDate}`);
    console.log(`   ID: ${task.id}`);
  }
}

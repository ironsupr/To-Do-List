/**
 * Property-based tests for TaskService filtering and search
 * **Feature: todo-list, Property 14: Status Filter Returns Matching Tasks**
 * **Validates: Requirements 6.1**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { TaskService } from './TaskService';
import { TaskRepository } from '../repository/TaskRepository';
import { LocalStorage } from '../storage/LocalStorage';
import { TaskPriority } from '../types';

describe('TaskService - Filtering and Search Property Tests', () => {
  // Property 14: Status Filter Returns Matching Tasks
  it('should return only tasks with the specified status', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const storage = new LocalStorage();
          const repository = new TaskRepository(storage);
          const service = new TaskService(repository);

          const task = await service.addTask(description, priority);
          await service.completeTask(task.id);

          const completedTasks = await service.filterByStatus('Completed');

          // All filtered tasks should have the correct status
          completedTasks.forEach(t => {
            expect(t.status).toBe('Completed');
          });

          // Should have found the task
          expect(completedTasks.some(t => t.id === task.id)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 15: Priority Filter Returns Matching Tasks
  it('should return only tasks with the specified priority', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const storage = new LocalStorage();
          const repository = new TaskRepository(storage);
          const service = new TaskService(repository);

          const task = await service.addTask(description, priority);

          const filteredTasks = await service.filterByPriority(priority);

          // All filtered tasks should have the correct priority
          filteredTasks.forEach(t => {
            expect(t.priority).toBe(priority);
          });

          // Should have found the task
          expect(filteredTasks.some(t => t.id === task.id)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 16: Clearing Filters Returns All Tasks
  it('should return all tasks when filters are cleared', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const storage = new LocalStorage();
          const repository = new TaskRepository(storage);
          const service = new TaskService(repository);

          const task = await service.addTask(description, priority);

          // Apply filters
          await service.filterByStatus('Pending');
          await service.filterByPriority('High');

          // Get all tasks (clearing filters)
          const allTasks = await service.getAllTasks();

          expect(allTasks.length).toBeGreaterThanOrEqual(1);
          expect(allTasks.some(t => t.id === task.id)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 17: Filters Don't Modify Storage
  it('should not modify storage when applying filters', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const storage = new LocalStorage();
          const repository = new TaskRepository(storage);
          const service = new TaskService(repository);

          const task = await service.addTask(description, priority);

          const beforeFilterCount = (await service.getAllTasks()).length;

          // Apply various filters
          await service.filterByStatus('Completed');
          await service.filterByPriority('High');

          const afterFilterCount = (await service.getAllTasks()).length;

          expect(afterFilterCount).toBe(beforeFilterCount);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 18: Search Returns Matching Tasks
  it('should return only tasks whose descriptions contain the search term', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0),
        async (description, priority, searchTerm) => {
          const storage = new LocalStorage();
          const repository = new TaskRepository(storage);
          const service = new TaskService(repository);

          // Create a task with the search term
          const taskWithTerm = await service.addTask(`${description} ${searchTerm}`, priority);

          const results = await service.search(searchTerm);

          // All results should contain the search term
          results.forEach(task => {
            expect(task.description.toLowerCase()).toContain(searchTerm.toLowerCase());
          });

          // Should have found the task we added with the term
          expect(results.some(t => t.id === taskWithTerm.id)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 19: Clearing Search Returns All Tasks
  it('should return all tasks when search is cleared', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0),
        async (description, priority, searchTerm) => {
          const storage = new LocalStorage();
          const repository = new TaskRepository(storage);
          const service = new TaskService(repository);

          const task = await service.addTask(description, priority);

          // Perform search
          await service.search(searchTerm);

          // Get all tasks (clearing search)
          const allTasks = await service.getAllTasks();

          expect(allTasks.length).toBeGreaterThanOrEqual(1);
          expect(allTasks.some(t => t.id === task.id)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 20: Search Is Case-Insensitive
  it('should perform case-insensitive search', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const storage = new LocalStorage();
          const repository = new TaskRepository(storage);
          const service = new TaskService(repository);

          const task = await service.addTask(description, priority);

          // Search with different cases
          const searchLower = description.substring(0, 3).toLowerCase();
          const searchUpper = description.substring(0, 3).toUpperCase();

          const resultsLower = await service.search(searchLower);
          const resultsUpper = await service.search(searchUpper);

          // All should find the task
          expect(resultsLower.some(t => t.id === task.id)).toBe(true);
          expect(resultsUpper.some(t => t.id === task.id)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});

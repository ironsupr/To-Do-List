/**
 * Property-based tests for TaskService
 * **Feature: todo-list, Property 5: Status Update Changes State**
 * **Validates: Requirements 3.1**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { TaskService } from './TaskService';
import { TaskRepository } from '../repository/TaskRepository';
import { LocalStorage } from '../storage/LocalStorage';
import { TaskPriority } from '../types';

describe('TaskService - Property Tests', () => {
  let service: TaskService;
  let repository: TaskRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage();
    repository = new TaskRepository(storage);
    service = new TaskService(repository);
  });

  // Property 5: Status Update Changes State
  it('should update task status to Completed', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const task = await service.addTask(description, priority);
          expect(task.status).toBe('Pending');

          const completed = await service.completeTask(task.id);
          expect(completed.status).toBe('Completed');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 6: Status Changes Persist
  it('should persist status changes to storage', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const task = await service.addTask(description, priority);
          await service.completeTask(task.id);

          const retrieved = await repository.getById(task.id);
          expect(retrieved?.status).toBe('Completed');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 7: Status Toggle Works Bidirectionally
  it('should toggle task status between Pending and Completed', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const task = await service.addTask(description, priority);
          expect(task.status).toBe('Pending');

          const completed = await service.completeTask(task.id);
          expect(completed.status).toBe('Completed');

          const uncompleted = await service.uncompleteTask(task.id);
          expect(uncompleted.status).toBe('Pending');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 11: Priority Can Be Set
  it('should set and retrieve task priority', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const task = await service.addTask(description, priority);
          expect(task.priority).toBe(priority);

          const retrieved = await repository.getById(task.id);
          expect(retrieved?.priority).toBe(priority);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 12: Due Date Can Be Set
  it('should set and retrieve task due date', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        fc.date(),
        async (description, priority, dueDate) => {
          const task = await service.addTask(description, priority, dueDate);
          expect(task.dueDate).toEqual(dueDate);

          const retrieved = await repository.getById(task.id);
          expect(retrieved?.dueDate).toEqual(dueDate);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 13: Updates Persist
  it('should persist task updates to storage', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority, newPriority) => {
          const task = await service.addTask(description, priority);
          await service.updateTask(task.id, { priority: newPriority });

          const retrieved = await repository.getById(task.id);
          expect(retrieved?.priority).toBe(newPriority);
        }
      ),
      { numRuns: 100 }
    );
  });
});

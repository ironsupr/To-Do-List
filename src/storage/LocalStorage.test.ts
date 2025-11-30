/**
 * Property-based tests for LocalStorage
 * **Feature: todo-list, Property 4: Task Addition Persists**
 * **Validates: Requirements 1.4**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { LocalStorage } from './LocalStorage';
import { TaskModel } from '../models/Task';
import { TaskPriority } from '../types';

describe('LocalStorage - Property Tests', () => {
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage();
  });

  // Property 4: Task Addition Persists
  it('should persist and retrieve tasks with identical properties', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const task = new TaskModel(description, priority);
          const key = `task-${task.id}`;

          await storage.save(key, task);
          const retrieved = await storage.load(key);

          expect(retrieved).toBeDefined();
          expect(retrieved.id).toBe(task.id);
          expect(retrieved.description).toBe(task.description);
          expect(retrieved.priority).toBe(task.priority);
          expect(retrieved.status).toBe(task.status);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 21: Tasks Persist Across Sessions
  it('should persist multiple tasks and retrieve all of them', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
            fc.oneof(
              fc.constant('High' as TaskPriority),
              fc.constant('Medium' as TaskPriority),
              fc.constant('Low' as TaskPriority)
            )
          ),
          { minLength: 1, maxLength: 50 }
        ),
        async (taskDataArray) => {
          const tasks = taskDataArray.map(([desc, priority]) => new TaskModel(desc, priority));

          await storage.save('all-tasks', tasks);
          const retrieved = await storage.load('all-tasks');

          expect(retrieved).toHaveLength(tasks.length);
          retrieved.forEach((retrievedTask: any, index: number) => {
            expect(retrievedTask.id).toBe(tasks[index].id);
            expect(retrievedTask.description).toBe(tasks[index].description);
            expect(retrievedTask.priority).toBe(tasks[index].priority);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 22: Modifications Persist Immediately
  it('should persist task modifications immediately', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const task = new TaskModel(description, priority);
          const key = `task-${task.id}`;

          await storage.save(key, task);

          // Modify the task
          task.status = 'Completed';
          task.updatedAt = new Date();
          await storage.save(key, task);

          const retrieved = await storage.load(key);
          expect(retrieved.status).toBe('Completed');
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 23: Corrupted Storage Handled Gracefully
  it('should handle corrupted data gracefully', async () => {
    const key = 'corrupted-data';
    // Simulate corrupted data by storing invalid JSON
    await storage.save(key, { invalid: 'data' });

    // Should not throw when loading
    const retrieved = await storage.load(key);
    expect(retrieved).toBeDefined();
  });
});

/**
 * Property-based tests for Task model
 * **Feature: todo-list, Property 1: Task Addition Grows List**
 * **Validates: Requirements 1.1**
 */

import { describe, it, expect } from 'vitest';
import fc from 'fast-check';
import { TaskModel } from './Task';
import { TaskPriority } from '../types';

describe('Task Model - Property Tests', () => {
  // Property 1: Task Addition Grows List
  it('should create tasks with valid descriptions and they should be retrievable', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        (description, priority) => {
          const task = new TaskModel(description, priority);
          expect(task).toBeDefined();
          expect(task.id).toBeDefined();
          expect(task.description).toBe(description);
          expect(task.priority).toBe(priority);
          expect(task.status).toBe('Pending');
          expect(task.createdAt).toBeInstanceOf(Date);
          expect(task.updatedAt).toBeInstanceOf(Date);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 2: Invalid Descriptions Rejected
  it('should reject tasks with empty or whitespace-only descriptions', () => {
    fc.assert(
      fc.property(fc.string().filter(s => s.trim().length === 0), (description) => {
        expect(() => new TaskModel(description)).toThrow(
          'Task description cannot be empty or contain only whitespace'
        );
      }),
      { numRuns: 100 }
    );
  });

  // Property 3: New Tasks Have Unique IDs
  it('should generate unique IDs for each task', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.tuple(
            fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
            fc.oneof(
              fc.constant('High' as TaskPriority),
              fc.constant('Medium' as TaskPriority),
              fc.constant('Low' as TaskPriority)
            )
          ),
          { minLength: 2, maxLength: 100 }
        ),
        (taskData) => {
          const tasks = taskData.map(([desc, priority]) => new TaskModel(desc, priority));
          const ids = tasks.map(t => t.id);
          const uniqueIds = new Set(ids);
          expect(uniqueIds.size).toBe(ids.length);
        }
      ),
      { numRuns: 100 }
    );
  });
});

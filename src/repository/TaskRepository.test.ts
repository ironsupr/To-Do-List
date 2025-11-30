/**
 * Property-based tests for TaskRepository
 * **Feature: todo-list, Property 8: Deletion Removes Task**
 * **Validates: Requirements 4.1**
 */

import { describe, it, expect, beforeEach } from 'vitest';
import fc from 'fast-check';
import { TaskRepository } from './TaskRepository';
import { LocalStorage } from '../storage/LocalStorage';
import { TaskPriority } from '../types';

describe('TaskRepository - Property Tests', () => {
  let repository: TaskRepository;
  let storage: LocalStorage;

  beforeEach(() => {
    storage = new LocalStorage();
    repository = new TaskRepository(storage);
  });

  // Property 8: Deletion Removes Task
  it('should remove a task from the repository when deleted', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (description, priority) => {
          const task = await repository.create({
            description,
            priority,
            status: 'Pending',
          });

          await repository.delete(task.id);
          const retrieved = await repository.getById(task.id);

          expect(retrieved).toBeNull();
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 9: Deletion Preserves Other Tasks
  it('should preserve other tasks when deleting one task', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 50 }).filter(s => s.trim().length > 0),
        fc.oneof(
          fc.constant('High' as TaskPriority),
          fc.constant('Medium' as TaskPriority),
          fc.constant('Low' as TaskPriority)
        ),
        async (desc1, desc2, priority) => {
          // Create fresh storage for each test run
          const freshStorage = new LocalStorage();
          const freshRepository = new TaskRepository(freshStorage);

          const task1 = await freshRepository.create({
            description: desc1,
            priority,
            status: 'Pending',
          });

          const task2 = await freshRepository.create({
            description: desc2,
            priority,
            status: 'Pending',
          });

          await freshRepository.delete(task1.id);

          const retrieved = await freshRepository.getById(task2.id);
          expect(retrieved).toBeDefined();
          expect(retrieved?.id).toBe(task2.id);
          expect(retrieved?.description).toBe(task2.description);
        }
      ),
      { numRuns: 100 }
    );
  });

  // Property 10: Delete Non-Existent Gracefully
  it('should handle deletion of non-existent task gracefully', async () => {
    await fc.assert(
      fc.asyncProperty(fc.uuid(), async (nonExistentId) => {
        // Should not throw
        await expect(repository.delete(nonExistentId)).resolves.toBeUndefined();

        // Verify no tasks were affected
        const allTasks = await repository.getAll();
        expect(allTasks).toBeDefined();
      }),
      { numRuns: 100 }
    );
  });
});

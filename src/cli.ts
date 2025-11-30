/**
 * CLI Entry Point for Todo List Application
 */

import { createApp } from './app';
import { TaskPriority } from './types';

async function main() {
  const { service, cli } = await createApp();

  // Example usage demonstrating all features
  console.log('🚀 Todo List Application Started\n');

  // Add some tasks
  console.log('📝 Adding tasks...');
  const task1 = await service.addTask('Complete project documentation', 'High');
  const task2 = await service.addTask('Review pull requests', 'Medium');
  const task3 = await service.addTask('Update dependencies', 'Low');
  const task4 = await service.addTask('Write unit tests for API', 'High');

  // Display all tasks
  console.log('\n📋 All Tasks:');
  await cli.displayAllTasks();

  // Complete a task
  console.log('✅ Marking task as complete...');
  await service.completeTask(task1.id);

  // Filter by status
  console.log('\n🔍 Filtering by status (Completed):');
  await cli.filterByStatus('Completed');

  console.log('🔍 Filtering by status (Pending):');
  await cli.filterByStatus('Pending');

  // Filter by priority
  console.log('🔍 Filtering by priority (High):');
  await cli.filterByPriority('High');

  // Search
  console.log('🔍 Searching for "tests":');
  await cli.search('tests');

  // Update a task
  console.log('✏️ Updating task priority...');
  await service.updateTask(task3.id, { priority: 'High' as TaskPriority });

  // Display all tasks again
  console.log('\n📋 All Tasks (After Updates):');
  await cli.displayAllTasks();

  // Delete a task
  console.log('🗑️ Deleting a task...');
  await service.deleteTask(task2.id);

  // Final display
  console.log('\n📋 Final Task List:');
  await cli.displayAllTasks();

  console.log('✨ Demo completed successfully!');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});

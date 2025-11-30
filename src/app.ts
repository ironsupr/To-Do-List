/**
 * Main application entry point
 */

import { LocalStorage } from './storage/LocalStorage';
import { TaskRepository } from './repository/TaskRepository';
import { TaskService } from './services/TaskService';
import { TodoCLI } from './cli/TodoCLI';

export async function createApp() {
  const storage = new LocalStorage();
  const repository = new TaskRepository(storage);
  const service = new TaskService(repository);
  const cli = new TodoCLI(service);

  return { storage, repository, service, cli };
}

export { LocalStorage, TaskRepository, TaskService, TodoCLI };

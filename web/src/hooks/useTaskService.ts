import { useEffect, useState } from 'react'
import { TaskService } from '../../../src/services/TaskService'
import { TaskRepository } from '../../../src/repository/TaskRepository'
import { LocalStorage } from '../../../src/storage/LocalStorage'

export function useTaskService(): TaskService | null {
  const [service, setService] = useState<TaskService | null>(null)

  useEffect(() => {
    const storage = new LocalStorage()
    const repository = new TaskRepository(storage)
    const taskService = new TaskService(repository)
    setService(taskService)
  }, [])

  return service
}

import { useState, useEffect } from 'react'
import TaskList from './components/TaskList'
import TaskForm from './components/TaskForm'
import FilterBar from './components/FilterBar'
import { useTaskService } from './hooks/useTaskService'
import { Task, TaskPriority, TaskStatus } from '../../src/types'
import './App.css'

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | null>(null)
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | null>(null)
  const service = useTaskService()

  // Load tasks on mount
  useEffect(() => {
    if (service) {
      loadTasks(service)
    }
  }, [service])

  // Load all tasks
  const loadTasks = async (taskService: TaskService) => {
    const allTasks = await taskService.getAllTasks()
    setTasks(allTasks)
    applyFilters(allTasks, searchQuery, statusFilter, priorityFilter)
  }

  // Apply filters
  const applyFilters = (
    tasksToFilter: Task[],
    search: string,
    status: TaskStatus | null,
    priority: TaskPriority | null
  ) => {
    let result = tasksToFilter

    if (search) {
      result = result.filter(task =>
        task.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (status) {
      result = result.filter(task => task.status === status)
    }

    if (priority) {
      result = result.filter(task => task.priority === priority)
    }

    setFilteredTasks(result)
  }

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    applyFilters(tasks, query, statusFilter, priorityFilter)
  }

  // Handle status filter
  const handleStatusFilter = (status: TaskStatus | null) => {
    setStatusFilter(status)
    applyFilters(tasks, searchQuery, status, priorityFilter)
  }

  // Handle priority filter
  const handlePriorityFilter = (priority: TaskPriority | null) => {
    setPriorityFilter(priority)
    applyFilters(tasks, searchQuery, statusFilter, priority)
  }

  // Add task
  const handleAddTask = async (description: string, priority: TaskPriority, dueDate?: Date) => {
    if (!service) return
    const newTask = await service.addTask(description, priority, dueDate)
    const updatedTasks = [...tasks, newTask]
    setTasks(updatedTasks)
    applyFilters(updatedTasks, searchQuery, statusFilter, priorityFilter)
  }

  // Complete task
  const handleCompleteTask = async (id: string) => {
    if (!service) return
    await service.completeTask(id)
    await loadTasks(service)
  }

  // Uncomplete task
  const handleUncompleteTask = async (id: string) => {
    if (!service) return
    await service.uncompleteTask(id)
    await loadTasks(service)
  }

  // Delete task
  const handleDeleteTask = async (id: string) => {
    if (!service) return
    await service.deleteTask(id)
    await loadTasks(service)
  }

  // Update task
  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    if (!service) return
    await service.updateTask(id, updates)
    await loadTasks(service)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📝 Todo List</h1>
          <p>Organize your tasks efficiently</p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          <TaskForm onAddTask={handleAddTask} />

          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={handleSearch}
            statusFilter={statusFilter}
            onStatusFilterChange={handleStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityFilterChange={handlePriorityFilter}
            totalTasks={tasks.length}
            filteredTasks={filteredTasks.length}
          />

          <TaskList
            tasks={filteredTasks}
            onCompleteTask={handleCompleteTask}
            onUncompleteTask={handleUncompleteTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
          />
        </div>
      </main>

      <footer className="app-footer">
        <p>© 2025 Todo List Application | Built with React & TypeScript</p>
      </footer>
    </div>
  )
}

export default App

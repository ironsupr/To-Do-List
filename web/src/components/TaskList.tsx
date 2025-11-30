import { Task } from '../../../../src/types'
import TaskItem from './TaskItem'
import './TaskList.css'

interface TaskListProps {
  tasks: Task[]
  onCompleteTask: (id: string) => void
  onUncompleteTask: (id: string) => void
  onDeleteTask: (id: string) => void
  onUpdateTask: (id: string, updates: Partial<Task>) => void
}

export default function TaskList({
  tasks,
  onCompleteTask,
  onUncompleteTask,
  onDeleteTask,
  onUpdateTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <h3>No tasks found</h3>
        <p>Create a new task or adjust your filters to get started!</p>
      </div>
    )
  }

  return (
    <div className="task-list">
      <div className="task-list-header">
        <h2>Tasks ({tasks.length})</h2>
      </div>
      <div className="tasks-container">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={onCompleteTask}
            onUncomplete={onUncompleteTask}
            onDelete={onDeleteTask}
            onUpdate={onUpdateTask}
          />
        ))}
      </div>
    </div>
  )
}

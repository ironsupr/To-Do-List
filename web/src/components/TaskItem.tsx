import { useState } from 'react'
import { Task, TaskPriority } from '../../../../src/types'
import './TaskItem.css'

interface TaskItemProps {
  task: Task
  onComplete: (id: string) => void
  onUncomplete: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, updates: Partial<Task>) => void
}

export default function TaskItem({
  task,
  onComplete,
  onUncomplete,
  onDelete,
  onUpdate,
}: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedPriority, setEditedPriority] = useState<TaskPriority>(task.priority)

  const handleToggleComplete = () => {
    if (task.status === 'Completed') {
      onUncomplete(task.id)
    } else {
      onComplete(task.id)
    }
  }

  const handleSavePriority = () => {
    if (editedPriority !== task.priority) {
      onUpdate(task.id, { priority: editedPriority })
    }
    setIsEditing(false)
  }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 'priority-high'
      case 'Medium':
        return 'priority-medium'
      case 'Low':
        return 'priority-low'
    }
  }

  const getStatusIcon = () => {
    switch (task.status) {
      case 'Completed':
        return '✓'
      case 'InProgress':
        return '⟳'
      default:
        return '○'
    }
  }

  const formatDate = (date?: Date) => {
    if (!date) return null
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className={`task-item ${task.status === 'Completed' ? 'completed' : ''}`}>
      <div className="task-checkbox">
        <button
          className={`checkbox ${task.status === 'Completed' ? 'checked' : ''}`}
          onClick={handleToggleComplete}
          title={task.status === 'Completed' ? 'Mark as pending' : 'Mark as complete'}
        >
          {getStatusIcon()}
        </button>
      </div>

      <div className="task-content">
        <div className="task-description">{task.description}</div>
        {task.dueDate && (
          <div className="task-due-date">
            📅 {formatDate(task.dueDate)}
          </div>
        )}
      </div>

      <div className="task-priority">
        {isEditing ? (
          <div className="priority-edit">
            <select
              value={editedPriority}
              onChange={(e) => setEditedPriority(e.target.value as TaskPriority)}
              className="priority-select"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <button onClick={handleSavePriority} className="btn-save">
              ✓
            </button>
            <button onClick={() => setIsEditing(false)} className="btn-cancel">
              ✕
            </button>
          </div>
        ) : (
          <button
            className={`priority-badge ${getPriorityColor(task.priority)}`}
            onClick={() => setIsEditing(true)}
            title="Click to edit priority"
          >
            {task.priority}
          </button>
        )}
      </div>

      <div className="task-actions">
        <button
          className="btn-delete"
          onClick={() => onDelete(task.id)}
          title="Delete task"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

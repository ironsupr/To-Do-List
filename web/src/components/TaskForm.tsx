import { useState } from 'react'
import { TaskPriority } from '../../../../src/types'
import './TaskForm.css'

interface TaskFormProps {
  onAddTask: (description: string, priority: TaskPriority, dueDate?: Date) => void
}

export default function TaskForm({ onAddTask }: TaskFormProps) {
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('Medium')
  const [dueDate, setDueDate] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!description.trim()) {
      setError('Task description cannot be empty')
      return
    }

    const dueDateObj = dueDate ? new Date(dueDate) : undefined
    onAddTask(description, priority, dueDateObj)

    setDescription('')
    setPriority('Medium')
    setDueDate('')
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h2>Add New Task</h2>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="form-group">
        <label htmlFor="description">Task Description</label>
        <input
          id="description"
          type="text"
          placeholder="What needs to be done?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          className="form-input"
        />
        <span className="char-count">{description.length}/500</span>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            className="form-select"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date (Optional)</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="form-input"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg">
        ➕ Add Task
      </button>
    </form>
  )
}

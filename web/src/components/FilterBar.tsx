import { TaskStatus, TaskPriority } from '../../../../src/types'
import './FilterBar.css'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  statusFilter: TaskStatus | null
  onStatusFilterChange: (status: TaskStatus | null) => void
  priorityFilter: TaskPriority | null
  onPriorityFilterChange: (priority: TaskPriority | null) => void
  totalTasks: number
  filteredTasks: number
}

export default function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  totalTasks,
  filteredTasks,
}: FilterBarProps) {
  const handleClearFilters = () => {
    onSearchChange('')
    onStatusFilterChange(null)
    onPriorityFilterChange(null)
  }

  const hasActiveFilters = searchQuery || statusFilter || priorityFilter

  return (
    <div className="filter-bar">
      <div className="filter-search">
        <input
          type="text"
          placeholder="🔍 Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filter-controls">
        <div className="filter-group">
          <label>Status</label>
          <select
            value={statusFilter || ''}
            onChange={(e) => onStatusFilterChange((e.target.value as TaskStatus) || null)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Priority</label>
          <select
            value={priorityFilter || ''}
            onChange={(e) => onPriorityFilterChange((e.target.value as TaskPriority) || null)}
            className="filter-select"
          >
            <option value="">All Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button onClick={handleClearFilters} className="btn-clear">
            ✕ Clear Filters
          </button>
        )}
      </div>

      <div className="filter-stats">
        <span className="stat">
          {filteredTasks} of {totalTasks} tasks
        </span>
      </div>
    </div>
  )
}

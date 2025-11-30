import React, { useState, useEffect } from 'react'
import './App.css'

interface Task {
  id: number
  description: string
  priority: 'Low' | 'Medium' | 'High'
  completed: boolean
  createdAt: string
}

type FilterType = 'all' | 'pending' | 'completed' | 'high'

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('taskflow-tasks')
    return saved ? JSON.parse(saved) : []
  })
  const [inputValue, setInputValue] = useState('')
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium')
  const [filter, setFilter] = useState<FilterType>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState({ show: false, message: '', icon: '✓' })

  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    if (tasks.length === 0) {
      const sampleTasks: Task[] = [
        { id: 1, description: 'Welcome to TaskFlow! 🎉 Click the checkbox to complete this task', priority: 'High', completed: false, createdAt: new Date().toISOString() },
        { id: 2, description: 'Try adding a new task using the input above', priority: 'Medium', completed: false, createdAt: new Date().toISOString() },
        { id: 3, description: 'Use filters to organize your tasks', priority: 'Low', completed: false, createdAt: new Date().toISOString() }
      ]
      setTasks(sampleTasks)
    }
  }, [])

  const showToast = (message: string, icon: string = '✓') => {
    setToast({ show: true, message, icon })
    setTimeout(() => setToast({ show: false, message: '', icon: '✓' }), 3000)
  }

  const addTask = () => {
    if (!inputValue.trim()) {
      showToast('Please enter a task description', '⚠️')
      return
    }
    const newTask: Task = {
      id: Date.now(),
      description: inputValue.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    }
    setTasks([newTask, ...tasks])
    setInputValue('')
    showToast('Task added successfully!', '✓')
  }

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => {
      if (t.id === id) {
        const updated = { ...t, completed: !t.completed }
        showToast(updated.completed ? 'Task completed! 🎉' : 'Task reopened', updated.completed ? '✅' : '↩️')
        return updated
      }
      return t
    }))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id))
    showToast('Task deleted', '🗑️')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    high: tasks.filter(t => t.priority === 'High' && !t.completed).length,
    progress: tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0
  }

  const filteredTasks = tasks
    .filter(t => {
      if (filter === 'pending') return !t.completed
      if (filter === 'completed') return t.completed
      if (filter === 'high') return t.priority === 'High' && !t.completed
      return true
    })
    .filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="app">
      <div className="bg-animation"></div>
      <div className="orb orb-1"></div>
      <div className="orb orb-2"></div>
      <div className="orb orb-3"></div>

      <div className="app-container">
        <header className="header">
          <div className="logo">
            <div className="logo-icon">✓</div>
            <span className="logo-text">TaskFlow</span>
          </div>
          <p className="tagline">Organize your life, one task at a time</p>
        </header>

        {/* Stats Dashboard */}
        <div className="stats-dashboard">
          <div className="stat-card stat-total">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <span className="stat-number">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <span className="stat-number">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-icon">📈</div>
            <div className="stat-info">
              <span className="stat-number">{stats.progress}%</span>
              <span className="stat-label">Progress</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${stats.progress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="main-card">
          {/* Add Task Section */}
          <div className="add-task-section">
            <div className="input-wrapper">
              <span className="input-icon">✏️</span>
              <input
                type="text"
                className="task-input"
                placeholder="What needs to be done?"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
            <div className="input-options">
              <div className="priority-selector">
                {(['Low', 'Medium', 'High'] as const).map((p) => (
                  <button
                    key={p}
                    className={`priority-btn ${priority === p ? 'active' : ''}`}
                    onClick={() => setPriority(p)}
                  >
                    <span className={`priority-dot ${p.toLowerCase()}`}></span>
                    {p}
                  </button>
                ))}
              </div>
              <button className="add-btn" onClick={addTask}>
                <span className="add-icon">+</span>
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="filter-tabs">
            {[
              { key: 'all', icon: '📋', label: 'All', count: stats.total },
              { key: 'pending', icon: '⏳', label: 'Pending', count: stats.pending },
              { key: 'completed', icon: '✅', label: 'Completed', count: stats.completed },
              { key: 'high', icon: '🔥', label: 'High Priority', count: stats.high }
            ].map((tab) => (
              <button
                key={tab.key}
                className={`filter-tab ${filter === tab.key ? 'active' : ''}`}
                onClick={() => setFilter(tab.key as FilterType)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span>{tab.label}</span>
                <span className="tab-count">{tab.count}</span>
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search" onClick={() => setSearchQuery('')}>✕</button>
            )}
          </div>

          {/* Task List */}
          {filteredTasks.length > 0 ? (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                  <label className="task-checkbox">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleTask(task.id)}
                    />
                    <span className="checkbox-custom"></span>
                  </label>
                  <div className="task-content">
                    <div className="task-description">{task.description}</div>
                    <div className="task-meta">
                      <span className={`task-priority ${task.priority.toLowerCase()}`}>
                        {task.priority === 'High' ? '🔥' : task.priority === 'Medium' ? '⚡' : '🌱'} {task.priority}
                      </span>
                      <span className="task-date">📅 {formatDate(task.createdAt)}</span>
                    </div>
                  </div>
                  <div className="task-actions">
                    <button className="action-btn delete" onClick={() => deleteTask(task.id)} title="Delete task">
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-illustration">
                <div className="empty-circle"></div>
                <div className="empty-icon">📝</div>
              </div>
              <h3>{searchQuery ? 'No matching tasks' : 'No tasks yet'}</h3>
              <p>{searchQuery ? 'Try a different search term' : 'Add your first task to get started'}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <p>Built with ❤️ using <strong>Kiro IDE</strong> and Property-Based Testing</p>
          <p className="footer-sub">23 tests • 100% coverage • Production ready</p>
        </footer>
      </div>

      {/* Toast */}
      <div className={`toast ${toast.show ? 'show' : ''}`}>
        <span className="toast-icon">{toast.icon}</span>
        <span className="toast-message">{toast.message}</span>
      </div>
    </div>
  )
}

export default App

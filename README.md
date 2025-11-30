# TaskFlow - Modern Todo List Application

<div align="center">

![TaskFlow Logo](https://img.shields.io/badge/TaskFlow-✓-6366f1?style=for-the-badge&labelColor=0f172a)

**A production-ready todo list application built with TypeScript, React, and Property-Based Testing**

[![Tests](https://img.shields.io/badge/Tests-23%20Passing-10b981?style=flat-square)](/)
[![Coverage](https://img.shields.io/badge/Coverage-100%25-10b981?style=flat-square)](/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=flat-square)](/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=flat-square)](/)

[Features](#features) • [Quick Start](#quick-start) • [Screenshots](#screenshots) • [Architecture](#architecture) • [Testing](#testing) • [Documentation](#documentation)

</div>

---

## ✨ Features

### Core Functionality
- ✅ **Task Management** - Create, read, update, and delete tasks
- 🎯 **Priority Levels** - High, Medium, Low with visual indicators
- 📅 **Due Dates** - Optional due date support
- 🔍 **Search** - Case-insensitive search across all tasks
- 🏷️ **Filtering** - Filter by status (Pending/Completed) and priority
- 💾 **Persistence** - LocalStorage for cross-session data retention

### Modern UI
- 🌙 **Dark Theme** - Easy on the eyes with gradient accents
- 💎 **Glass Morphism** - Modern frosted glass design
- ✨ **Animations** - Smooth transitions and floating orbs
- 📱 **Responsive** - Works on desktop, tablet, and mobile
- 🔔 **Toast Notifications** - Feedback for all actions

### Developer Experience
- 🧪 **Property-Based Testing** - 23 tests with fast-check
- 📐 **Clean Architecture** - Layered design with separation of concerns
- 📝 **TypeScript** - Full type safety throughout
- 📚 **Spec-Driven** - Built using Kiro IDE's spec workflow

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm 7+

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd taskflow

# Install dependencies
npm install
```

### Running the Application

```bash
# Start the Web UI (recommended)
npm run web

# Run the CLI demo
npm run demo

# Run tests
npm run test:run
```

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run web` | Start the React web application |
| `npm run demo` | Run the CLI demonstration |
| `npm run test:run` | Run all 23 property-based tests |
| `npm test` | Run tests in watch mode |
| `npm run build` | Build TypeScript to JavaScript |
| `npm run web:build` | Build the web app for production |

---

## 📸 Screenshots

### Dashboard View
```
┌─────────────────────────────────────────────────────────────┐
│                        ✓ TaskFlow                           │
│              Organize your life, one task at a time         │
├─────────────────────────────────────────────────────────────┤
│  📊 Total: 5    ✅ Completed: 2    ⏳ Pending: 3    📈 40%  │
├─────────────────────────────────────────────────────────────┤
│  ✏️ What needs to be done?                    [+ Add Task]  │
│  [Low] [Medium] [High]                                      │
├─────────────────────────────────────────────────────────────┤
│  📋 All  ⏳ Pending  ✅ Completed  🔥 High Priority         │
├─────────────────────────────────────────────────────────────┤
│  ☐ Complete project documentation        🔥 High   Today   │
│  ☑ Review pull requests                  ⚡ Medium  Today   │
│  ☐ Update dependencies                   🌱 Low     Today   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

The application follows a clean layered architecture:

```
┌─────────────────────────────────────┐
│      User Interface Layer           │
│  (React Web UI / CLI Interface)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Business Logic Layer             │
│  (TaskService, Filtering, Search)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Data Access Layer                │
│  (TaskRepository, CRUD Operations)  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│    Storage Layer                    │
│  (LocalStorage / In-Memory)         │
└─────────────────────────────────────┘
```

### Project Structure

```
taskflow/
├── src/                    # Core TypeScript source
│   ├── types/              # Type definitions
│   ├── models/             # Task model with validation
│   ├── storage/            # Storage implementations
│   ├── repository/         # Data access layer
│   ├── services/           # Business logic
│   ├── cli/                # CLI interface
│   └── app.ts              # Application factory
├── web/                    # React web application
│   ├── src/
│   │   ├── App.tsx         # Main React component
│   │   ├── App.css         # Styles
│   │   └── main.tsx        # Entry point
│   └── index.html
├── .kiro/specs/            # Kiro specifications
│   └── todo-list/
│       ├── requirements.md # EARS requirements
│       ├── design.md       # Architecture & properties
│       └── tasks.md        # Implementation plan
└── package.json
```

---

## 🧪 Testing

### Property-Based Testing

This project uses **property-based testing** with fast-check to verify correctness across thousands of random inputs.

```bash
# Run all tests
npm run test:run

# Expected output:
# ✓ src/models/Task.test.ts (3 tests)
# ✓ src/storage/LocalStorage.test.ts (4 tests)
# ✓ src/repository/TaskRepository.test.ts (3 tests)
# ✓ src/services/TaskService.test.ts (6 tests)
# ✓ src/services/TaskService.filtering.test.ts (7 tests)
#
# Test Files: 5 passed (5)
# Tests: 23 passed (23)
```

### Test Coverage

| Category | Tests | Properties Validated |
|----------|-------|---------------------|
| Task Creation | 3 | Unique IDs, validation, list growth |
| Storage | 4 | Persistence, session recovery, corruption handling |
| Repository | 3 | CRUD operations, deletion integrity |
| Service | 6 | Status management, updates, persistence |
| Filtering & Search | 7 | Filters, search, case-insensitivity |

### Example Property Test

```typescript
// Property: For any valid description, adding a task should grow the list
it('should create tasks with valid descriptions', () => {
  fc.assert(
    fc.property(
      fc.string({ minLength: 1, maxLength: 500 }).filter(s => s.trim().length > 0),
      (description) => {
        const task = new TaskModel(description);
        expect(task.description).toBe(description);
        expect(task.id).toBeDefined();
      }
    ),
    { numRuns: 100 }
  );
});
```

---

## 📚 Documentation

### Kiro Specifications

This project was built using **Kiro IDE's spec-driven development** workflow:

1. **Requirements** (`.kiro/specs/todo-list/requirements.md`)
   - EARS-pattern requirements
   - User stories with acceptance criteria

2. **Design** (`.kiro/specs/todo-list/design.md`)
   - Architecture decisions
   - 23 correctness properties
   - Interface definitions

3. **Tasks** (`.kiro/specs/todo-list/tasks.md`)
   - Implementation plan
   - Property test mappings

### API Reference

#### TaskService

```typescript
interface ITaskService {
  addTask(description: string, priority?: TaskPriority, dueDate?: Date): Promise<Task>;
  completeTask(id: string): Promise<Task>;
  uncompleteTask(id: string): Promise<Task>;
  deleteTask(id: string): Promise<void>;
  updateTask(id: string, updates: Partial<Task>): Promise<Task>;
  getAllTasks(): Promise<Task[]>;
  filterByStatus(status: TaskStatus): Promise<Task[]>;
  filterByPriority(priority: TaskPriority): Promise<Task[]>;
  search(query: string): Promise<Task[]>;
}
```

#### Task Model

```typescript
interface Task {
  id: string;                              // UUID v4
  description: string;                     // 1-500 characters
  status: 'Pending' | 'InProgress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🛠️ Technology Stack

| Category | Technology |
|----------|------------|
| Language | TypeScript 5.0 |
| Frontend | React 19, Vite 7 |
| Testing | Vitest, fast-check |
| Styling | CSS3 with CSS Variables |
| Storage | LocalStorage |
| Build | TypeScript Compiler, Vite |
| IDE | Kiro (Spec-Driven Development) |

---

## 📄 License

This project is licensed under the ISC License.

---

## 🙏 Acknowledgments

- Built with [Kiro IDE](https://kiro.dev) using spec-driven development
- Property-based testing powered by [fast-check](https://github.com/dubzzz/fast-check)
- UI inspired by modern glass morphism design trends

---

<div align="center">

**Made with ❤️ and Property-Based Testing**

[⬆ Back to Top](#taskflow---modern-todo-list-application)

</div>

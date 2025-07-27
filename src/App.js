import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, Check, X, Calendar, Tag, Filter } from 'lucide-react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('general');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editCategory, setEditCategory] = useState('general');
  const [editDueDate, setEditDueDate] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('created');

  useEffect(() => {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      const sampleTasks = [
        {
          id: 1,
          text: 'Complete project documentation',
          completed: false,
          priority: 'high',
          category: 'work',
          dueDate: '2025-07-30',
          createdAt: new Date('2025-07-25').toISOString()
        },
        {
          id: 2,
          text: 'Buy groceries',
          completed: false,
          priority: 'medium',
          category: 'personal',
          dueDate: '2025-07-28',
          createdAt: new Date('2025-07-26').toISOString()
        }
      ];
      setTasks(sampleTasks);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === '') return;
    
    const task = {
      id: Date.now(),
      text: newTask.trim(),
      completed: false,
      priority: newTaskPriority,
      category: newTaskCategory,
      dueDate: newTaskDueDate,
      createdAt: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, task]);
    setNewTask('');
    setNewTaskPriority('medium');
    setNewTaskCategory('general');
    setNewTaskDueDate('');
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditText(task.text);
    setEditPriority(task.priority);
    setEditCategory(task.category);
    setEditDueDate(task.dueDate);
  };

  const saveEdit = () => {
    if (editText.trim() === '') return;
    
    setTasks(prev => prev.map(task => 
      task.id === editingTask 
        ? { 
            ...task, 
            text: editText.trim(),
            priority: editPriority,
            category: editCategory,
            dueDate: editDueDate
          }
        : task
    ));
    
    cancelEdit();
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditText('');
    setEditPriority('medium');
    setEditCategory('general');
    setEditDueDate('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return 'priority-default';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'work': return 'category-work';
      case 'personal': return 'category-personal';
      case 'shopping': return 'category-shopping';
      case 'health': return 'category-health';
      default: return 'category-default';
    }
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date().setHours(0, 0, 0, 0);
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'completed': return task.completed;
      case 'pending': return !task.completed;
      case 'overdue': return !task.completed && isOverdue(task.dueDate);
      case 'high': return task.priority === 'high';
      case 'medium': return task.priority === 'medium';
      case 'low': return task.priority === 'low';
      default: return true;
    }
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'category':
        return a.category.localeCompare(b.category);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const totalCount = tasks.length;

  return (
    <div className="app-container">
      <div className="main-card">
        <h1 className="app-title">Todo Task Manager</h1>
        <p className="task-counter">
          {completedCount} of {totalCount} tasks completed
        </p>
        
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : '0%' }}
          ></div>
        </div>

        <div className="add-task-section">
          <div className="input-row">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyPress={(e) => handleKeyPress(e, addTask)}
              placeholder="Add a new task..."
              className="task-input"
            />
            <button onClick={addTask} className="add-button">
              <Plus size={20} />
              Add
            </button>
          </div>
          
          <div className="options-row">
            <select
              value={newTaskPriority}
              onChange={(e) => setNewTaskPriority(e.target.value)}
              className="select-input"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            
            <select
              value={newTaskCategory}
              onChange={(e) => setNewTaskCategory(e.target.value)}
              className="select-input"
            >
              <option value="general">General</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
            </select>
            
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="date-input"
            />
          </div>
        </div>

        <div className="filter-section">
          <div className="filter-group">
            <Filter size={16} />
            <span className="filter-label">Filter:</span>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            
            <span className="filter-label">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="created">Date Created</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
              <option value="category">Category</option>
            </select>
          </div>
        </div>

        <div className="tasks-container">
          {sortedTasks.length === 0 ? (
            <div className="empty-state">
              <p>No tasks found. Add some tasks to get started!</p>
            </div>
          ) : (
            sortedTasks.map(task => (
              <div
                key={task.id}
                className={`task-item ${task.completed ? 'completed' : ''} ${
                  isOverdue(task.dueDate) && !task.completed ? 'overdue' : ''
                }`}
              >
                {editingTask === task.id ? (
                  <div className="edit-mode">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyPress={(e) => handleKeyPress(e, saveEdit)}
                      className="edit-input"
                      autoFocus
                    />
                    <div className="edit-options">
                      <select
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                        className="edit-select"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                      
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        className="edit-select"
                      >
                        <option value="general">General</option>
                        <option value="work">Work</option>
                        <option value="personal">Personal</option>
                        <option value="shopping">Shopping</option>
                        <option value="health">Health</option>
                      </select>
                      
                      <input
                        type="date"
                        value={editDueDate}
                        onChange={(e) => setEditDueDate(e.target.value)}
                        className="edit-date"
                      />
                    </div>
                    <div className="edit-actions">
                      <button onClick={saveEdit} className="save-button">
                        <Check size={16} />
                        Save
                      </button>
                      <button onClick={cancelEdit} className="cancel-button">
                        <X size={16} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="task-content">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleComplete(task.id)}
                      className="task-checkbox"
                    />
                    
                    <div className="task-details">
                      <div className={`task-text ${task.completed ? 'completed-text' : ''}`}>
                        {task.text}
                      </div>
                      
                      <div className="task-tags">
                        <span className={`priority-tag ${getPriorityColor(task.priority)}`}>
                          {task.priority.toUpperCase()}
                        </span>
                        
                        <span className={`category-tag ${getCategoryColor(task.category)}`}>
                          <Tag size={12} />
                          {task.category}
                        </span>
                        
                        {task.dueDate && (
                          <span className={`date-tag ${
                            isOverdue(task.dueDate) && !task.completed ? 'overdue-tag' : ''
                          }`}>
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                            {isOverdue(task.dueDate) && !task.completed && ' (Overdue)'}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="task-actions">
                      <button onClick={() => startEdit(task)} className="edit-button">
                        <Edit3 size={18} />
                      </button>
                      <button onClick={() => deleteTask(task.id)} className="delete-button">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
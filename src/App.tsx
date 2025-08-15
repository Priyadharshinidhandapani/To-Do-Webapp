import React, { useState, useEffect } from 'react';
import { TaskInput } from './components/TaskInput';
import { TaskList } from './components/TaskList';
import { Task } from './types/Task';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CheckSquare, BarChart3 } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todo-tasks', []);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'completed'>('all');

  // Convert stored dates back to Date objects
  useEffect(() => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
      }))
    );
  }, []);

  const addTask = (text: string) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined,
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const editTask = (id: string, newText: string) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text: newText } : task))
    );
  };

  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  const getFilteredTasks = () => {
    switch (activeTab) {
      case 'pending':
        return pendingTasks;
      case 'completed':
        return completedTasks;
      default:
        return tasks;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'pending':
        return 'Pending Tasks';
      case 'completed':
        return 'Completed Tasks';
      default:
        return 'All Tasks';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <CheckSquare size={36} className="text-blue-600" />
            <h1 className="text-4xl font-bold text-gray-800">TaskFlow</h1>
          </div>
          <p className="text-gray-600 text-lg">Organize your daily tasks with ease</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-blue-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-800">{pendingTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-amber-600">{pendingTasks.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <CheckSquare className="text-emerald-600" size={24} />
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-emerald-600">{completedTasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <TaskInput onAddTask={addTask} />

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'pending', label: 'Pending' },
              { key: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`px-4 py-2 rounded-t-lg font-medium transition-colors duration-200 ${
                  activeTab === tab.key
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <TaskList
            tasks={getFilteredTasks()}
            title={getTabTitle()}
            type={activeTab}
            onToggleComplete={toggleTaskComplete}
            onDeleteTask={deleteTask}
            onEditTask={editTask}
          />
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>&copy; 2025 TaskFlow. Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}

export default App;
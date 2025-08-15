import React from 'react';
import { TaskItem } from './TaskItem';
import { Task } from '../types/Task';
import { CheckCircle, Clock, ListTodo, Check } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  title: string;
  type: 'all' | 'pending' | 'completed';
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newText: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  title,
  type,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'pending':
        return <Clock size={20} className="text-amber-600" />;
      case 'completed':
        return <Check size={20} className="text-emerald-600" />;
      default:
        return <ListTodo size={20} className="text-blue-600" />;
    }
  };

  const getEmptyMessage = () => {
    switch (type) {
      case 'pending':
        return "No pending tasks. Great job! 🎉";
      case 'completed':
        return "No completed tasks yet. Start checking off some tasks!";
      default:
        return "No tasks yet. Add your first task above!";
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {getIcon()}
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
          {tasks.length}
        </span>
      </div>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-lg">{getEmptyMessage()}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};
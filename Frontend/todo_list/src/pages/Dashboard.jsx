import { useState } from "react";
import { Plus, AlignLeft, Flag, Sparkles, Calendar } from "lucide-react";
import TaskCard from "../components/TaskCard";

export default function Dashboard({ tasks, newTaskTitle, setNewTaskTitle, newTaskDescription, setNewTaskDescription, newTaskPriority, setNewTaskPriority, newTaskDueDate, setNewTaskDueDate, addTask, toggleTaskCompletion, deleteTask, editTask }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(e);
    setIsExpanded(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">My Tasks</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">You have {tasks.length} active tasks today. Let's get things done!</p>
      </div>

      <div className="relative group">
        {!isExpanded ? (
          <div
            onClick={() => setIsExpanded(true)}
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm text-slate-500 dark:text-slate-400 cursor-text flex items-center relative hover:border-indigo-300 dark:hover:border-slate-600 transition-all"
          >
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
              <Plus size={20} />
            </div>
            <span className="text-base">Add a new task...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-md p-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div>
              <input
                autoFocus
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task title..."
                className="w-full px-2 py-2 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-lg font-medium focus:ring-0"
              />
            </div>
            <div className="flex items-start gap-2 px-2">
              <AlignLeft size={18} className="text-slate-400 mt-2 shrink-0" />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Description (optional)"
                rows={2}
                className="w-full bg-transparent border-none outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-400 text-sm focus:ring-0 resize-none"
              />
            </div>
            <div className="flex items-center gap-2 px-2">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <input
                type="datetime-local"
                value={newTaskDueDate}
                onChange={(e) => setNewTaskDueDate(e.target.value)}
                className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500 transition-colors"
              />
              <span className="text-xs text-slate-400">Due date (optional)</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                {['low', 'medium', 'high'].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setNewTaskPriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                      newTaskPriority === p
                        ? p === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                        : p === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    <Flag size={12} className="inline mr-1 mb-0.5" />
                    {p}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTaskTitle.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm disabled:opacity-50 disabled:hover:bg-indigo-600"
                >
                  Add Task
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-16 px-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Sparkles size={24} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-1">All caught up!</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">You have no active tasks. Enjoy your day or add a new one above.</p>
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggle={() => toggleTaskCompletion(task.id)}
              onDelete={() => deleteTask(task.id, task.title)}
              onEdit={editTask}
            />
          ))
        )}
      </div>
    </div>
  );
}
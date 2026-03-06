import { useState } from "react";
import { Check, Trash2, Edit2, RotateCcw, Clock, X, Flag, Save, AlignLeft, Calendar } from "lucide-react";

export default function TaskCard({ task, onToggle, onDelete, onEdit, isCompletedView }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description || '');
  const [editPriority, setEditPriority] = useState(task.priority);
  const [editDueDate, setEditDueDate] = useState(task.dueDate || '');

  const priorityColors = {
    high: 'text-red-500 bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-900/30',
    medium: 'text-amber-500 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-900/30',
    low: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-900/30'
  };

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onEdit(task.id, {
      title: editTitle,
      description: editDescription,
      priority: editPriority,
      completed: task.completed,
      dueDate: editDueDate || null,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditTitle(task.title);
    setEditDescription(task.description || '');
    setEditPriority(task.priority);
    setEditDueDate(task.dueDate || '');
    setIsEditing(false);
  };

  const formatDueDate = (dateStr) => {
    if (!dateStr) return 'No date';
    const d = new Date(dateStr);
    const now = new Date();
    const diff = d - now;
    if (diff < 0) return `Overdue`;
    if (diff < 3600000) return `${Math.round(diff / 60000)}m left`;
    if (diff < 86400000) return `${Math.round(diff / 3600000)}h left`;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const isDueSoon = (dateStr) => {
    if (!dateStr) return false;
    const diff = new Date(dateStr) - new Date();
    return diff > 0 && diff < 1800000; // within 30 minutes
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-500/50 rounded-2xl p-4 shadow-md space-y-3 animate-in fade-in zoom-in-95 duration-200">
        <input
          autoFocus
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="w-full px-2 py-2 bg-transparent border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 text-lg font-medium focus:ring-0"
          placeholder="Task title..."
        />
        <div className="flex items-start gap-2 px-2">
          <AlignLeft size={16} className="text-slate-400 mt-2 shrink-0" />
          <textarea
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full bg-transparent border-none outline-none text-slate-600 dark:text-slate-300 placeholder:text-slate-400 text-sm focus:ring-0 resize-none"
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <Calendar size={16} className="text-slate-400 shrink-0" />
          <input
            type="datetime-local"
            value={editDueDate}
            onChange={(e) => setEditDueDate(e.target.value)}
            className="bg-transparent border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm text-slate-700 dark:text-slate-300 outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-2">
            {['low', 'medium', 'high'].map(p => (
              <button
                key={p}
                type="button"
                onClick={() => setEditPriority(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                  editPriority === p
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
            <button onClick={handleCancel} className="px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!editTitle.trim()}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center gap-1"
            >
              <Save size={14} />
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`group flex items-center justify-between p-4 bg-white dark:bg-slate-800 border rounded-2xl transition-all duration-300 hover:shadow-md ${task.completed ? 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10' : isDueSoon(task.dueDate) ? 'border-amber-300 dark:border-amber-500/50 bg-amber-50/30 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500/50'}`}>
      <div className="flex items-center gap-4 flex-1 overflow-hidden">
        <button
          onClick={onToggle}
          className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/30'
              : 'border-slate-300 dark:border-slate-600 text-transparent hover:border-indigo-500 dark:hover:border-indigo-400'
          }`}
        >
          <Check size={14} className={task.completed ? 'opacity-100' : 'opacity-0'} strokeWidth={3} />
        </button>

        <div className="flex flex-col truncate">
          <span className={`text-[15px] font-medium transition-colors ${task.completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
            {task.title}
          </span>
          {task.description && (
            <p className={`text-sm mt-0.5 truncate ${task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-500 dark:text-slate-400'}`}>
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className={`flex items-center gap-1 ${!task.completed && isDueSoon(task.dueDate) ? 'text-amber-600 dark:text-amber-400 font-semibold' : ''}`}>
              <Clock size={12} />
              {task.completed && task.completedAt
                ? `Done ${new Date(task.completedAt).toLocaleDateString()}`
                : formatDueDate(task.dueDate)}
            </span>
            {!task.completed && (
              <span className={`px-2 py-0.5 rounded border capitalize text-[10px] font-semibold tracking-wide ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
        {isCompletedView ? (
          <button
            onClick={onToggle}
            title="Restore task"
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <RotateCcw size={18} />
          </button>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            title="Edit task"
            className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Edit2 size={18} />
          </button>
        )}
        <button
          onClick={onDelete}
          title="Delete permanently"
          className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
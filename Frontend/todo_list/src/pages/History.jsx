import { Plus, Check, Edit2, Trash2, RotateCcw, Activity, Clock } from "lucide-react";

export default function HistoryView({ history }) {
  const getActionStyles = (action) => {
    switch(action) {
      case 'created': return { color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-500/10', icon: <Plus size={14} /> };
      case 'completed': return { color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', icon: <Check size={14} /> };
      case 'edited': return { color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', icon: <Edit2 size={14} /> };
      case 'deleted': return { color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-500/10', icon: <Trash2 size={14} /> };
      case 'restored': return { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10', icon: <RotateCcw size={14} /> };
      default: return { color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800', icon: <Activity size={14} /> };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Task History</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">A timeline of your recent activity and changes.</p>
      </div>

      <div className="relative pl-6 sm:pl-8 border-l border-slate-200 dark:border-slate-700 space-y-8 ml-4">
        {history.map((item, idx) => {
          const style = getActionStyles(item.action);
          return (
            <div key={item.id} className="relative group">
              {/* Timeline dot */}
              <div className={`absolute -left-[35px] sm:-left-[43px] w-8 h-8 rounded-full ${style.bg} ${style.color} flex items-center justify-center ring-4 ring-slate-50 dark:ring-slate-900 transition-transform group-hover:scale-110`}>
                {style.icon}
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50 shadow-sm group-hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-200">
                    <span className="capitalize text-slate-500 dark:text-slate-400 font-normal mr-2">{item.action}:</span>
                    {item.taskTitle}
                  </p>
                  <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0">
                    <Clock size={12} />
                    {formatDate(item.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

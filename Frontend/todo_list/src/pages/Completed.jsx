import TaskCard from "../components/TaskCard";

export default function CompletedView({ tasks, percentage, toggleTaskCompletion, deleteTask, editTask }) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Completed Tasks</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Review your accomplishments and restore tasks if needed.</p>
      </div>

      {/* Progress Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-6">
        <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100 dark:text-slate-700 stroke-current"
              strokeWidth="3"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-emerald-500 stroke-current drop-shadow-sm transition-all duration-1000 ease-out"
              strokeWidth="3"
              strokeDasharray={`${percentage}, 100`}
              fill="none"
              strokeLinecap="round"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-slate-900 dark:text-white">{percentage}%</span>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Productivity Score</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {percentage === 100
              ? "Incredible job! You've completed everything."
              : percentage > 50
                ? "You're over halfway there. Keep it up!"
                : "A good start. Keep checking those boxes!"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400 text-sm">
            No completed tasks yet.
          </div>
        ) : (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isCompletedView
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
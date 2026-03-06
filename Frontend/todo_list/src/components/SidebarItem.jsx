export default function SidebarItem({ icon, label, isActive, onClick, badge }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-200 group
        ${isActive
          ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-semibold'
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200 font-medium'
        }`}
    >
      <div className="flex items-center gap-3">
        <span className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}>
          {icon}
        </span>
        <span className="text-sm">{label}</span>
      </div>
      {badge !== undefined && (
        <span className={`text-xs py-0.5 px-2 rounded-full ${isActive ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
          {badge}
        </span>
      )}
    </button>
  );
}
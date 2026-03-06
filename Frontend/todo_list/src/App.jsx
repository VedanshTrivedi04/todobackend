import { useState, useEffect } from "react";
import {
  CheckCircle2, CheckSquare, Search, Bell, Moon, Sun, Menu, X,
  LayoutDashboard, History, LogOut, KeyRound
} from "lucide-react";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Completed from "./pages/Completed";
import HistoryView from "./pages/History";
import ChangePassword from "./pages/ChangePassword";
import Profile from "./pages/Profile";
import SidebarItem from "./components/SidebarItem";
import { loginUser, logoutUser, getStoredToken, fetchTodos, createTodo, updateTodo, deleteTodo, fetchUser, updateUserInfo, createUser, changePassword, resetPasswordUnauthenticated } from "./api";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredToken());
  const [currentView, setCurrentView] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); // 'login' or 'register'
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Toggle Theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Fetch todos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadTodos();
      loadUser();
    }
  }, [isAuthenticated]);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await fetchTodos();
      setTasks(data);
    } catch (err) {
      console.error('Failed to fetch todos:', err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const loadUser = async () => {
    try {
      const user = await fetchUser();
      setUserName(user.username || user.frist_name || '');
      setUserInfo(user);
    } catch (err) {
      console.error('Failed to fetch user:', err);
    }
  };

  // History logger (client-side only)
  const logHistory = (taskId, taskTitle, action) => {
    const newLog = {
      id: `h-${Date.now()}`,
      taskId: String(taskId),
      taskTitle,
      action,
      timestamp: new Date().toISOString()
    };
    setHistory(prev => [newLog, ...prev]);
  };

  // --- CRUD Actions ---

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await createTodo({
        title: newTaskTitle,
        description: newTaskDescription,
        priority: newTaskPriority,
        dueDate: newTaskDueDate || null,
      });
      logHistory(`t-${Date.now()}`, newTaskTitle, 'created');
      setNewTaskTitle('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskDueDate('');
      await loadTodos();
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  const toggleTaskCompletion = async (id) => {
    const task = tasks.find(t => t.id === String(id));
    if (!task) return;

    try {
      const isCompleting = !task.completed;
      await updateTodo(id, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: isCompleting,
      });
      logHistory(id, task.title, isCompleting ? 'completed' : 'restored');
      await loadTodos();
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  const deleteTaskHandler = async (id, title) => {
    try {
      await deleteTodo(id);
      logHistory(id, title, 'deleted');
      await loadTodos();
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const editTask = async (id, updates) => {
    try {
      await updateTodo(id, updates);
      logHistory(id, updates.title, 'edited');
      await loadTodos();
    } catch (err) {
      console.error('Failed to edit task:', err);
    }
  };

  const handleLogin = async (username, password) => {
    await loginUser(username, password);
    setIsAuthenticated(true);
  };

  const handleRegister = async (userData) => {
    await createUser(userData);
  };

  const handleChangePassword = async (currentPw, newPw) => {
    await changePassword(currentPw, newPw);
  };

  const handleUpdateProfile = async (data) => {
    await updateUserInfo(data);
    await loadUser();
  };

  const handleLogout = () => {
    logoutUser();
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setAuthView('login');
    setTasks([]);
    setHistory([]);
    setUserName('');
  };

  // --- VIEWS ---

  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <Register
          onRegister={handleRegister}
          onBackToLogin={() => setAuthView('login')}
          isDarkMode={isDarkMode}
        />
      );
    }
    if (authView === 'forgot') {
      return (
        <ForgotPassword
          onResetPassword={resetPasswordUnauthenticated}
          onBackToLogin={() => setAuthView('login')}
          isDarkMode={isDarkMode}
        />
      );
    }
    return (
      <Login
        onLogin={handleLogin}
        isDarkMode={isDarkMode}
        toggleTheme={() => setIsDarkMode(!isDarkMode)}
        onGoToRegister={() => setAuthView('register')}
        onGoToForget={() => setAuthView('forgot')}
      />
    );
  }

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);
  const completionPercentage = tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);

  // Search filter
  const filterBySearch = (list) => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase();
    return list.filter(t => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q)));
  };
  const filteredActive = filterBySearch(activeTasks);
  const filteredCompleted = filterBySearch(completedTasks);

  // Notifications — check for tasks due within 30 minutes
  useEffect(() => {
    if (!isAuthenticated) return;
    const checkDue = () => {
      const now = new Date();
      const due = activeTasks.filter(t => {
        if (!t.dueDate) return false;
        const diff = new Date(t.dueDate) - now;
        return diff > 0 && diff < 1800000;
      }).map(t => ({
        id: t.id,
        title: t.title,
        dueDate: t.dueDate,
        minutesLeft: Math.round((new Date(t.dueDate) - now) / 60000),
      }));
      setNotifications(due);

      // Browser notification for tasks due soon
      if (due.length > 0 && 'Notification' in window && Notification.permission === 'granted') {
        due.forEach(n => {
          if (n.minutesLeft <= 5) {
            new Notification('Task Due Soon!', { body: `"${n.title}" is due in ${n.minutesLeft} minute(s)`, icon: '/vite.svg' });
          }
        });
      }
    };
    checkDue();
    const interval = setInterval(checkDue, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, tasks]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Get user initials for avatar
  const userInitials = userName ? userName.slice(0, 2).toUpperCase() : 'U';

  return (
    <div className={`flex h-screen w-full bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 overflow-hidden`}>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700/50 flex flex-col transition-transform duration-300 ease-in-out z-50 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <CheckSquare size={18} />
            </div>
            <span className="font-bold text-xl tracking-tight">TaskFlow</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden text-slate-500 hover:text-slate-900 dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            isActive={currentView === 'dashboard'}
            onClick={() => { setCurrentView('dashboard'); setIsMobileMenuOpen(false); }}
            badge={activeTasks.length}
          />
          <SidebarItem
            icon={<CheckCircle2 size={18} />}
            label="Completed"
            isActive={currentView === 'completed'}
            onClick={() => { setCurrentView('completed'); setIsMobileMenuOpen(false); }}
          />
          <SidebarItem
            icon={<History size={18} />}
            label="History"
            isActive={currentView === 'history'}
            onClick={() => { setCurrentView('history'); setIsMobileMenuOpen(false); }}
          />
          <SidebarItem
            icon={<KeyRound size={18} />}
            label="Change Password"
            isActive={currentView === 'settings'}
            onClick={() => { setCurrentView('settings'); setIsMobileMenuOpen(false); }}
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700/50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all font-medium text-sm"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 px-6 lg:px-8 border-b border-slate-200 dark:border-slate-700/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 w-64 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
              <Search size={16} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full placeholder:text-slate-400 dark:text-slate-200"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-800 text-[10px] text-white font-bold flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-700/50">
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                        No upcoming deadlines
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className="px-4 py-3 border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{n.title}</p>
                          <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 font-medium">⏰ Due in {n.minutesLeft} minute(s)</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <button onClick={() => setCurrentView('profile')} className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-sm cursor-pointer ml-2 hover:ring-2 hover:ring-indigo-400/50 transition-all" title={userName}>
              {userInitials}
            </button>
          </div>
        </header>

        {/* Dynamic View Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
          <div className="max-w-4xl mx-auto w-full">
            {loading ? (
              <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                Loading tasks...
              </div>
            ) : (
              <>
                {currentView === 'dashboard' && (
                  <Dashboard
                    tasks={filteredActive}
                    newTaskTitle={newTaskTitle}
                    setNewTaskTitle={setNewTaskTitle}
                    newTaskDescription={newTaskDescription}
                    setNewTaskDescription={setNewTaskDescription}
                    newTaskPriority={newTaskPriority}
                    setNewTaskPriority={setNewTaskPriority}
                    newTaskDueDate={newTaskDueDate}
                    setNewTaskDueDate={setNewTaskDueDate}
                    addTask={addTask}
                    toggleTaskCompletion={toggleTaskCompletion}
                    deleteTask={deleteTaskHandler}
                    editTask={editTask}
                  />
                )}
                {currentView === 'completed' && (
                  <Completed
                    tasks={filteredCompleted}
                    percentage={completionPercentage}
                    toggleTaskCompletion={toggleTaskCompletion}
                    deleteTask={deleteTaskHandler}
                    editTask={editTask}
                  />
                )}
                {currentView === 'history' && (
                  <HistoryView history={history} />
                )}
                {currentView === 'settings' && (
                  <ChangePassword
                    onChangePassword={handleChangePassword}
                    onBack={() => setCurrentView('dashboard')}
                  />
                )}
                {currentView === 'profile' && (
                  <Profile
                    userInfo={userInfo}
                    onUpdateProfile={handleUpdateProfile}
                    onBack={() => setCurrentView('dashboard')}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
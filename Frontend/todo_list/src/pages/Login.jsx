import { useState } from "react";
import { Sun, Moon, CheckSquare, User, Eye, EyeOff, ChevronRight } from "lucide-react";

export default function Login({ onLogin, isDarkMode, toggleTheme, onGoToRegister, onGoToForget }) {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onLogin(username, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 p-2 rounded-full bg-white/10 backdrop-blur-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-white/20 transition-all z-20"
      >
        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Abstract Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob ${isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-200/50'}`}></div>
        <div className={`absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-200/50'}`}></div>
        <div className={`absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-200/50'}`}></div>
      </div>

      <div className="w-full max-w-[1000px] grid grid-cols-1 md:grid-cols-2 gap-8 items-center z-10 p-6">

        {/* Left Col - Graphic/Marketing */}
        <div className="hidden md:flex flex-col justify-center text-slate-800 dark:text-white pr-8 animate-in fade-in slide-in-from-left-8 duration-700">
          <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-8">
            <CheckSquare size={32} />
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Manage tasks with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">beautiful precision.</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-md">
            TaskFlow helps you organize your work and life. Stay focused, get things done, and track your progress seamlessly.
          </p>

          <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-slate-50 dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] ${i === 1 ? 'bg-indigo-100 text-indigo-700' : i === 2 ? 'bg-emerald-100 text-emerald-700' : ''}`}>
                  {i === 4 ? '+2k' : ''}
                </div>
              ))}
            </div>
            Trusted by productive teams
          </div>
        </div>

        {/* Right Col - Form Card */}
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 dark:border-slate-700/50 w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-8 duration-700">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 md:hidden shadow-lg shadow-indigo-500/30">
              <CheckSquare size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to continue to your workspace</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User size={18} />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <button onClick={onGoToForget} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500">Forgot Password?</button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Signing in...' : 'Log in to Workspace'}
              {!isLoading && <ChevronRight size={18} />}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
            Don't have an account?{' '}
            <button onClick={onGoToRegister} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Create Account
            </button>
          </p>
        </div>
      </div>

      {/* Inline styles for custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}} />
    </div>
  );
}
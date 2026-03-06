import { useState } from "react";
import { Lock, Eye, EyeOff, User, CheckSquare, ArrowLeft, KeyRound } from "lucide-react";

export default function ForgotPassword({ onResetPassword, onBackToLogin, isDarkMode }) {
  const [username, setUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!username.trim() || !oldPassword || !newPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }
    if (oldPassword === newPassword) {
      setError('New password must be different from old password');
      return;
    }

    setIsLoading(true);
    try {
      await onResetPassword(username, oldPassword, newPassword);
      setSuccess('Password changed successfully! You can now log in with your new password.');
      setUsername('');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (detail === 'could not a vlid user ' || err.response?.status === 401) {
        setError('Invalid username or password. Please check your credentials.');
      } else {
        setError(detail || 'Failed to change password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm";

  return (
    <div className={`min-h-screen flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>

      {/* Abstract Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob ${isDarkMode ? 'bg-indigo-900/50' : 'bg-indigo-200/50'}`}></div>
        <div className={`absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-2000 ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-200/50'}`}></div>
        <div className={`absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full mix-blend-multiply filter blur-[100px] opacity-70 animate-blob animation-delay-4000 ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-200/50'}`}></div>
      </div>

      <div className="w-full max-w-lg z-10 p-6">
        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl rounded-3xl p-8 sm:p-10 shadow-2xl border border-white/50 dark:border-slate-700/50 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-indigo-500/30">
              <KeyRound size={24} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Reset Password</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Enter your username and current password to set a new one</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 text-sm text-center">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className={`${inputClass} pl-10`}
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Current Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showOld ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowOld(!showOld)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock size={18} />
                </div>
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={`${inputClass} pl-10`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={inputClass}
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200 mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Remember your password?{' '}
            <button onClick={onBackToLogin} className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
              Back to Login
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
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}} />
    </div>
  );
}

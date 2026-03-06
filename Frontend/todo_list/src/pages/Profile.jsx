import { useState, useEffect } from "react";
import { User, Mail, Save, ArrowLeft, Pencil } from "lucide-react";

export default function Profile({ userInfo, onUpdateProfile, onBack }) {
  const [form, setForm] = useState({
    email: '',
    username: '',
    frist_name: '',
    last_name: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userInfo) {
      setForm({
        email: userInfo.email || '',
        username: userInfo.username || '',
        frist_name: userInfo.frist_name || '',
        last_name: userInfo.last_name || '',
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.email || !form.username || !form.frist_name || !form.last_name) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await onUpdateProfile(form);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    if (userInfo) {
      setForm({
        email: userInfo.email || '',
        username: userInfo.username || '',
        frist_name: userInfo.frist_name || '',
        last_name: userInfo.last_name || '',
      });
    }
  };

  const inputClass = "w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all sm:text-sm";
  const readOnlyClass = "w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl text-slate-700 dark:text-slate-300 sm:text-sm cursor-default";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">My Profile</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage your personal information</p>
        </div>
      </div>

      <div className="max-w-lg">
        {/* Profile Avatar Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden mb-6">
          <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
          <div className="px-6 pb-6 -mt-10">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white dark:border-slate-800">
              {form.frist_name ? form.frist_name.charAt(0).toUpperCase() : ''}{form.last_name ? form.last_name.charAt(0).toUpperCase() : ''}
            </div>
            <div className="mt-3">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {form.frist_name} {form.last_name}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">@{form.username}</p>
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <User size={20} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">Personal Information</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Your account details</p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
              >
                <Pencil size={14} />
                Edit
              </button>
            )}
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
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="frist_name"
                    value={form.frist_name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                ) : (
                  <div className={readOnlyClass}>{form.frist_name || '—'}</div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="last_name"
                    value={form.last_name}
                    onChange={handleChange}
                    className={inputClass}
                  />
                ) : (
                  <div className={readOnlyClass}>{form.last_name || '—'}</div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Username</label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User size={18} />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              ) : (
                <div className={readOnlyClass}>@{form.username || '—'}</div>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              {isEditing ? (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`${inputClass} pl-10`}
                  />
                </div>
              ) : (
                <div className={readOnlyClass}>{form.email || '—'}</div>
              )}
            </div>

            {isEditing && (
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  <Save size={16} />
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl font-medium transition-colors text-sm"
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

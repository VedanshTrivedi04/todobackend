export const INITIAL_TASKS = [
  { id: '1', title: 'Design user authentication flow', description: 'Create wireframes and user flow for login/signup', completed: false, priority: 'high', dueDate: 'Today', createdAt: new Date().toISOString() },
  { id: '2', title: 'Update homepage copy', description: '', completed: false, priority: 'medium', dueDate: 'Tomorrow', createdAt: new Date().toISOString() },
  { id: '3', title: 'Review pull requests from team', description: 'Focus on the new navigation bar feature', completed: false, priority: 'low', dueDate: 'Mar 10', createdAt: new Date().toISOString() },
  { id: '4', title: 'Weekly sync with engineering', description: '', completed: true, priority: 'medium', dueDate: 'Yesterday', createdAt: new Date().toISOString(), completedAt: new Date(Date.now() - 86400000).toISOString() },
  { id: '5', title: 'Finalize Q2 roadmap', description: '', completed: true, priority: 'high', dueDate: 'Mon', createdAt: new Date().toISOString(), completedAt: new Date(Date.now() - 172800000).toISOString() },
];

export const INITIAL_HISTORY = [
  { id: 'h1', taskId: '5', taskTitle: 'Finalize Q2 roadmap', action: 'completed', timestamp: new Date(Date.now() - 172800000).toISOString() },
  { id: 'h2', taskId: '4', taskTitle: 'Weekly sync with engineering', action: 'completed', timestamp: new Date(Date.now() - 86400000).toISOString() },
  { id: 'h3', taskId: '1', taskTitle: 'Design user authentication flow', action: 'created', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'h4', taskId: '2', taskTitle: 'Update homepage copy', action: 'created', timestamp: new Date(Date.now() - 3000000).toISOString() },
  { id: 'h5', taskId: '1', taskTitle: 'Design user authentication flow', action: 'edited', timestamp: new Date(Date.now() - 1500000).toISOString() },
];
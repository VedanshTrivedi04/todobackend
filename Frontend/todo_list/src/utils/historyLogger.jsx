export function logHistory(setHistory, taskId, taskTitle, action) {

  const newLog = {
    id: `h-${Date.now()}`,
    taskId,
    taskTitle,
    action,
    timestamp: new Date().toISOString()
  };

  setHistory(prev => [newLog, ...prev]);
}
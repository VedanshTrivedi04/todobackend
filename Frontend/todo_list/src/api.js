import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth ---

export async function loginUser(username, password) {
  // FastAPI OAuth2 expects form-data, not JSON
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const res = await api.post('/auth/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  const { access_token } = res.data;
  localStorage.setItem('access_token', access_token);
  return access_token;
}

export function logoutUser() {
  localStorage.removeItem('access_token');
}

export function getStoredToken() {
  return localStorage.getItem('access_token');
}

// --- Todos ---

// Backend returns: { id, tittle, discription, priority, complete, owner_id }
// Frontend uses:   { id, title,  description,  priority, completed }

function mapTodoFromBackend(todo) {
  return {
    id: String(todo.id),
    title: todo.tittle || '',
    description: todo.discription || '',
    priority: todo.priority || 'medium',
    completed: todo.complete ?? false,
    dueDate: todo.due_date || null,
    ownerId: todo.owner_id,
  };
}

function mapTodoToBackend(todo) {
  return {
    tittle: todo.title,
    discription: todo.description || '',
    priority: todo.priority || 'medium',
    complete: todo.completed ?? false,
  };
}

export async function fetchTodos() {
  const res = await api.get('/read');
  return res.data.map(mapTodoFromBackend);
}

export async function createTodo({ title, description, priority, dueDate }) {
  await api.post('/todos', {
    tittle: title,
    discription: description || '',
    priority: priority || 'medium',
    complete: false,
    due_date: dueDate || null,
  });
}

export async function updateTodo(id, { title, description, priority, completed, dueDate }) {
  await api.put(`/todo/${id}`, {
    tittle: title,
    discription: description || '',
    priority: priority || 'medium',
    complete: completed ?? false,
    due_date: dueDate || null,
  });
}

export async function deleteTodo(id) {
  await api.delete(`/todo/${id}`);
}

// --- User ---

export async function fetchUser() {
  const res = await api.get('/user/');
  return res.data;
}

export async function updateUserInfo({ email, username, frist_name, last_name }) {
  const res = await api.put('/user/changeInfo', {
    email,
    username,
    frist_name,
    last_name,
  });
  return res.data;
}

export async function createUser({ email, username, frist_name, last_name, password, role }) {
  const res = await api.post('/auth/createuser', {
    email,
    username,
    frist_name,
    last_name,
    password,
    role,
  });
  return res.data;
}

export async function changePassword(password, new_password) {
  await api.put('/user/Change_pass', {
    password,
    new_password,
  });
}

// Forgot password flow: temporarily login, change password, then clear token
export async function resetPasswordUnauthenticated(username, oldPassword, newPassword) {
  // Step 1: Login to get a token
  await loginUser(username, oldPassword);
  try {
    // Step 2: Change password using the token
    await changePassword(oldPassword, newPassword);
  } finally {
    // Step 3: Always clear the token afterward
    logoutUser();
  }
}

export default api;

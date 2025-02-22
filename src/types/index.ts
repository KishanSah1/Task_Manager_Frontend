export interface User {
  id: string;
  email: string;
  username: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  completed: boolean;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  taskCount: number;
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  username: string;
}

//import {Task} from '../types';

export interface Task {
  _id?: string; // MongoDB ID
  id?: string; // Backward compatibility
  title: string;
  description?: string;
  completed: boolean;
  priority?: 'low' | 'medium' | 'high';
  category?: string;
  dueDate?: Date;
}

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TaskDetail: {task?: Task};
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  CompletedTasks: undefined;
  Profile: undefined;
};

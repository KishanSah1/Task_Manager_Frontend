//import {Task} from '../types';

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
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

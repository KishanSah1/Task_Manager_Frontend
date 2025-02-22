import AsyncStorage from '@react-native-async-storage/async-storage';
import {Task} from '../types';

export const useLocalStorage = () => {
  const storeTask = async (task: Task) => {
    try {
      const tasks = await AsyncStorage.getItem('tasks');
      const parsedTasks = tasks ? JSON.parse(tasks) : [];
      parsedTasks.push(task);
      await AsyncStorage.setItem('tasks', JSON.stringify(parsedTasks));
    } catch (error) {
      console.error('Error storing task:', error);
    }
  };

  const getLocalTasks = async (): Promise<Task[]> => {
    try {
      const tasks = await AsyncStorage.getItem('tasks');
      return tasks ? JSON.parse(tasks) : [];
    } catch (error) {
      console.error('Error getting tasks:', error);
      return [];
    }
  };

  const syncTasks = async (tasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error syncing tasks:', error);
    }
  };

  return {
    storeTask,
    getLocalTasks,
    syncTasks,
  };
};

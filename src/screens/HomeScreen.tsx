import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Text,
} from 'react-native';
import { FAB, Title } from 'react-native-paper';
import {useGetTasksQuery, useDeleteTaskMutation} from '../store/api';
import {TaskCard} from '../components/TaskCard';
import {Task} from '../types';
import {useNavigation} from '@react-navigation/native';
import {CompositeNavigationProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RootStackParamList, MainTabParamList} from '../navigation/types';

type HomeScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList, 'Home'>,
  NativeStackNavigationProp<RootStackParamList>
>;

export const HomeScreen = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const {data = [], isLoading} = useGetTasksQuery();
  const tasks = data.filter(task => !task.completed);
  const [deleteTask] = useDeleteTaskMutation();

  const handleTaskPress = (task: Task) => {
    // Convert the task to match the navigation type's Task interface
    const navigationTask = {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    };

    navigation.navigate('TaskDetail', {task: navigationTask});
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTask(taskId).unwrap();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const renderItem = ({item}: {item: Task}) => (
    <TaskCard
      key={item._id || item.id}
      task={item}
      onPress={handleTaskPress}
      onDelete={() => handleDeleteTask(item._id || item.id || '')}
    />
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
            <Text style={styles.emptyTitle}>All Caught Up! </Text>
            <Text style={styles.emptySubtitle}>No pending tasks found</Text>
            <Text style={styles.emptyMessage}>
              Time to start something new! Tap the button below to add your next
              task.
            </Text>
          </View>
        )}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        label="Add Task"
        onPress={() => navigation.navigate('TaskDetail', {task: undefined})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 220,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    maxWidth: 300,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

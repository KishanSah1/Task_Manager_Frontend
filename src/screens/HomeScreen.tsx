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
  const {data: tasks = [], isLoading} = useGetTasksQuery();
  const [deleteTask] = useDeleteTaskMutation();

  const handleTaskPress = (task: Task) => {
    // Convert the task to match the navigation type's Task interface
    const navigationTask = {
      ...task,
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
    };

    navigation.navigate('TaskDetail', {task: navigationTask});
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id).unwrap();
      // The list will automatically update due to RTK Query cache invalidation
    } catch (error) {
      console.error('Failed to delete task:', error);
      // You might want to add error handling here (e.g., show a toast message)
    }
  };

  const renderItem = ({item}: {item: Task}) => (
    <TaskCard
      key={item.id}
      task={item}
      onPress={handleTaskPress}
      onDelete={handleDeleteTask}
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
            <Text>No tasks found</Text>
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
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

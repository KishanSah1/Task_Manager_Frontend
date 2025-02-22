import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useGetTasksQuery} from '../store/api';
import {TaskCard} from '../components/TaskCard';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';
import { Task } from './../navigation/types';

export const CompletedTasksScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {data: tasks} = useGetTasksQuery();

  const completedTasks = tasks?.filter(task => task.completed) ?? [];

  return (
    <View style={styles.container}>
      <FlatList
        data={completedTasks}
        renderItem={({item}) => (
          <TaskCard
            task={item}
            onPress={task => navigation.navigate('TaskDetail', {task})}
            onDelete={() => {}}
          />
        )}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

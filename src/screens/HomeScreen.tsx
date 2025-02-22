import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {FAB} from 'react-native-paper';
import {useGetTasksQuery} from '../store/api';
import {TaskCard} from '../components/TaskCard';
import {Task} from '../types';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/types';

export const HomeScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {data: tasks, isLoading} = useGetTasksQuery();

  const handleTaskPress = (task: Task) => {
    navigation.navigate('TaskDetail', {task});
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        renderItem={({item}) => (
          <TaskCard task={item} onPress={handleTaskPress} onDelete={() => {}} />
        )}
        keyExtractor={item => item.id}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate('TaskDetail', {task: undefined})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

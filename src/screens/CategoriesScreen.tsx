import React from 'react';

import {View, StyleSheet, FlatList} from 'react-native';
import {useGetTasksQuery} from '../store/api';
import {CategoryCard} from '../components/CategoryCard';
import {Category} from '../types';

export const CategoriesScreen = () => {
  const {data: tasks} = useGetTasksQuery();

  const categories: Category[] = React.useMemo(() => {
    if (!tasks) return [];

    const categoryMap = tasks.reduce((acc, task) => {
      if (!acc[task.category]) {
        acc[task.category] = {
          id: task.category,
          name: task.category,
          taskCount: 0,
        };
      }
      acc[task.category].taskCount++;
      return acc;
    }, {} as Record<string, Category>);

    return Object.values(categoryMap);
  }, [tasks]);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({item}) => (
          <CategoryCard category={item} onPress={() => {}} />
        )}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

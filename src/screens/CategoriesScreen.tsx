import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {useGetTasksQuery} from '../store/api';
import {CategoryCard} from '../components/CategoryCard';
import {Category} from '../types';

// Predefined category options
const CATEGORY_OPTIONS = [
  {label: 'Work', value: 'work'},
  {label: 'Personal', value: 'personal'},
  {label: 'Shopping', value: 'shopping'},
  {label: 'Health', value: 'health'},
  {label: 'Education', value: 'education'},
];

export const CategoriesScreen = () => {
  const {data: tasks} = useGetTasksQuery();

  const categories: Category[] = React.useMemo(() => {
    // Initialize categories with taskCount = 0
    const categoryMap = CATEGORY_OPTIONS.reduce((acc, category) => {
      acc[category.value] = {
        id: category.value,
        name: category.label,
        taskCount: 0,
      };
      return acc;
    }, {} as Record<string, Category>);

    // Count the tasks per category
    if (tasks) {
      tasks.forEach(task => {
        if (task.category && categoryMap[task.category]) {
          categoryMap[task.category].taskCount++;
        }
      });
    }

    // Convert to array and sort by task count (descending)
    return Object.values(categoryMap).sort((a, b) => b.taskCount - a.taskCount);
  }, [tasks]);

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={({item}) => (
          <CategoryCard category={item} onPress={() => {}} />
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

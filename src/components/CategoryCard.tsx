import React from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';

import {Category} from '../types';
import {Card, Title, Paragraph} from 'react-native-paper';


interface CategoryCardProps {
  category: Category;
  onPress: (category: Category) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={() => onPress(category)}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>{category.name}</Title>
          <Paragraph>Tasks: {category.taskCount}</Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    marginHorizontal: 16,
  },
});

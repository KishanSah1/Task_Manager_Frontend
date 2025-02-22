import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Card, Title, Paragraph, Badge} from 'react-native-paper';
import {format} from 'date-fns';
import {Task} from '../types';

interface TaskCardProps {
  task: Task;
  onPress: (task: Task) => void;
  onDelete: (id: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onPress,
  onDelete,
}) => {
  const priorityColors = {
    low: '#4CAF50',
    medium: '#FFC107',
    high: '#F44336',
  };

  return (
    <TouchableOpacity onPress={() => onPress(task)}>
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <Title>{task.title}</Title>
            <Badge
              style={[
                styles.priority,
                {backgroundColor: priorityColors[task.priority]},
              ]}>
              {task.priority}
            </Badge>
          </View>
          <Paragraph numberOfLines={2}>{task.description}</Paragraph>
          <View style={styles.footer}>
            <Paragraph>
              Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}
            </Paragraph>
            <Badge>{task.category}</Badge>
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priority: {
    alignSelf: 'flex-start',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

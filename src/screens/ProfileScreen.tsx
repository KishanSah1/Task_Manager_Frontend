import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Title, Paragraph, Card} from 'react-native-paper';
import {useAuth} from '../hooks/useAuth';
import {useGetTasksQuery} from '../store/api';

export const ProfileScreen = () => {
  const {user, logout} = useAuth();
  const {data: tasks} = useGetTasksQuery();

  const stats = React.useMemo(() => {
    if (!tasks) return {total: 0, completed: 0, pending: 0};

    const completed = tasks.filter(task => task.completed).length;
    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  }, [tasks]);

  return (
    <View style={styles.container}>
      <Card style={styles.profileCard}>
        <Card.Content>
          <Title>Profile Information</Title>
          <Paragraph>Username: {user?.username}</Paragraph>
          <Paragraph>Email: {user?.email}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.statsCard}>
        <Card.Content>
          <Title>Task Statistics</Title>
          <Paragraph>Total Tasks: {stats.total}</Paragraph>
          <Paragraph>Completed Tasks: {stats.completed}</Paragraph>
          <Paragraph>Pending Tasks: {stats.pending}</Paragraph>
        </Card.Content>
      </Card>

      <Button mode="contained" onPress={logout} style={styles.logoutButton}>
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  logoutButton: {
    marginTop: 'auto',
  },
});

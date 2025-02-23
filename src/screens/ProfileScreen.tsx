// import React from 'react';
// import {View, StyleSheet} from 'react-native';
// import {Button, Title, Paragraph, Card} from 'react-native-paper';
// import {useAuth} from '../hooks/useAuth';
// import {useGetTasksQuery} from '../store/api';

// export const ProfileScreen = () => {
//   const {user, logout} = useAuth();
//   const {data: tasks} = useGetTasksQuery();

//   const stats = React.useMemo(() => {
//     if (!tasks) return {total: 0, completed: 0, pending: 0};

//     const completed = tasks.filter(task => task.completed).length;
//     return {
//       total: tasks.length,
//       completed,
//       pending: tasks.length - completed,
//     };
//   }, [tasks]);

//   return (
//     <View style={styles.container}>
//       <Card style={styles.profileCard}>
//         <Card.Content>
//           <Title>Profile Information</Title>
//           <Paragraph>Username: {user?.username}</Paragraph>
//           <Paragraph>Email: {user?.email}</Paragraph>
//         </Card.Content>
//       </Card>

//       <Card style={styles.statsCard}>
//         <Card.Content>
//           <Title>Task Statistics</Title>
//           <Paragraph>Total Tasks: {stats.total}</Paragraph>
//           <Paragraph>Completed Tasks: {stats.completed}</Paragraph>
//           <Paragraph>Pending Tasks: {stats.pending}</Paragraph>
//         </Card.Content>
//       </Card>

//       <Button mode="contained" onPress={logout} style={styles.logoutButton}>
//         Logout
//       </Button>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   profileCard: {
//     marginBottom: 16,
//   },
//   statsCard: {
//     marginBottom: 16,
//   },
//   logoutButton: {
//     marginTop: 'auto',
//   },
// });




import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button, Text, Card} from 'react-native-paper';
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
      <Text style={styles.screenTitle}>Profile</Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Profile Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Username:</Text>
            <Text style={styles.value}>
              {user?.username || 'Not available'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email || 'Not available'}</Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={[styles.card, styles.statsCard]}>
        <Card.Content>
          <Text style={styles.cardTitle}>Task Statistics</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Total Tasks:</Text>
            <Text style={styles.value}>{stats.total}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Completed Tasks:</Text>
            <Text style={styles.value}>{stats.completed}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pending Tasks:</Text>
            <Text style={styles.value}>{stats.pending}</Text>
          </View>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={logout}
        style={styles.logoutButton}
        contentStyle={styles.logoutButtonContent}
        buttonColor="#E6E6FA"
        textColor="#000000">
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#2A2A2A',
  },
  statsCard: {
    marginTop: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  value: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 'auto',
    borderRadius: 8,
  },
  logoutButtonContent: {
    height: 48,
  },
});

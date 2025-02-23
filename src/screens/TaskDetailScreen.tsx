import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, Alert, Text} from 'react-native';
import {Button, Menu, TextInput, Portal, Dialog} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from '../store/api';
import {CustomInput} from '../components/CustomInput';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

const PRIORITY_OPTIONS = [
  {label: 'Low', value: 'low'},
  {label: 'Medium', value: 'medium'},
  {label: 'High', value: 'high'},
];

const CATEGORY_OPTIONS = [
  {label: 'Work', value: 'work'},
  {label: 'Personal', value: 'personal'},
  {label: 'Shopping', value: 'shopping'},
  {label: 'Health', value: 'health'},
  {label: 'Education', value: 'education'},
];

const COMPLETION_OPTIONS = [
  {label: 'Not Completed', value: false},
  {label: 'Completed', value: true},
];

const taskSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due date is required'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'])
    .required('Priority is required'),
  category: Yup.string().required('Category is required'),
  completed: Yup.boolean().required('Completion status is required'),
});
export const TaskDetailScreen = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const navigation = useNavigation();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // State for menus and dialog
  const [priorityMenuVisible, setPriorityMenuVisible] = useState(false);
  const [categoryMenuVisible, setCategoryMenuVisible] = useState(false);
  const [completionMenuVisible, setCompletionMenuVisible] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const task = route.params?.task;
  const isEditing = !!task;

  const handleDeleteTask = async () => {
    try {
      const taskId = task?._id || task?.id;
      if (!taskId) {
        throw new Error('No task ID available for deletion');
      }

      await deleteTask(taskId).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Delete task error:', error);
      Alert.alert('Error', 'Failed to delete the task. Please try again.');
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      const taskId = task?._id || task?.id;
      if (!taskId) {
        throw new Error('No task ID available for update');
      }

      await updateTask({
        id: taskId,
        task: {
          ...task,
          completed: true,
        },
      }).unwrap();
      navigation.goBack();
    } catch (error) {
      console.error('Mark as completed error:', error);
      Alert.alert(
        'Error',
        'Failed to mark task as completed. Please try again.',
      );
    }
  };

  return (
    <ScrollView style={styles.container}>
      {isEditing && (
        <View style={styles.actionButtons}>
          <Button
            mode="contained"
            onPress={() => handleMarkAsCompleted()}
            style={[styles.actionButton, styles.completeButton]}
            disabled={task?.completed}>
            Mark as Completed
          </Button>
          <Button
            mode="contained"
            onPress={() => setShowDeleteDialog(true)}
            style={[styles.actionButton, styles.deleteButton]}>
            Delete Task
          </Button>
        </View>
      )}

      <Formik
        initialValues={{
          title: task?.title ?? '',
          description: task?.description ?? '',
          dueDate: task?.dueDate ? new Date(task.dueDate) : new Date(),
          priority: task?.priority ?? 'medium',
          category: task?.category ?? '',
          completed: task?.completed ?? false,
        }}
        validationSchema={taskSchema}
        onSubmit={async values => {
          try {
            const submitValues = {
              ...values,
              dueDate: values.dueDate.toISOString(),
            };

            if (isEditing && task) {
              const taskId = task._id || task.id;
              if (!taskId) {
                throw new Error('No task ID available for update');
              }

              await updateTask({
                id: taskId,
                task: submitValues,
              }).unwrap();
            } else {
              await createTask(submitValues).unwrap();
            }

            navigation.goBack();
          } catch (error) {
            console.error('Task save error:', error);
            Alert.alert('Error', 'Failed to save the task. Please try again.');
          }
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <View>
            <CustomInput
              label="Title"
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              error={touched.title ? errors.title : undefined}
            />

            <CustomInput
              label="Description"
              value={values.description}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              error={touched.description ? errors.description : undefined}
              multiline
              numberOfLines={4}
            />

            {/* Due Date Picker */}
            <TextInput
              label="Due Date"
              value={values.dueDate.toLocaleDateString()}
              onPressIn={() => setShowDatePicker(true)}
              mode="outlined"
              style={styles.input}
              error={touched.dueDate && !!errors.dueDate}
              multiline
              numberOfLines={4}
            />

            {showDatePicker && (
              <DateTimePicker
                value={values.dueDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setFieldValue('dueDate', selectedDate);
                  }
                }}
              />
            )}

            {/* Priority Menu */}
            <Menu
              visible={priorityMenuVisible}
              onDismiss={() => setPriorityMenuVisible(false)}
              anchor={
                <TextInput
                  label="Priority"
                  value={
                    PRIORITY_OPTIONS.find(
                      option => option.value === values.priority,
                    )?.label
                  }
                  onPressIn={() => setPriorityMenuVisible(true)}
                  mode="outlined"
                  style={styles.input}
                  error={touched.priority && !!errors.priority}
                />
              }>
              {PRIORITY_OPTIONS.map(option => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setFieldValue('priority', option.value);
                    setPriorityMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>

            {/* Category Menu */}
            <Menu
              visible={categoryMenuVisible}
              onDismiss={() => setCategoryMenuVisible(false)}
              anchor={
                <TextInput
                  label="Category"
                  value={
                    CATEGORY_OPTIONS.find(
                      option => option.value === values.category,
                    )?.label
                  }
                  onPressIn={() => setCategoryMenuVisible(true)}
                  mode="outlined"
                  style={styles.input}
                  error={touched.category && !!errors.category}
                />
              }>
              {CATEGORY_OPTIONS.map(option => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setFieldValue('category', option.value);
                    setCategoryMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>

            {/* Completion Status Menu */}
            <Menu
              visible={completionMenuVisible}
              onDismiss={() => setCompletionMenuVisible(false)}
              anchor={
                <TextInput
                  label="Completion Status"
                  value={
                    COMPLETION_OPTIONS.find(
                      option => option.value === values.completed,
                    )?.label
                  }
                  onPressIn={() => setCompletionMenuVisible(true)}
                  mode="outlined"
                  style={styles.input}
                  error={touched.completed && !!errors.completed}
                />
              }>
              {COMPLETION_OPTIONS.map(option => (
                <Menu.Item
                  key={option.value.toString()}
                  onPress={() => {
                    setFieldValue('completed', option.value);
                    setCompletionMenuVisible(false);
                  }}
                  title={option.label}
                />
              ))}
            </Menu>

            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              style={styles.submitButton}>
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </View>
        )}
      </Formik>
      <Portal>
        <Dialog
          visible={showDeleteDialog}
          onDismiss={() => setShowDeleteDialog(false)}>
          <Dialog.Title>Delete Task</Dialog.Title>
          <Dialog.Content>
            <Text>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setShowDeleteDialog(false);
                handleDeleteTask();
              }}>
              Delete
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  completeButton: {
    backgroundColor: '#4CAF50',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  input: {
    marginVertical: 8,
  },
  submitButton: {
    marginTop: 16,
  },
});
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Button} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useCreateTaskMutation, useUpdateTaskMutation} from '../store/api';
import {CustomInput} from '../components/CustomInput';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/types';

type TaskDetailScreenRouteProp = RouteProp<RootStackParamList, 'TaskDetail'>;

const taskSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due date is required'),
  priority: Yup.string()
    .oneOf(['low', 'medium', 'high'])
    .required('Priority is required'),
  category: Yup.string().required('Category is required'),
});

export const TaskDetailScreen = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const navigation = useNavigation();
  const [createTask] = useCreateTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  const task = route.params?.task;
  const isEditing = !!task;

  return (
    <ScrollView style={styles.container}>
      <Formik
        initialValues={{
          title: task?.title ?? '',
          description: task?.description ?? '',
          dueDate: task?.dueDate ?? new Date().toISOString(),
          priority: task?.priority ?? 'medium',
          category: task?.category ?? '',
        }}
        validationSchema={taskSchema}
        onSubmit={async values => {
          try {
            if (isEditing && task) {
              await updateTask({id: task.id, task: values}).unwrap();
            } else {
              await createTask(values).unwrap();
            }
            navigation.goBack();
          } catch (error) {
            console.error('Task save error:', error);
          }
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <View>
            <CustomInput
              label="Title"
              value={values.title}
              onChangeText={handleChange('title')}
              onBlur={handleBlur('title')}
              error={touched.title && errors.title}
            />
            <CustomInput
              label="Description"
              value={values.description}
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              error={touched.description && errors.description}
              multiline
              numberOfLines={4}
            />
            <CustomInput
              label="Due Date"
              value={values.dueDate}
              onChangeText={handleChange('dueDate')}
              onBlur={handleBlur('dueDate')}
              error={touched.dueDate && errors.dueDate}
            />
            <CustomInput
              label="Priority"
              value={values.priority}
              onChangeText={handleChange('priority')}
              onBlur={handleBlur('priority')}
              error={touched.priority && errors.priority}
            />
            <CustomInput
              label="Category"
              value={values.category}
              onChangeText={handleChange('category')}
              onBlur={handleBlur('category')}
              error={touched.category && errors.category}
            />
            <Button mode="contained" onPress={() => handleSubmit()}>
              {isEditing ? 'Update Task' : 'Create Task'}
            </Button>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

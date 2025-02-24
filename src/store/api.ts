import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {Task, User, LoginCredentials, RegisterCredentials} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import {API_BASE_URL} from '@env'

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://task-manager-backend-khpd.onrender.com',
  prepareHeaders: async headers => {
    const token = (await AsyncStorage.getItem('token')) || '';
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  baseQuery,
  tagTypes: ['Task'],
  endpoints: builder => ({
    validateToken: builder.query<{user: User}, void>({
      query: () => ({
        url: '/auth/validate', // Make sure this matches your backend endpoint
        method: 'GET',
      }),
    }),
    login: builder.mutation<{token: string; user: User}, LoginCredentials>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<
      {token: string; user: User},
      RegisterCredentials
    >({
      query: credentials => ({
        url: '/auth/signup',
        method: 'POST',
        body: credentials,
      }),
    }),
    getTasks: builder.query<Task[], void>({
      query: () => '/tasks',
      providesTags: ['Task'],
    }),
    getTask: builder.query<Task, string>({
      query: id => `/tasks/${id}`,
      providesTags: ['Task'],
    }),
    createTask: builder.mutation<Task, Partial<Task>>({
      query: task => ({
        url: '/tasks',
        method: 'POST',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    updateTask: builder.mutation<Task, {id: string; task: Partial<Task>}>({
      query: ({id, task}) => ({
        url: `/tasks/${id}`,
        method: 'PUT',
        body: task,
      }),
      invalidatesTags: ['Task'],
    }),
    deleteTask: builder.mutation<void, string>({
      query: id => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useValidateTokenQuery,
  useLazyValidateTokenQuery,
} = api;

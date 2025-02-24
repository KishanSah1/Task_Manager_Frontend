import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useSelector} from 'react-redux';
import {RootState} from '../store';

import {LoginScreen} from '../screens/LoginScreen';
import {RegisterScreen} from '../screens/RegisterScreen';
import {HomeScreen} from '../screens/HomeScreen';
import {CategoriesScreen} from '../screens/CategoriesScreen';
import {CompletedTasksScreen} from '../screens/CompletedTasksScreen';
import {ProfileScreen} from '../screens/ProfileScreen';
import {TaskDetailScreen} from '../screens/TaskDetailScreen';
import { Task } from './types';

import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faList, faCheckCircle, faUser } from '@fortawesome/free-solid-svg-icons';


// Explicitly define the param lists
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TaskDetail: {task?: Task};
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Categories: undefined;
  CompletedTasks: undefined;
  Profile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const AuthNavigator = () => (
  <AuthStack.Navigator>
    <AuthStack.Screen
      name="Login"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <AuthStack.Screen
      name="Register"
      component={RegisterScreen}
      options={{headerShown: false}}
    />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ color, size }) => {
          let icon;

          if (route.name === 'Home') {
            icon = faHome;
          } else if (route.name === 'Categories') {
            icon = faList;
          } else if (route.name === 'CompletedTasks') {
            icon = faCheckCircle;
          } else if (route.name === 'Profile') {
            icon = faUser;
          }

          return <FontAwesomeIcon icon={icon} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#4c348b',

        tabBarInactiveTintColor: 'black',
      })}
    >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{headerShown: true}}
    />
    <Tab.Screen
      name="Categories"
      component={CategoriesScreen}
      options={{headerShown: true}}
    />
    <Tab.Screen
      name="CompletedTasks"
      component={CompletedTasksScreen}
      options={{headerShown: true}}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{headerShown: true}}
    />
  </Tab.Navigator>
);

export const Navigation = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <Stack.Screen
          name="Auth"
          component={AuthNavigator}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="Main"
            component={MainNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="TaskDetail"
            component={TaskDetailScreen}
            options={{title: 'Task Details'}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
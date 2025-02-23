import {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from '../store';
import {
  useLoginMutation,
  useRegisterMutation,
  useValidateTokenQuery,
} from '../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {setCredentials, logout} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  // Fetch user validation from API on app load
  const {data, error, isFetching} = useValidateTokenQuery(undefined, {
    skip: !auth.token, // Skip validation if no token is stored
  });

  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken && data?.user) {
        dispatch(setCredentials({token: storedToken, user: data.user}));
      } else if (error) {
        dispatch(logout());
      }
    };
    restoreSession();
  }, [data, error, dispatch]);

  // Handle login
  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({email, password}).unwrap();
      await AsyncStorage.setItem('token', result.token);
      dispatch(setCredentials(result));
    } catch (error) {
      throw error;
    }
  };

  // Handle registration
  const handleRegister = async (
    email: string,
    password: string,
    username: string,
  ) => {
    try {
      const result = await register({email, password, username}).unwrap();
      await AsyncStorage.setItem('token', result.token);
      dispatch(setCredentials(result));
    } catch (error) {
      throw error;
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    isLoading: isFetching, // Shows loading state while validating session
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};

import {useSelector} from 'react-redux';
import {RootState} from '../store';
import {useLoginMutation, useRegisterMutation} from '../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {setCredentials, logout} from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();

  const handleLogin = async (email: string, password: string) => {
    try {
      const result = await login({email, password}).unwrap();
      await AsyncStorage.setItem('token', result.token);
      dispatch(setCredentials(result));
    } catch (error) {
      throw error;
    }
  };

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

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch(logout());
  };

  return {
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
};

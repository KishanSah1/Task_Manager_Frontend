import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useAuth} from '../hooks/useAuth';
import {CustomInput} from '../components/CustomInput';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigation/types';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Too short!').required('Password is required'),
});

export const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {login} = useAuth();

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={loginSchema}
        onSubmit={async values => {
          try {
            await login(values.email, values.password);
          } catch (error) {
            console.error('Login error:', error);
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
          <>
            <CustomInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email ? errors.email : undefined}
              keyboardType="email-address"
            />

            <CustomInput
              label="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password ? errors.password : undefined}
              secureTextEntry
            />
            <Button mode="contained" onPress={() => handleSubmit()}>
              Login
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('Register')}>
              Don't have an account? Register
            </Button>
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
});

import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useAuth} from '../hooks/useAuth';
import {CustomInput} from '../components/CustomInput';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigation/types';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

const registerSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Too short!').required('Password is required'),
});

export const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
  const {register} = useAuth();

  return (
    <View style={styles.container}>
      <Formik
        initialValues={{username: '', email: '', password: ''}}
        validationSchema={registerSchema}
        onSubmit={async values => {
          try {
            await register(values.email, values.password, values.username);
          } catch (error) {
            console.error('Register error:', error);
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
              label="Username"
              value={values.username}
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              error={touched.username && errors.username}
            />
            <CustomInput
              label="Email"
              value={values.email}
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              error={touched.email && errors.email}
              keyboardType="email-address"
            />
            <CustomInput
              label="Password"
              value={values.password}
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              error={touched.password && errors.password}
              secureTextEntry
            />
            <Button mode="contained" onPress={() => handleSubmit()}>
              Register
            </Button>
            <Button mode="text" onPress={() => navigation.navigate('Login')}>
              Already have an account? Login
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

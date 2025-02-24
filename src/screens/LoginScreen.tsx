import React from 'react';
import {View, StyleSheet, Text, SafeAreaView} from 'react-native';
import {Button, useTheme} from 'react-native-paper';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {useAuth} from '../hooks/useAuth';
import {CustomInput} from '../components/CustomInput';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParamList} from '../navigation/types';
import LinearGradient from 'react-native-linear-gradient';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
};

const loginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Too short!').required('Password is required'),
});

export const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
  const {login} = useAuth();
  const theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#F8F9FA', '#E9ECEF']} style={styles.gradient}>
        <View style={styles.content}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>TaskFlow</Text>
            <Text style={styles.subtitle}>
              Where Productivity Meets Simplicity
            </Text>
          </View>

          <View style={styles.formContainer}>
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
                    style={styles.input}
                  />

                  <CustomInput
                    label="Password"
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    error={touched.password ? errors.password : undefined}
                    secureTextEntry
                    style={styles.input}
                  />
                  <Button
                    mode="contained"
                    onPress={() => handleSubmit()}
                    style={styles.loginButton}
                    labelStyle={styles.buttonLabel}>
                    Login
                  </Button>
                  <Button
                    mode="text"
                    onPress={() => navigation.navigate('Register')}
                    style={styles.registerButton}
                    labelStyle={styles.registerButtonLabel}>
                    New to TaskFlow? Create an account
                  </Button>
                </>
              )}
            </Formik>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>
              Organize • Prioritize • Accomplish
            </Text>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    elevation: 1,
  },
  loginButton: {
    marginTop: 24,
    marginBottom: 16,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: '#3498DB',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  registerButton: {
    marginTop: 8,
  },
  registerButtonLabel: {
    fontSize: 14,
    color: '#3498DB',
  },
  footerContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  footerText: {
    color: '#95A5A6',
    fontSize: 14,
    fontStyle: 'italic',
  },
});

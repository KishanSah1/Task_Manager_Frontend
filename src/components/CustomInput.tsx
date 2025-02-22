import React from 'react';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-paper';

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  secureTextEntry?: boolean;
  [key: string]: any;
}

export const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  error,
  secureTextEntry,
  ...props
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      error={!!error}
      secureTextEntry={secureTextEntry}
      style={styles.input}
      mode="outlined"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    marginVertical: 8,
  },
});

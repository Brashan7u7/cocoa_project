
import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  ...textInputProps
}) => {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-semibold text-gray-700 mb-2">
          {label}
        </Text>
      )}
      
      <View className="relative">
        {icon && (
          <View className="absolute left-4 top-4 z-10">
            {icon}
          </View>
        )}
        
        <TextInput
          className={`
            bg-white border-2 rounded-xl px-4 py-3 text-base
            ${icon ? 'pl-12' : ''}
            ${error ? 'border-red-500' : 'border-gray-200'}
          `}
          placeholderTextColor="#9CA3AF"
          {...textInputProps}
        />
      </View>
      
      {error && (
        <Text className="text-sm text-red-600 mt-1">
          {error}
        </Text>
      )}
      
      {helperText && !error && (
        <Text className="text-sm text-gray-500 mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
};



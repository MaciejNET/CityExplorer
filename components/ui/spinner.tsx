import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Box } from './box';
import { Text } from './text';

interface SpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  fullScreen?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ 
  size = 'large', 
  color = '#0891b2', 
  text,
  fullScreen = false
}) => {
  const content = (
    <Box className={`items-center justify-center ${fullScreen ? 'flex-1' : 'py-4'}`}>
      <ActivityIndicator size={size} color={color} />
      {text && <Text className="mt-2 text-center">{text}</Text>}
    </Box>
  );

  if (fullScreen) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {content}
      </View>
    );
  }

  return content;
};
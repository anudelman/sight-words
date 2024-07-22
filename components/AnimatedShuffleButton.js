// components/AnimatedShuffleButton.js
import React from 'react';
import { View, Pressable } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const AnimatedShuffleButton = ({ onPress }) => {
  const scale = useSharedValue(1);
  const insets = useSafeAreaInsets();

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: 'blue',
    };
  });

  const handlePressIn = () => {
    onPress();
    scale.value = withSpring(0.8, {}, () => {
      scale.value = withSpring(1);
    });
  };

  return (
    <View style={{ paddingBottom: insets.bottom + 16 }}>
      <Pressable onPressIn={handlePressIn}>
        <Animated.View style={animatedStyles}>
          <Ionicons name="shuffle-outline" size={56} color="#65A30D" />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default AnimatedShuffleButton;

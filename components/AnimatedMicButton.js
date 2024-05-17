import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native"; // Ensure TouchableOpacity is imported
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import { useSafeAreaInsets } from "react-native-safe-area-context"; // Import useSafeAreaInsets

async function requestMicrophonePermission() {
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== "granted") {
    alert("Sorry, we need microphone permissions to make this work!");
    return false;
  }
  return true;
}

const AnimatedMicButton = ({ startRecording, stopRecording, recording }) => {
  const [isRecording, setIsRecording] = useState(false);
  const scale = useSharedValue(1);
  const insets = useSafeAreaInsets(); // Get the safe area insets

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = async () => {
    const hasPermission = await requestMicrophonePermission();
    if (hasPermission) {
      if (isRecording) {
        stopRecording();
        setIsRecording(false);
      } else {
        startRecording();
        setIsRecording(true);
      }
      scale.value = withSpring(.8, {}, () => {
        scale.value = withSpring(1);
      });
    }
  };

  return (
    <View style={{ paddingBottom: insets.bottom + 16 }}>
      <TouchableOpacity onPress={handlePress}>
        <Animated.View style={animatedStyles}>
          <Ionicons name={isRecording ? "mic-outline": "mic-off-outline"} size={56} color="black" />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export default AnimatedMicButton;

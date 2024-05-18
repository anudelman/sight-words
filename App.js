import React, { useState, useEffect, useRef } from "react";
import { View, Dimensions, StyleSheet, FlatList, TouchableOpacity, Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Speech from "expo-speech";
import { Audio } from "expo-av";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import AnimatedMicButton from "./components/AnimatedMicButton";
import { useFonts, IrishGrover_400Regular } from "@expo-google-fonts/irish-grover";
import Constants from 'expo-constants';

const googleApiKey = Constants.expoConfig.extra.googleApiKey;

const { width, height } = Dimensions.get("window");

const AnimatedBackground = ({ animatedWidth }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: animatedWidth.value,
      backgroundColor: 'green',
      height: height,
      position: 'absolute',
      left: 0,
      top: 0,
    };
  });

  return <Animated.View style={animatedStyle} />;
};

export default function App() {
  const [fontsLoaded] = useFonts({
    IrishGrover_400Regular,
  });

  const [recording, setRecording] = useState(null);
  const intervalRef = useRef(null);
  const animatedWidth = useSharedValue(0);

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Clear the interval when the component unmounts
  }, []);

  const words = [
    "the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", 
    "for", "on", "are", "as", "with", "his", "they", "I", "at", "be", "this", 
    "have", "from", "or", "one", "had", "by", "word", "but", "not", "what", 
    "all", "were", "we", "when", "your", "can", "said", "there", "use", "an", 
    "each", "which", "she", "do", "how", "their", "if", "will", "up", "other", 
    "about", "out", "many", "then", "them", "these", "so", "some", "her", 
    "would", "make", "like", "him", "into", "time", "has", "look", "two", 
    "more", "write", "go", "see", "number", "no", "way", "could", "people", 
    "my", "than", "first", "water", "been", "call", "who", "oil", "its", "now", 
    "find", "long", "down", "day", "did", "get", "come", "made", "may", "part",
  ];

  const handleWordTap = (word) => {
    Speech.speak(word);
  };

  async function startRecording() {
    const permission = await Audio.requestPermissionsAsync();
    if (permission.status !== "granted") {
      console.error("Permission to access microphone not granted");
      return;
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.caf',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        meteringEnabled: true,
      });
      await recording.startAsync();
      setRecording(recording);
      console.log("Recording started successfully");
      monitorRecording(recording);
    } catch (error) {
      console.error("Failed to start recording:", error);
      if (recording) {
        console.error("Recording status:", await recording.getStatusAsync());
      }
    }
  }

  async function stopRecording() {
    try {
      if (!recording) return;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      console.log("Recording stopped successfully", uri);
      sendAudioToGoogle(uri);
      setRecording(null);
      animatedWidth.value = withSpring(0);
      clearInterval(intervalRef.current); // Clear the interval when stopping the recording
    } catch (error) {
      console.error("Failed to stop recording:", error);
      if (recording) {
        console.error("Recording status:", await recording.getStatusAsync());
      }
    }
  }

  async function sendAudioToGoogle(uri) {
    const audioFile = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
  
    const googleAPI = `https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`;
    const body = JSON.stringify({
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: "en-US",
      },
      audio: {
        content: audioFile,
      },
    });
  
    fetch(googleAPI, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body,
    })
      .then((response) => response.json())
      .then((data) => handleGoogleResponse(data))
      .catch((error) => console.error("Error contacting Google API", error));
  }

  function handleGoogleResponse(data) {
    const transcript = data.results?.[0]?.alternatives?.[0]?.transcript;
    console.log("Google API response transcript:", transcript);
  }

  function monitorRecording(recording) {
    intervalRef.current = setInterval(async () => {
      if (recording) {
        const status = await recording.getStatusAsync();
        console.log("Recording status:", status);

        if (status.isRecording) {
          // Ensure metering is enabled and valid
          if (status.metering === undefined || status.metering === null) {
            console.error("Metering not enabled or not supported on this device.");
          } else {
            const volume = status.metering;
            console.log("Current volume level:", volume);

            // Ensure the metering value is valid before calculating the normalized width
            if (!isNaN(volume) && volume !== -160) {
              const normalizedWidth = Math.max(0, Math.min(width, (volume / -160) * width));
              console.log("Normalized width:", normalizedWidth);
              animatedWidth.value = withSpring(normalizedWidth, { damping: 20, stiffness: 90 });
            }
          }
        }
      }
    }, 100);
  }

  

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AnimatedBackground animatedWidth={animatedWidth} />
        <FlatList
          data={words}
          renderItem={({ item }) => (
            <View style={[styles.wordContainer, { width: width }]}>
              <TouchableOpacity onPress={() => handleWordTap(item)}>
                <Text style={[styles.text, { fontFamily: "IrishGrover_400Regular" }]}>{item}</Text>
              </TouchableOpacity>
            </View>
          )}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
        />
        <AnimatedMicButton startRecording={startRecording} stopRecording={stopRecording} recording={recording} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D9F99D",
  },
  wordContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: "#65A30D",
    fontSize: 64,
  },
});

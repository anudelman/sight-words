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
      backgroundColor: '#BEF264',
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
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const intervalRef = useRef(null);
  const animatedWidth = useSharedValue(0);
  const flatListRef = useRef();  // Reference to the FlatList
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (flatListRef.current && words.length > 1) {
        flatListRef.current.scrollToOffset({ animated: true, offset: width / 2 });
        setTimeout(() => {
          flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        }, 800);  // Return to initial position after 800ms
      }
    }, 1000);  // Initial delay of 1000ms

    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
      if (recording) {
        stopRecording();
      }
    };
  }, []);

  const handleWordTap = (word) => {
    Speech.speak(word);
  };

  async function startRecording() {
    try {
      if (permissionResponse.status !== 'granted') {
        console.log('Requesting permission..');
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log('Starting recording..');
      const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      setRecording(recording);
      console.log('Recording started');
      monitorRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  }

  async function stopRecording() {
    console.log('Stopping recording..');
    if (!recording) return;
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const uri = recording.getURI();
    console.log('Recording stopped and stored at', uri);
    sendAudioToGoogle(uri);
    animatedWidth.value = withSpring(0);
    clearInterval(intervalRef.current); // Clear the interval when stopping the recording
  }

  async function sendAudioToGoogle(uri) {
    try {
      const audioFile = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
      console.log('Sending audio file to Google API...');

      const googleAPI = `https://speech.googleapis.com/v1/speech:recognize?key=${googleApiKey}`;
      const body = JSON.stringify({
        config: {
          encoding: "LINEAR16", // Adjust the encoding format as per your recorded audio
          sampleRateHertz: 44100, // Adjust the sample rate as per your recorded audio
          languageCode: "en-US",
        },
        audio: {
          content: audioFile,
        },
      });

      const response = await fetch(googleAPI, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      });

      const data = await response.json();
      console.log('Google API response received:', data);
      handleGoogleResponse(data);
    } catch (error) {
      console.error("Error contacting Google API", error);
    }
  }

  function handleGoogleResponse(data) {
    if (data.error) {
      console.error("Google API error:", data.error);
      return;
    }

    const transcript = data.results?.[0]?.alternatives?.[0]?.transcript;
    console.log("Google API response transcript:", transcript);

    if (!transcript) {
      console.warn("No transcript received from Google API.");
      return;
    }

    const currentWord = words[currentWordIndex];
    const similarity = calculateSimilarity(transcript, currentWord);
    animatedWidth.value = withSpring(similarity * width, { damping: 20, stiffness: 90 });

    if (similarity > 0.8) {
      advanceToNextWord();
    }
  }

  function calculateSimilarity(transcript, word) {
    if (!transcript || !word) return 0;

    const transcriptWords = transcript.toLowerCase().split(" ");
    const targetWord = word.toLowerCase();
    let maxSimilarity = 0;

    transcriptWords.forEach((tWord) => {
      let similarity = 0;
      const minLen = Math.min(tWord.length, targetWord.length);
      for (let i = 0; i < minLen; i++) {
        if (tWord[i] === targetWord[i]) similarity++;
      }
      similarity /= targetWord.length;
      maxSimilarity = Math.max(maxSimilarity, similarity);
    });

    return maxSimilarity;
  }

  function advanceToNextWord() {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex((prevIndex) => prevIndex + 1);
      flatListRef.current.scrollToIndex({ index: currentWordIndex + 1, animated: true });
    }
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

            if (volume < -80) {
              animatedWidth.value = withSpring(0, { damping: 20, stiffness: 90 });
            }
          }
        }
      }
    }, 100);
  }

  if (!fontsLoaded) {
    return null; // or a loading spinner
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AnimatedBackground animatedWidth={animatedWidth} />
        <FlatList
          ref={flatListRef}  // Attach the ref to the FlatList
          data={words}
          renderItem={({ item, index }) => (
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

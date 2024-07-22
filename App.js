import React, { useEffect, useRef, useState } from "react";
import { View, Dimensions, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as Speech from "expo-speech";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts, FredokaOne_400Regular } from '@expo-google-fonts/fredoka-one';
import RestartIcon from "./components/RestartIcon";
import SlowRestIcon from "./components/SlowRestIcon";
import SlowActiveIcon from "./components/SlowActiveIcon";
import ShuffleIcon from "./components/ShuffleIcon";
import SpeakIcon from "./components/SpeakIcon";

const { width, height } = Dimensions.get("window");

const AnimatedBackground = ({ animatedWidth }) => {
  const animatedStyle = {
    width: animatedWidth,
    height: height,
    position: 'absolute',
    left: 0,
    top: 0,
  };

  return <View style={animatedStyle} />;
};

export default function App() {
  useEffect(() => {
    // Removed getPermissions call since TTS does not require it
  }, []);

  const [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
  });

  const animatedWidth = width;
  const flatListRef = useRef();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSlowActive, setIsSlowActive] = useState(false); // State for Slow button

  const words = [
    "a", "I", "the", "to", "is", "you", "he", "it", "we", "an",
    "in", "at", "on", "and", "up", "am", "of", "be", "me", "do",
    "no", "so", "go", "my", "by", "as", "but", "or", "had", "has",
    "was", "not", "his", "her", "she", "all", "can", "did", "him",
    "see", "for", "got", "how", "day", "may", "say", "out", "now",
    "then", "this", "that", "will", "with", "from", "came", "made",
    "were", "when", "what", "them", "like", "have", "here", "some",
    "could", "down", "which", "their", "there", "more", "look", "who",
    "long", "word", "know", "come", "find", "many", "first", "only",
    "just", "went", "say", "over", "about", "right", "because", "people",
    "give", "work", "must", "put", "again", "number", "these", "would",
    "every", "always", "under", "most", "other", "very", "want", "too",
    "where", "went", "call", "thought", "school", "before", "after",
    "around", "house", "small", "great", "should", "another", "near",
    "through", "father", "water", "large", "together", "find", "don't",
    "world", "learn", "might", "walk", "also", "head", "light", "high",
    "saw", "year", "night", "mother", "change", "four", "kind", "away",
    "move", "both", "along", "carry", "answer", "eye", "earth", "thought",
    "always"
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (flatListRef.current && words.length > 1) {
        flatListRef.current.scrollToOffset({ animated: true, offset: width / 2 });
        setTimeout(() => {
          flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
        }, 800);
      }
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentWordIndex(index);
  };

  const scrollToRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    flatListRef.current.scrollToIndex({ index: randomIndex, animated: true });
    setCurrentWordIndex(randomIndex);
  };

  const getItemLayout = (data, index) => (
    { length: width, offset: width * index, index }
  );

  const speakCurrentWord = () => {
    const currentWord = words[currentWordIndex];
    const rate = isSlowActive ? 0.1 : 1.0; // Set the rate based on the slow mode
    Speech.speak(currentWord, { rate });
  };

  const toggleSlowMode = () => {
    setIsSlowActive(!isSlowActive);
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <AnimatedBackground animatedWidth={animatedWidth} />
        <FlatList
          ref={flatListRef}
          data={words}
          renderItem={({ item }) => (
            <View style={[styles.wordContainer, { width: width }]}>
              <Text style={styles.text}>{item}</Text>
            </View>
          )}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          snapToInterval={width}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          onScroll={handleScroll}
          getItemLayout={getItemLayout}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => flatListRef.current.scrollToIndex({ index: 0, animated: true })} style={styles.iconButton}>
            <RestartIcon width={80} height={80} />
            <Text style={styles.iconButtonText}>Restart</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleSlowMode} style={styles.iconButton}>
            {isSlowActive ? <SlowActiveIcon /> : <SlowRestIcon />}
            <Text style={styles.iconButtonText}>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={speakCurrentWord} style={styles.iconButton}>
            <SpeakIcon />
            <Text style={styles.iconButtonText}>Speak</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={scrollToRandomWord} style={styles.iconButton}>
            <ShuffleIcon />
            <Text style={styles.iconButtonText}>Shuffle</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: '#D9F99D'
  },
  wordContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    color: "#3F6212",
    fontSize: 64,
    fontFamily: "FredokaOne_400Regular",
  },
  buttonContainer: {
    
    height: 102.33,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    bottom: 20,
    display: 'flex',
    gap: 12
  },
  iconButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonText: {
    color: '#4D7C0F',
    fontFamily: "Fredoka One",
    fontSize: 14,
    fontStyle: "normal",
    fontWeight: 400,
    lineHeight: "normal",
    letterSpacing: -0.24,
    marginTop: 8
  },
});

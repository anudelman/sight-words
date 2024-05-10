import React, { useState } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, FlatList, useColorScheme, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window'); // Get the full width of the device screen

export default function App() {
  const colorScheme = useColorScheme();
  const [currentIndex, setCurrentIndex] = useState(0);
    const words = [
      "the", "of", "and", "a", "to", "in", "is", "you", "that", "it", "he", "was", "for", "on", "are", 
      "as", "with", "his", "they", "I", "at", "be", "this", "have", "from", "or", "one", "had", "by", "word", 
      "but", "not", "what", "all", "were", "we", "when", "your", "can", "said", "there", "use", "an", "each", "which", 
      "she", "do", "how", "their", "if", "will", "up", "other", "about", "out", "many", "then", "them", "these", "so", 
      "some", "her", "would", "make", "like", "him", "into", "time", "has", "look", "two", "more", "write", "go", "see", 
      "number", "no", "way", "could", "people", "my", "than", "first", "water", "been", "call", "who", "oil", "its", "now", 
      "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"
    ];

  function preprocessTextForSpeech(text) {
    return text.replace(/\bI\b/g, 'I.');  // not doing text.replace with this less formal approach causes the speech synthesizer to say, "Capital I"
  }

  const handleWordTap = (word) => {
    const processedWordForSpeech = preprocessTextForSpeech(word);
    Speech.speak(processedWordForSpeech);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.wordContainer, { width: width }]}>
      <TouchableOpacity onPress={() => handleWordTap(item)}>
        <Text style={colorScheme === 'dark' ? styles.darkThemeText : styles.lightThemeText}>{item}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={colorScheme === 'dark' ? styles.containerDark : styles.containerLight}>
      <FlatList
        data={words}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        snapToAlignment="center"
        snapToInterval={width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
      />
      <TouchableOpacity
        style={styles.microphoneButton}
        onPressIn={() => {}}  // Adjusted to do nothing on press
        onPressOut={() => {}}
      >
        <Ionicons name="mic-outline" size={48} color="white" />
      </TouchableOpacity>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  containerLight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  containerDark: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  wordContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  darkThemeText: {
    color: '#fff',
    fontSize: 64,
  },
  lightThemeText: {
    color: '#000',
    fontSize: 64,
  },
  microphoneButton: {
    position: 'absolute',
    bottom: 50,
    backgroundColor: '#007AFF',
    borderRadius: 100,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});


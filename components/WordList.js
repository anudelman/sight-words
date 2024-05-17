import React from "react";
import { View, FlatList, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WordList = ({ words, currentIndex, showCheckmark, handleWordTap, colorScheme, width }) => {
  const renderItem = ({ item }) => {
    const isCorrectItem = showCheckmark && item === words[currentIndex];

    return (
      <View style={[styles.wordContainer, { width: width }]}>
        <TouchableOpacity
          onPress={() => !isCorrectItem && handleWordTap(item)}
          disabled={isCorrectItem}
          style={colorScheme === "dark" ? styles.darkThemeText : styles.lightThemeText}
        >
          {isCorrectItem ? (
            <Ionicons name="checkmark-circle" size={64} color="green" />
          ) : (
            <Text style={colorScheme === "dark" ? styles.darkThemeText : styles.lightThemeText}>
              {item}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
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
      scrollEnabled={!showCheckmark}
    />
  );
};

const styles = StyleSheet.create({
  wordContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  darkThemeText: {
    color: "#fff",
    fontSize: 80,
  },
  lightThemeText: {
    color: "#000",
    fontSize: 80,
  },
});

export default WordList;

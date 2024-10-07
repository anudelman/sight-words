import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { words } from "../components/words";
import * as Speech from "expo-speech";

const ModalScreen = ({ navigation }) => {
  const speakWord = (word) => {
    const rate = 1.0; // Adjust this rate as needed
    Speech.speak(word, { rate });
  };

  return (
    <SafeAreaView style={styles.modalSafeArea}>
      <View style={styles.modalContent}>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.gridContainer}
        >
          {words.map((word, index) => (
            <TouchableOpacity
              key={index}
              style={styles.wordItem}
              onPress={() => speakWord(word)}
            >
              <Text style={styles.listText}>{word}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: "#ECFCCB",
  },
  modalContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  wordItem: {
    width: "48%",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
    paddingHorizontal: 30,
    paddingVertical: 40,
    backgroundColor: "#D9F99D",
    borderRadius: 16,
  },
  listText: {
    color: "#3F6212",
    fontSize: 22,
    fontFamily: "Fredoka One",
  },
});

export default ModalScreen;

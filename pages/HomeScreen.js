import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import {
  useFonts,
  FredokaOne_400Regular,
} from "@expo-google-fonts/fredoka-one";
import * as ScreenOrientation from "expo-screen-orientation";
import IconButton from "../components/IconButton";
import RestartIcon from "../components/RestartIcon";
import SlowRestIcon from "../components/SlowRestIcon";
import SlowActiveIcon from "../components/SlowActiveIcon";
import ShuffleIcon from "../components/ShuffleIcon";
import SpeakIcon from "../components/SpeakIcon";
import CustomHeader from "../components/CustomHeader";
import { words } from "../components/words";
import * as Speech from "expo-speech";

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets(); // Get the insets for the safe areas
  const [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
  });
  const flatListRef = useRef(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSlowActive, setIsSlowActive] = useState(false);
  const [isLandscape, setIsLandscape] = useState(false);

  const buttonWidth = 80; // Define the width of the buttons
  const buttonGap = 10; // Gap between buttons

  const handleOrientationChange = async () => {
    const orientation = await ScreenOrientation.getOrientationAsync();
    const isLandscape =
      orientation === ScreenOrientation.Orientation.LANDSCAPE_LEFT ||
      orientation === ScreenOrientation.Orientation.LANDSCAPE_RIGHT;
    setIsLandscape(isLandscape);
  };

  useEffect(() => {
    handleOrientationChange();
    const subscription = ScreenOrientation.addOrientationChangeListener(
      handleOrientationChange
    );
  
    // Start the partial scroll after 1 second delay
    setTimeout(() => {
      scrollToSecondWordPartially();
    }, 1000); // 1 second delay
  
    return () => {
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);
  
  // Function to scroll partially to the second word
  const scrollToSecondWordPartially = () => {
    if (flatListRef.current) {
      const partialScrollOffset = width * .5; // Adjust this value to reveal only the first 2 letters
  
      // Scroll partially to the second word
      flatListRef.current.scrollToOffset({ offset: partialScrollOffset, animated: true });
  
      // Scroll back to the first word after a short delay (e.g., 1 second)
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: 0, animated: true });
      }, 1000); // Adjust delay as needed before scrolling back
    }
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentWordIndex(index);
  };

  const scrollToRandomWord = () => {
    if (flatListRef.current) {
      const randomIndex = Math.floor(Math.random() * words.length);
      flatListRef.current.scrollToIndex({ index: randomIndex, animated: true });
      setCurrentWordIndex(randomIndex);
    }
  };

  const speakCurrentWord = () => {
    const currentWord = words[currentWordIndex];
    const rate = isSlowActive ? 0.1 : 1.0;
    Speech.speak(currentWord, { rate });
  };

  const toggleSlowMode = () => {
    setIsSlowActive(!isSlowActive);
  };

  // Function to calculate dynamic font size based on word length and container width
  const calculateFontSize = (word) => {
    const maxFontSize = isLandscape ? 128 : 80;
    const minFontSize = 70;
    const availableWidth = isLandscape
      ? width - insets.left - insets.right - buttonWidth - buttonGap * 2 // Landscape adjustment
      : width - insets.left - insets.right; // Portrait adjustment

    const wordLengthFactor = availableWidth / word.length; // Space per letter
    const fontSize = Math.min(Math.max(wordLengthFactor, minFontSize), maxFontSize);
    
    return fontSize;
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {!isLandscape && (
          <CustomHeader
            onAvatarPress={() => navigation.navigate("Settings")}
            onSwitchIconPress={() => navigation.navigate("Modal")}
          />
        )}
        <View
          style={
            isLandscape ? styles.landscapeContainer : styles.portraitContainer
          }
        >
          <FlatList
            ref={flatListRef}
            data={words}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            onScroll={handleScroll}
            renderItem={({ item }) => (
              <View
                style={[
                  styles.wordContainer,
                  {
                    width: isLandscape
                      ? width - insets.left - insets.right - buttonWidth - buttonGap * 2 // Landscape adjustment
                      : width - insets.left - insets.right, // Portrait adjustment (just account for safe areas)
                  },
                ]}
              >
                <Text
                  style={{
                    color: "#3F6212",
                    fontSize: calculateFontSize(item), // Dynamically calculate font size
                    fontFamily: "FredokaOne_400Regular",
                  }}
                >
                  {item}
                </Text>
              </View>
            )}
            showsHorizontalScrollIndicator={false}
            getItemLayout={(data, index) => ({
              length: width,
              offset: width * index,
              index,
            })}
          />

          <View
            style={
              isLandscape
                ? styles.landscapeButtonContainer
                : styles.portraitButtonContainer
            }
          >
            <IconButton
              size={80}
              label={isLandscape ? "" : "Restart"}
              icon={<RestartIcon />}
              onPress={() =>
                flatListRef.current.scrollToIndex({ index: 0, animated: true })
              }
            />
            <IconButton
              size={80}
              label={isLandscape ? "" : "Slow"}
              icon={isSlowActive ? <SlowActiveIcon /> : <SlowRestIcon />}
              onPress={toggleSlowMode}
            />
            <IconButton
              size={80}
              icon={<SpeakIcon />}
              label={isLandscape ? "" : "Speak"}
              onPress={speakCurrentWord}
            />
            <IconButton
              size={80}
              icon={<ShuffleIcon />}
              label={isLandscape ? "" : "Shuffle"}
              onPress={scrollToRandomWord}
            />
          </View>
        </View>

        <StatusBar style="dark-content" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ECFCCB",
  },
  portraitContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  landscapeContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 0,
    width: "100%",
    height: "100%",
  },
  wordContainer: {
    justifyContent: "center",
    height: "100%",
    alignItems: "center",
    padding: 20,
    flex: 1,
  },
  portraitButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  landscapeButtonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingLeft: 10,
    gap: 10,
  },
});

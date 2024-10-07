import React, { useState } from "react";
import { Text, StyleSheet, Image, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddWordModal from "../components/AddWordModal";
import brownRobot from "../assets/brown-robot.png"


const SettingsScreen = ({ route }) => {
  const { avatarUrl } = route.params; // Retrieve avatar URL from route params
  
  const [isModalVisible, setModalVisible] = useState(false);

   const handleOpenModal = () => {
    setModalVisible(true);
   }

   const handleCloseModal = () => {
    setModalVisible(false);
   }

   // Use a default placeholder image if avatarUrl is empty or undefined
  const validAvatarUrl = avatarUrl && avatarUrl.trim() !== '' ? avatarUrl : 'https://via.placeholder.com/180'; // Replace with your default image URL

  
  return (
    <SafeAreaView style={styles.container}>
      {/* Display the same avatar at 2x scale */}
      <Image source={brownRobot} style={styles.avatarLarge} />
      <Text style={styles.text}>Charley</Text>
      <Button title="Add word" onPress={handleOpenModal} />      
      <AddWordModal isVisible={isModalVisible} onClose={handleCloseModal} />
      {/* Add more settings options here */}

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap:8,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#ECFCCB",
  },
  avatarLarge: {
    width: 180, // 2x width
    height: 180, // 2x height
    borderRadius: 90,
    backgroundColor: '#65A30D'
  },
  text: {
    fontSize: 40,
    color: "#365314",
    fontFamily: "FredokaOne_400Regular",
  },
});

export default SettingsScreen;

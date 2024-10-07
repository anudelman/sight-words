import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import SwitchIcon from "../components/SwitchIcon"; 
import Logo from "../components/Logo";
import { useNavigation } from "@react-navigation/native"; 
import brownRobot from '../assets/brown-robot.png';

const CustomHeader = ({ onAvatarPress, onSwitchIconPress }) => {
    const navigation = useNavigation(); // Get navigation prop
  const [robotAvatarUrl, setRobotAvatarUrl] = useState(""); // State for robot avatar URL
  const [avatarError, setAvatarError] = useState(false); // State to handle fallback

  // useEffect(() => {
  //   // Generate a random robot avatar URL
  //   const randomSeed = Math.random().toString(36).substring(7); // Random seed
  //   const avatarUrl = `https://robohash.org/${randomSeed}.png?set=set1`; // URL for the robot avatar
  //   setRobotAvatarUrl(avatarUrl);
  // }, []);
  

  return (
    <View style={styles.customHeaderContainer}>
      {/* SW Logo */}
      <TouchableOpacity onPress={() => console.log('SW Logo Clicked')}>
        <Logo />
      </TouchableOpacity>

      {/* Right-side icons: Switch Icon and Avatar */}
      <View style={styles.rightIconsContainer}>
        <TouchableOpacity onPress={onSwitchIconPress}>
          <SwitchIcon />
        </TouchableOpacity>

       {/* Robot Avatar Button with Fallback */}
        <TouchableOpacity onPress={() => navigation.navigate('Settings', { avatarUrl: robotAvatarUrl })}>
          <Image
            source={brownRobot}
            style={avatarError ? styles.avatarFallback : styles.avatar} // Apply fallback style if error
            onError={() => setAvatarError(true)} // Handle error to display fallback
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles for the custom header
const styles = StyleSheet.create({
  customHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // height: 100, // Adjust height as needed
    paddingHorizontal: 20,
    backgroundColor: '#ECFCCB',
    borderBottomWidth:1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingTop: 0, // Extra padding at the top for better alignment
    width: '100%'
  },
  rightIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#65A30D',
    marginLeft: 0, // Adjust spacing between Switch Icon and Avatar
  },
});

export default CustomHeader;

import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';

const IconButton = ({ icon, label, onPress, size = 80 }) => {
  // Calculate dynamic styles based on the size prop
  const dynamicStyles = {
    iconContainer: {
      width: size,
      height: size,
      borderRadius: size / 2, // Make it circular
    },
  };

  // Clone the icon and pass the size dynamically
  const Icon = React.cloneElement(icon, { size }); // Pass size prop to the icon


  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={[styles.iconContainer, dynamicStyles.iconContainer]}>
        {icon}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9F99D',
    // First Drop Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    // Second Drop Shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  label: {
    marginTop: 8,
    fontSize: 14,
    color: '#65A30D',
    fontFamily: 'Fredoka One',
    fontWeight: '400',
    letterSpacing: -0.24,
  },
});

export default IconButton;

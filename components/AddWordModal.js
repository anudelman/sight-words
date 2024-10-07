import React, { useState } from 'react';
import { View, TextInput, Button, Modal, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { words } from './words'; // Assuming the words array is exported from words.js

const AddWordModal = ({ isVisible, onClose }) => {
  const [newWord, setNewWord] = useState('');
  const [isAddButtonEnabled, setIsAddButtonEnabled] = useState(false);

  const handleTextChange = (text) => {
    setNewWord(text);
    setIsAddButtonEnabled(text.trim().length > 0);
  };

  const handleAddWord = () => {
    if (newWord.trim()) {
      words.unshift(newWord.trim());
      setNewWord('');
      setIsAddButtonEnabled(false);
      onClose(); // Close the modal after adding the word
    }
  };

  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Add word</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type a word..."
            value={newWord}
            onChangeText={handleTextChange}
            autoFocus={true} // Automatically focus the input when modal is opened
          />
          <Button
            title="Add"
            onPress={handleAddWord}
            disabled={!isAddButtonEnabled}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  textInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: 'red',
  },
});

export default AddWordModal;

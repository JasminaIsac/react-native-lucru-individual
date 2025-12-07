import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, textPresets } from '@theme';

const CategorySelect = ({ categories = [], selectedCategory, onCategoryChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value) => {
    onCategoryChange(value);
    setModalVisible(false);
  };

  const selectedLabel = selectedCategory === 'all'
    ? 'All Categories'
    : categories.find(cat => cat.id === selectedCategory)?.title || 'Select category';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>{selectedLabel}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={[{ id: 'all', title: 'All Categories' }, ...categories]}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item.id)}>
                  <Text style={styles.optionText}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginBottom: 5,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  dropdownText: {
    fontSize: 16,
    color: colors.text.primary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: colors.background.primary,
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionItem: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: colors.text.primary,
  },
});

export default CategorySelect;

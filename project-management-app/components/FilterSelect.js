import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@theme';

const FILTER_OPTIONS = {
  task: [
    { label: 'All Tasks', value: '' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Paused', value: 'paused' },
    { label: 'Returned', value: 'returned' },
    { label: 'To Check', value: 'to check' },
    { label: 'New', value: 'new' },
  ],
  project: [
    { label: 'All Projects', value: '' },
    { label: 'Completed', value: 'completed' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'New', value: 'new' },
  ],
};

const FilterSelect = ({ type = 'task', selectedFilter, onFilterChange }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const options = FILTER_OPTIONS[type] || [];

  const handleSelect = (value) => {
    onFilterChange(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.dropdownText}>
          {options.find(opt => opt.value === selectedFilter)?.label || 'Filter by:'}
        </Text>
        <Ionicons name="chevron-down" size={20} color={colors.text.secondary} />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={options}
              keyExtractor={item => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.optionItem} onPress={() => handleSelect(item.value)}>
                  <Text style={styles.optionText}>{item.label}</Text>
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

export default FilterSelect;

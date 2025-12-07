import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, textPresets } from '@theme';

const LabeledPicker = ({ label, selectedValue, onValueChange, items, placeholder, error }) => {
  return (
    <View style={styles.wrapper}>
      <Text style={[textPresets.headerSmall, {color: colors.text.primary}]}>{label}</Text>
      <View style={[styles.pickerWrapper, error && styles.pickerError]}>
        <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={styles.picker}>
          <Picker.Item label={placeholder} value={null} />
          {items.map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
      {error && <Text style={[textPresets.bodySmall, {color: colors.text.error}]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  pickerWrapper: {
    backgroundColor: colors.background.primary,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border.primary,
    shadowColor: colors.shadow.primary,
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
  },
  picker: {
    height: 53,
    width: '100%',
  },
  pickerError: {
    borderColor: colors.border.error,
    backgroundColor: colors.background.error,
  },
});

export default LabeledPicker;

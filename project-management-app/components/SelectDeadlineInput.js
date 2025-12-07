import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { colors, textPresets } from '@theme';

const SelectDeadlineInput = ({ deadline, onChange }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(deadline ? new Date(deadline) : new Date());

  const formattedDeadline = selectedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      onChange(date.toISOString());
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={[textPresets.headerSmall, { color: colors.text.primary }]}>Deadline</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={formattedDeadline}
          placeholder="Select deadline"
          editable={false}
          pointerEvents="none"
        />
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.iconContainer}>
          <Icon name="calendar-today" size={22} color={colors.text.primary} />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border.primary,
    overflow: 'hidden',
    shadowColor: colors.shadow.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: colors.text.primary,
  },
  iconContainer: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SelectDeadlineInput;

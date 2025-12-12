import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { colors, textPresets } from '@theme/index';
import { CustomButton } from './CustomButton';

const CalendarModal = React.memo(({ 
  isCalendarVisible, 
  setCalendarVisible, 
  setSelectedDate, 
  taskCounts 
}) => {
  const markedDates = useMemo(() => {
    return Object.keys(taskCounts).reduce((acc, date) => {
      acc[date] = {
        marked: true,
        customStyles: {
          container: {
            backgroundColor: colors.background.secondary,
          },
          text: {
            color: taskCounts[date] > 0 ? colors.text.accentOrange : 'gray',
          },
        },
      };
      return acc;
    }, {});
  }, [taskCounts]);

  const renderCalendarHeader = useCallback((date) => {
    const headerDate = new Date(date);
    return (
      <Text style={styles.calendarHeaderText}>
        {headerDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </Text>
    );
  }, []);

  const handleDayPress = useCallback((day) => {
    setSelectedDate(day.dateString);
    setCalendarVisible(false);
  }, [setSelectedDate, setCalendarVisible]);

  const handleClose = useCallback(() => {
    setCalendarVisible(false);
  }, [setCalendarVisible]);

  if (!isCalendarVisible) return null;

  return (
    <Modal
      visible={isCalendarVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.modalContainer}>
        <Calendar 
          style={styles.modalContent}
          markedDates={markedDates}
          onDayPress={handleDayPress}
          renderHeader={renderCalendarHeader}
          theme={calendarTheme}
        />
        <CustomButton
          title="Close"
          onPress={handleClose}
        />
      </View>
    </Modal>
  );
});

const calendarTheme = {
  backgroundColor: colors.background.primary,
  calendarBackground: colors.background.primary,
  textSectionTitleColor: colors.text.primary,
  selectedDayBackgroundColor: colors.text.accentOrange,
  selectedDayTextColor: '#ffffff',
  todayTextColor: colors.text.accentOrange,
  dayTextColor: colors.text.primary,
  textDisabledColor: colors.text.disabled,
  monthTextColor: colors.text.primary,
  textMonthFontWeight: 'bold',
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.overlay,
  },
  modalContent: {
    paddingTop: 10,
    paddingHorizontal: 15,
    paddingBottom: 20,
    backgroundColor: colors.background.primary,
    borderRadius: 30,
  },
  calendarHeaderText: {
    ...textPresets.bodyMediumBold,
  },
});

CalendarModal.displayName = 'CalendarModal';

export default CalendarModal;
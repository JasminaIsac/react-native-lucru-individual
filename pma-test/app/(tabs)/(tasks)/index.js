import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks, useAuth } from '@contexts/index';
import { TaskList, DaysCarousel, CalendarModal } from '@components/index';
import { colors, textPresets } from '@theme/index';
import { filterTasksByDate, getTaskCountsByDate, toISODate } from '@utils/index';
import { useNavigation } from '@react-navigation/native';

const AllTasksScreen = () => {
  const { tasks: activeTasks } = useTasks();
  const { user } = useAuth();
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(toISODate(new Date()));
  const [isCalendarVisible, setCalendarVisible] = useState(false);

  // Filter tasks by selected date
  const filteredTasks = useMemo(
    () => filterTasksByDate(activeTasks, selectedDate),
    [activeTasks, selectedDate]
  );

  // Counts for calendar
  const taskCounts = useMemo(
    () => getTaskCountsByDate(activeTasks),
    [activeTasks]
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
      <TouchableOpacity onPress={() => setCalendarVisible(true)} >
        <Ionicons name="calendar-outline" size={28} color={colors.text.primary} />
      </TouchableOpacity>
      ),
    });
    
  }, [navigation, selectedDate]);

  return (
    <View style={styles.container}>
      <DaysCarousel
        tasks={activeTasks}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
      />

      <View style={styles.taskSection}>
        <Text style={[textPresets.headerLarge, { marginVertical: 10 }]}>
          Tasks for{' '}
          <Text style={{ color: colors.text.accentOrange }}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </Text>

        <TaskList tasks={filteredTasks} />
      </View>

      <CalendarModal
        isCalendarVisible={isCalendarVisible}
        setCalendarVisible={setCalendarVisible}
        setSelectedDate={setSelectedDate}
        taskCounts={taskCounts}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  taskSection: {
    marginTop: 20,
  },
  // calendarButton: {
  //   position: 'absolute',
  //   bottom: 30,
  //   right: 30,
  //   backgroundColor: colors.background.secondary,
  //   padding: 12,
  //   borderRadius: 50,
  //   shadowColor: '#000',
  //   shadowOpacity: 0.2,
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowRadius: 4,
  // },
});

export default AllTasksScreen;

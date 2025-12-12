import { ScrollView, StyleSheet } from 'react-native';
import DayCard from './DayCard';

const DaysCarousel = ({ tasks, selectedDate, setSelectedDate }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.daysContent}
      style={styles.daysScroll}
    >
      {days.map((day, index) => {
      return (
        <DayCard
          key={index}
          day={day}
          tasks={tasks}
          isSelected={selectedDate === day.toISOString().split('T')[0]}
          onPress={() => setSelectedDate(day.toISOString().split('T')[0])}
        />
      );
    })}
  </ScrollView>
);
};

const styles = StyleSheet.create({
  daysScroll: {
    marginVertical: 10,
  },

  daysContent: {
    paddingRight: 10,
  },
      
});
export default DaysCarousel;
import { ScrollView, StyleSheet } from 'react-native';
import DayCard from './DayCard';

const DaysCarousel = ({ tasks, selectedDate, setSelectedDate }) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return date;
  });

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
    daysContainer: {
        marginVertical: 10,
      },
      dayContainer: {
        width: 60,
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f4f4f4',
        marginHorizontal: 5,
      },
      selectedDay: {
        backgroundColor: '#283271',
      },
      daySmall: {
        fontSize: 12,
        color: '#888',
      },
      dayLarge: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
      },
      taskCount: {
        fontSize: 10,
        color: '#666',
        marginTop: 5,
      },
      selectedDay: {
        backgroundColor: '#4A90E2',
      },
      dayText: {
        color: '#000',
        fontWeight: 'bold',
      },
      subHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
      },
      listContainer: {
        paddingBottom: 20,
      },
      taskCard: {
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
      },
});
export default DaysCarousel;
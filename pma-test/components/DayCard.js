import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, textPresets } from '@theme/index';

const DayCard = ({ day, tasks, isSelected, onPress }) => {
  const dayString = day.toISOString().split('T')[0];
  const taskCount = tasks.filter((task) => new Date(task.deadline).toISOString().split('T')[0] === dayString).length;

  const dayNumber = day.getDate();
  const monthYear = day.toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });

  return (
    <TouchableOpacity
      style={[styles.dayContainer, isSelected && styles.selectedDay]}
      onPress={onPress}
    >
      <Text style={[styles.dayNumber, styles.date, {fontSize: 32, lineHeight: 32}]}>{dayNumber}</Text>
      <Text style={[textPresets.bodyMediumBold, styles.date, {marginBottom: 5}]}>{monthYear}</Text>
      <Text style={[textPresets.bodySmallBold, styles.date]}>{taskCount} task{taskCount !== 1 ? 's' : ''}</Text>
    </TouchableOpacity> 
  );
};

const styles = StyleSheet.create({
  dayContainer: {
    width: 80,
    height: 120,
    alignItems: 'center',
    padding: 10,
    borderRadius: 30,
    backgroundColor: colors.lightOrange,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: colors.mediumOrange,
  },
  date: {
    textAlign: 'center',
    color: colors.white,
  },
  dayNumber: {
    ...textPresets.title,
    color: colors.white,
  },
});

export default DayCard;
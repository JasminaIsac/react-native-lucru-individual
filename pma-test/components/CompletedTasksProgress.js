import React, {useState, useEffect} from 'react';
import CircularProgress from 'react-native-circular-progress-indicator';
import { useNavigation } from '@react-navigation/native';
import { useTasks } from '@contexts/index';
import { colors } from '@theme/index';

const CompletedTasksProgress = ({ projectId, color = {active: colors.mediumBlue, inActive: colors.lightBlue} }) => {
  const { fetchTasksByProjectId } = useTasks();
  const [tasks, setTasks] = useState([]);
  const [percentComplete, setPercentComplete] = useState(0);
  const navigation = useNavigation();

  const loadTasks = async () => {
    if (projectId) {
      try {
        const tasksData = await fetchTasksByProjectId(projectId);
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks for project:', error);
      }
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadTasks);
    return unsubscribe;
  }, [navigation, projectId]);

  useEffect(() => {
    if (tasks.length > 0) {
      const completedTasks = tasks.filter(task => task.status === 'completed').length;
      const totalTasks = tasks.length;
      const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
      setPercentComplete(percentage);
    }
  }, [tasks]);

  return (
      <CircularProgress
        value={percentComplete}
        radius={40}
        title=""
        maxValue={100}
        duration={1500}
        activeStrokeColor={color.active || colors.mediumBlue}
        inActiveStrokeColor={color.inActive || colors.lightBlue}
        inActiveStrokeOpacity={0.4}
        textColor={color.active || colors.mediumBlue}
        fontSize={18}
        renderText={() => `${percentComplete}%`} 
      />
  );
};

export default CompletedTasksProgress;

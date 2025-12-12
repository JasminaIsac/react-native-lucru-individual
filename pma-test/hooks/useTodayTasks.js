// hooks/useTodayTasks.js
import { useState, useEffect, useMemo } from 'react';
import { useTasks } from '@contexts/TaskContext';
import { isToday } from '@utils/index';

export const useTodayTasks = () => {
  const { tasks } = useTasks();

  const todayTasks = useMemo(() => 
    tasks.filter((task) => isToday(task.deadline)),
    [tasks]
  );

  const stats = useMemo(() => {
    const completedTasks = todayTasks.filter((task) => task.status === 'completed').length;
    const totalTasks = todayTasks.length;
    const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      todayTasks,
      completedTasks,
      totalTasks,
      percentage,
    };
  }, [todayTasks]);

  return stats;
};
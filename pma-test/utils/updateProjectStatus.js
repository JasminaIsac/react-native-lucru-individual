const determineProjectStatus = (tasks) => {
  if (tasks.length === 0) return 'new';

  const allCompleted = tasks.every(t => t.status === 'completed');
  const allNew = tasks.every(t => t.status === 'new');

  if (allCompleted) return 'completed';
  if (allNew) return 'new';
  return 'in progress';
};


const autoUpdateProjectStatus = async (tasks, projectId, updateProjectStatus) => {
    if (tasks.length === 0) {
      await updateProjectStatus(projectId, 'new');
      return;
    }
  
    const allCompleted = tasks.every(task => task.status === 'completed');
  
    if (allCompleted) {
      await updateProjectStatus(projectId, 'completed');
      return;
    }
  
    const hasActiveProgress = tasks.some(task =>
      ['in progress', 'paused', 'to check'].includes(task.status)
    );
  
    if (hasActiveProgress) {
      await updateProjectStatus(projectId, 'in progress');
    } else {
      await updateProjectStatus(projectId, 'new');
    }
  };

export default autoUpdateProjectStatus;
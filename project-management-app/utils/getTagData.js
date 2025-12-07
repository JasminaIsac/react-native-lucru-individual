import { colors } from '@theme';

export const getPriorityTagData = (priority) => {
    const data = colors.priority[priority?.toLowerCase()];
    return data
      ? { title: data.label, color: data.color, textColor: '#fff' }
      : { title: priority, color: '#95a5a6', textColor: '#fff' };
  };
  
export const getStatusTagData = (status) => {
    return colors.taskStatus[status.toLowerCase()] || { color: '#95a5a6', label: status };
  };
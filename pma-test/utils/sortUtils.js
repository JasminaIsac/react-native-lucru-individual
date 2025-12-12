const priorityOrder = { high: 1, medium: 2, low: 3 };
const statusOrder = {
  'new': 1,
  'in progress': 2,
  'paused': 3,
  'returned': 4,
  'to check': 5,
  'completed': 6
};


export const sortTasks = (tasks, sortMethod = 'default') => {
  const sorted = [...tasks];

  switch (sortMethod) {
    case 'default':
      sorted.sort((a, b) => {
        const isACompleted = a.status?.toLowerCase() === 'completed';
        const isBCompleted = b.status?.toLowerCase() === 'completed';
    
        if (isACompleted && !isBCompleted) return 1;
        if (!isACompleted && isBCompleted) return -1;
    
        if (isACompleted && isBCompleted) {
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB - dateA;
        }
    
        const pa = priorityOrder[a.priority?.toLowerCase()] || 4;
        const pb = priorityOrder[b.priority?.toLowerCase()] || 4;
    
        return pa - pb;
      });
      break;         

    case 'priority':
      sorted.sort((a, b) => {
        const pa = priorityOrder[a.priority?.toLowerCase()] || 4;
        const pb = priorityOrder[b.priority?.toLowerCase()] || 4;
        return pa - pb;
      });
      break;

    case 'status':
      sorted.sort((a, b) => {
        const orderA = statusOrder[a.status?.toLowerCase()] ?? 999;
        const orderB = statusOrder[b.status?.toLowerCase()] ?? 999;
        return orderA - orderB;
      });
      break;
      

    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;

    case 'updated_at':
      sorted.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
      break;

    case 'created_at':
      sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      break;

    case 'deadline':
      sorted.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
      break;

    default:
      break;
  }

  return sorted;
};

export const sortProjectMembers = (members, managerId) => {
  return [...members].sort((a, b) => {
    // Manager principal (cel cu ID egal cu managerId)
    if (a.id === managerId) return -1;
    if (b.id === managerId) return 1;

    // Alți manageri înaintea developerilor
    if (a.role === 'manager' && b.role === 'developer') return -1;
    if (a.role === 'developer' && b.role === 'manager') return 1;

    // În orice alt caz, menține ordinea alfabetică ca fallback
    return a.name.localeCompare(b.name);
  });
};

const roleOrder = {
  'root': 1,
  'admin': 2,
  'project manager': 3,
  'developer': 4,
};

export const sortUsersByRole = (users) => {
  return [...users].sort((a, b) => {
    const roleA = roleOrder[a.role?.toLowerCase()] || 99;
    const roleB = roleOrder[b.role?.toLowerCase()] || 99;
    return roleA - roleB;
  });
};
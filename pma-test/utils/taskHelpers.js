export const toISODate = (date) =>
  new Date(date).toISOString().split("T")[0];

export const filterTasksByDate = (tasks, selectedDate) => {
  return tasks.filter(task => toISODate(task.deadline) === selectedDate);
};

export const getTaskCountsByDate = (tasks) => {
  const counts = {};

  tasks.forEach(task => {
    const date = toISODate(task.deadline);
    counts[date] = (counts[date] || 0) + 1;
  });

  return counts;
};

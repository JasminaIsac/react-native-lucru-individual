export const formatDate = (date, fallback = 'Not set') => {
  if (!date) return fallback;
  
  const dateObj = new Date(date);
  
  // Verifică dacă data e validă
  if (isNaN(dateObj.getTime())) return fallback;
  
  return dateObj.toLocaleDateString('en-US', { 
    month: 'short', 
    day: '2-digit', 
    year: 'numeric' 
  });
};

export const formatDateWithSuffix = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
  const day = dateObj.getDate();
  
  // Adaugă suffix pentru zi (1st, 2nd, 3rd, 4th, etc.)
  const getDaySuffix = (day) => {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
      case 1: return 'st';
      case 2: return 'nd';
      case 3: return 'rd';
      default: return 'th';
    }
  };
  
  return `${month}, ${day}${getDaySuffix(day)}`;
};

export const formatRelativeDate = (date) => {
  if (!date) return '';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return '';
  
  const now = new Date();
  const diffMs = dateObj - now;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `In ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
};

export const isPastDate = (date) => {
  if (!date) return false;
  const dateObj = new Date(date);
  return dateObj < new Date();
};

export const isWithinDays = (date, days) => {
  if (!date) return false;
  const dateObj = new Date(date);
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + days);
  return dateObj <= futureDate && dateObj >= new Date();
};

export const isToday = (date) => {
  if (!date) return false;
  
  const dateObj = new Date(date);
  const today = new Date();
  
  return dateObj.getFullYear() === today.getFullYear() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getDate() === today.getDate();
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;
  
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};
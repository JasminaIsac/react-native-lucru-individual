export const validateProjectFields = (project) => {
  const errors = {};

  if (!project.name?.trim()) {
    errors.name = 'Project name is required';
  } else if (project.name.length < 3) {
    errors.name = 'Project name must be at least 3 characters long';
  }

  if (project.description && project.description.length > 0 && project.description.length < 3) {
    errors.description = 'Project description must be at least 3 characters long or left empty';
  }

  if (!project.category_id) {
    errors.category_id = 'Category must be selected';
  }

  if (!project.deadline) {
    errors.deadline = 'Deadline must be provided';
  } else {
    const deadline = project.deadline.trim();
    const isValidDate =
    /^\d{4}-\d{2}-\d{2}$/.test(deadline) ||
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*$/.test(deadline);

    if (!isValidDate) {
    errors.deadline = 'Invalid deadline format';
    }
  }
  console.log('errors: ', errors);
  return errors;
};
  
export const validateTaskFields = (task) => {
  const errors = {};

  if (!task.title?.trim()) {
    errors.title = 'Task title is required';
  } else if (task.title.length < 3) {
    errors.title = 'Task title must be at least 3 characters long';
  }


  if (task.description && task.description.length < 3) {
    errors.description = 'Task description must be at least 3 characters long or left empty';
  }

  if (!task.priority) {
    errors.priority = 'Task priority is required';
  }

  if (!task.assigned_to) {
    errors.assigned_to = 'Please assign a developer';
  }

  if (task.deadline) {
    const deadline = task.deadline.trim();
    const isValidDate =
    /^\d{4}-\d{2}-\d{2}$/.test(deadline) ||
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.*$/.test(deadline);

    if (!isValidDate) {
    errors.deadline = 'Invalid deadline format';
    }
  }

  return errors;
};

const phoneRegex = /^(\+\d{1,3}\d{6,14}|0\d{8,14})$/;
const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
const emailRegex = /\S+@\S+\.\S+/;
  
export const validateUserFields = (user, confirmPassword) => {
  const errors = [];

  if (!user.name.trim()) {
    errors.name = 'Username cannot be empty';
  }

  if (!user.email.trim() || !emailRegex.test(user.email)) {
    errors.email = 'Please enter a valid email';
  }

  if (!user.tel.trim() || !phoneRegex.test(user.tel)) {
    errors.tel = 'Please enter a valid phone number';
  }

  if (!user.role) {
    errors.role = 'Please select a role';
  }

  if (!user.password.trim()) {
    errors.password = 'Password cannot be empty';
  } else if (!strongPasswordRegex.test(user.password)) {
    errors.password = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';
  }

  if (user.password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const validateUserEditFields = (user) => {
  const errors = [];

  if (!user.name) {
    errors.name = 'Username cannot be empty';
  }

  if (!user.tel.trim()) {
    errors.tel = 'Phone number is required';
  } else if (!phoneRegex.test(user.tel)) {
    errors.tel = 'Invalid phone number';
  }

  return errors;
};

export const validatePasswords = (newPassword, oldPassword, confirmPassword) => {
  let errors = {};
  if (!newPassword) {
    errors.newPassword = 'Password cannot be empty';
  } else if (!strongPasswordRegex.test(newPassword)) {
    errors.newPassword = 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character.';
  }
  if (!oldPassword) {
    errors.oldPassword = 'Old password cannot be empty';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Confirm password cannot be empty';
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
};
  


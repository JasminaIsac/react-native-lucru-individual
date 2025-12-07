import { colors } from '@theme';

export const USER_ROLES = {
    ROOT: 'root',
    ADMIN: 'admin',
    MANAGER: 'project manager',
    DEVELOPER: 'developer'
};

export const STATUS_OPTIONS = {
    'new': [
        { title: 'Start Task', status: 'in progress', color: colors.taskStatus.inProgress.color },
    ],
    'in progress': [
        { title: 'Pause Task', status: 'paused', color: colors.taskStatus.paused.color },
        { title: 'Mark as Completed', status: 'to check', color: colors.mediumOrange },
    ],
    'to check': [
        { title: 'Pause Task', status: 'paused', color: colors.taskStatus.paused.color },
        { title: 'Mark as In Progress', status: 'in progress', color: colors.taskStatus.inProgress.color },
    ],
    'paused': [
        { title: 'Mark as In Progress', status: 'in progress', color: colors.taskStatus.inProgress.color },
        { title: 'Mark as Completed', status: 'to check', color: colors.mediumOrange },
    ],
    'returned': [
        { title: 'Mark as In Progress', status: 'in progress', color: colors.taskStatus.inProgress.color },
        { title: 'Mark as Completed', status: 'to check', color: colors.mediumOrange },
    ],
    'completed': [],
};

export const PRIORITY_OPTIONS = [
    { title: 'Low', priority: 'low' },
    { title: 'Medium', priority: 'medium' },
    { title: 'High', priority: 'high' },
];
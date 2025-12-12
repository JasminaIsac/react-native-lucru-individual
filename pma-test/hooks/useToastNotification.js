import { useNotification } from '@contexts/index';

export const useToastNotification = () => {
  const { sendNotification, sendDelayedNotification } = useNotification();

  const show = (type, title, message, delay) =>
    delay > 0
      ? sendDelayedNotification(title, message, delay, { type })
      : sendNotification(title, message, { type });

  return {
    showSuccess: (t, m, d) => show('success', t, m, d),
    showError:   (t, m, d) => show('error', t, m, d),
    showInfo:    (t, m, d) => show('info', t, m, d),
    showWarning: (t, m, d) => show('warning', t, m, d),
  };
};

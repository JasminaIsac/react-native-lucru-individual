import React, { createContext, useEffect, useRef, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { useNotificationPermission } from '@hooks/usePermissions';

// Set notificari handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const notificationListener = useRef();
  const responseListener = useRef();
  const { requestNotification } = useNotificationPermission();

  useEffect(() => {
    requestNotification();   // cererea permisiunii aici
  }, []);

  useEffect(() => {
    // Listen to notifications when app is in foreground
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen to notification responses (when user taps on notification)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const { notification } = response;
      console.log('Notification response:', notification);
      
      // Handle deep linking or custom actions here
      if (notification.request.content.data?.navigateTo) {
        // router.push(notification.request.content.data.navigateTo);
      }
    });

  return () => {
    notificationListener.current?.remove();
    responseListener.current?.remove();
  };
}, []);

  const sendNotification = async (title, body, data = {}) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: null,
    });
  };


  const sendDelayedNotification = async (title, body, seconds = 5, data = {}) => {
    await Notifications.scheduleNotificationAsync({
      content: { title, body, data },
      trigger: { seconds },
    });
  };

  const value = { sendNotification, sendDelayedNotification };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = React.useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
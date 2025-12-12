import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSearchParams } from 'expo-router';

import { getMessagesByTaskId, sendMessage } from '@api/messages';
import { MessageInput, MessagesList } from '@components/index';
import { colors } from '@theme/colors';

const TaskMessagesScreen = () => {
  const params = useSearchParams();
  const taskId = params.taskId;
  const currentUser_id = params.currentUser_id;

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollViewRef = useRef(null);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const loadMessages = async () => {
    try {
      const taskMessages = await getMessagesByTaskId(taskId);
      setMessages(taskMessages);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
      Alert.alert('Error', 'Failed to load messages.');
    }
  };

  useEffect(() => {
    if (taskId) loadMessages();
  }, [taskId]);

  const handleSendMessage = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    try {
      const messageData = { task_id: taskId, sender_id: currentUser_id, message: trimmed };
      const response = await sendMessage(messageData);

      if (!response.success) {
        Alert.alert('Error', 'Failed to send message.');
        return;
      }

      const newMsg = response.newMessage;
      const lastMsgDate = messages[messages.length - 1]?.created_at.split('T')[0];
      const newMsgDate = new Date(newMsg.created_at).toISOString().split('T')[0];

      setMessages(prev => [
        ...prev,
        ...(lastMsgDate !== newMsgDate ? [{ isDateSeparator: true, date: newMsgDate }] : []),
        newMsg,
      ]);

      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <LinearGradient colors={colors.OrangeGradient} start={{x:0, y:0}} end={{x:0, y:1}} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 80}
      >
        <ScrollView ref={scrollViewRef} onContentSizeChange={scrollToBottom} contentContainerStyle={styles.container}>
          <MessagesList messages={messages} currentUser_id={currentUser_id} />
        </ScrollView>
        <MessageInput value={newMessage} onChangeText={setNewMessage} onSend={handleSendMessage} />
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    paddingHorizontal: 5,
  },
});

export default TaskMessagesScreen;

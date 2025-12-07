import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MessageItem from './MessageItem';
import { textPresets, colors } from '@theme';

const DateSeparator = ({ date }) => (
    <Text style={styles.dateSeparator}>{date}</Text>
);

const MessagesList = ({ messages, currentUser_id }) => {
  if (messages.length === 0) {
    return (
      <View style={styles.emptyMessages}>
        <Text style={[textPresets.noData, { color: colors.white }]}>No messages yet</Text>
      </View>
    );
  }

  let lastDate = null;

  return messages.map((message, index) => {
    if (message.isDateSeparator) {
      return <DateSeparator key={`date-${index}`} date={message.date} />;
    }

    const messageDate = new Date(message.created_at).toDateString();
    const showDateSeparator = lastDate !== messageDate;
    lastDate = messageDate;

    return (
      <React.Fragment key={message.id}>
        {showDateSeparator && <DateSeparator date={new Date(message.created_at).toLocaleDateString()} />}
        <MessageItem message={message} isMine={message.sender_id === currentUser_id} />
      </React.Fragment>
    );
  });
};


const styles = StyleSheet.create({
  dateSeparator: {
    ...textPresets.bodySmall,
    color: colors.white,
    textAlign: 'center',
    marginVertical: 14,
  },
  emptyMessages: {
    paddingTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
});

export default MessagesList;
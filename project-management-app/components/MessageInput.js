import { TouchableOpacity, View, Text, TextInput, StyleSheet } from 'react-native';
import CustomButton from './CustomButton';
import { colors } from '@theme';

const MessageInput = ({ value, onChangeText, onSend }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder="Message..."
      multiline
      returnKeyType="send"
      onSubmitEditing={onSend}
      blurOnSubmit={false}
    />
    <CustomButton title="Send" onPress={onSend} style={styles.sendButton} />
  </View>
);

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 10,
    backgroundColor: colors.background.primary,
    borderRadius: 30,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  sendButton: {
    height: 44,
    marginLeft: 12,
    borderRadius: 22,
    elevation: 0,
  },
});

export default MessageInput;

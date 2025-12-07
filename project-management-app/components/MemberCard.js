import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Tag from './Tag';
import { colors, textPresets } from '@theme';

const MemberCard = ({ member, onRemove, taskCount, isAdmin }) => {
  return (
    <View style={[styles.card, isAdmin ? { borderColor: colors.lightBlue, borderWidth: 1 } : ''] }>
      <View style={styles.textContainer}>
        <Text style={textPresets.bodyLargeBold}>{member.name}</Text>
        <Text style={[textPresets.bodyMedium, isAdmin ? { color: colors.mediumBlue } : { color: colors.text.secondary }]}>{member.user_role}</Text>
      </View>
      <View style={styles.taskCountContainer}>
        {taskCount > 0 && (
          <View style={styles.tagWrapper}>
            <Tag
              title={`${taskCount} tasks`}
              backgroundColor={colors.mediumBlue}
              textColor="#fff"
            />
          </View>
        )}
        {!isAdmin && (
          <TouchableOpacity onPress={() => onRemove(member)} style={styles.removeButton}>
            <Ionicons name="close-circle" size={28} color="#ff4d4d" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.secondary,
    padding: 15,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: colors.shadow.primary,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  textContainer: {
    flex: 1,
  },
  taskCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagWrapper: {
    marginRight: 5,
  },
  removeButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MemberCard;

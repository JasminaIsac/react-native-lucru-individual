import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, textPresets } from '@theme';
import Tag from './Tag';

const UserCard = ({ user, onPress }) => {
  return (
    <TouchableOpacity style={[styles.card]} onPress={onPress}>
      <View style={styles.textContainer}>
        <Text style={[textPresets.headerMedium, { color: colors.mediumOrange }]}>{user.name}</Text>
        <Tag title={user.role} backgroundColor={colors.lightBlue} textColor={colors.darkBlue} />
        <Text style={[textPresets.bodyMedium, { color: colors.darkBlue, marginBottom: 4 }]}>{user.email}</Text>
        <Text style={[textPresets.bodySmallBold, { color: colors.text.secondary }]}>{user.tel}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.primary,
    padding: 15,
    borderRadius: 20,
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
});

export default UserCard;

import { View, Text, StyleSheet } from 'react-native';
import { textPresets, colors } from '@theme/index';
import { Ionicons } from '@expo/vector-icons';
import Tag from './Tag';

const UserDetails = ({ user, style, textColor }) => {
  return (
    <View style={[styles.headerContainer, style]}>
      <Tag
        title={colors.userStatus[user.status].label}
        backgroundColor={colors.userStatus[user.status].color}
        textColor={colors.white}
        style={{ marginBottom: 10 }}
      />
      <Text style={[textPresets.headerLarge, { color: colors.mediumOrange }]}>{user.name}</Text>
      <View style={styles.infoContainer}>
        <Ionicons name="person" size={20} color={textColor ?? colors.darkBlue} />
        <Text style={[textPresets.bodyMediumBold, { color: textColor ?? colors.darkBlue }]}>{user.role || 'User'}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Ionicons name="mail" size={20} color={textColor ?? colors.darkBlue} />
        <Text style={[textPresets.bodyMediumBold, { color: textColor ?? colors.darkBlue }]}>{user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Ionicons name="call" size={20} color={textColor ?? colors.darkBlue} />
        <Text style={[textPresets.bodyMediumBold, { color: textColor ?? colors.darkBlue }]}>{user.tel}</Text>
      </View>
      {user.location && (
        <View style={styles.infoContainer}>
          <Ionicons name="location" size={20} color={textColor ?? colors.darkOrange} />
          <Text style={[textPresets.bodyMediumBold, { color: textColor ?? colors.darkOrange }]}>{user.location}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.secondary
  },
  infoContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingVertical: 6,
  },
});
export default UserDetails;


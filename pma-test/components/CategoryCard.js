import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, textPresets } from '@theme/index';

const CategoryCard = ({ category, onRemove, onEdit, currentUserRole, projectCount }) => {
  const canDelete = projectCount === 0;
  const handleRemovePress = () => {
    if (canDelete) {
      onRemove(category);
    } else {
      Alert.alert('Cannot delete category', 'This category has projects associated with it.');
    }
  };
  
  return (
    <View style={styles.card}>
      <View style={styles.textContainer}>
        <Text style={textPresets.bodyLargeBold}>{category.title}</Text>
        <Text style={[textPresets.bodySmallBold, { color: colors.text.accentOrange }]}>{projectCount} projects</Text>
      </View>
        {currentUserRole !== 'developer' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => onEdit(category)} style={styles.editButton}>
              <Ionicons name="pencil" size={22} color={colors.mediumBlue} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRemovePress}
              style={styles.removeButton}
            >
              <Ionicons
                name="close-circle"
                size={26}
                color={canDelete ? colors.text.error : '#ccc'}
              />
            </TouchableOpacity>
          </View>
        )}
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
  buttonContainer: {
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
  editButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CategoryCard;

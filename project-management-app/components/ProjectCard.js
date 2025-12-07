import React, { useState, useCallback, useMemo } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CompletedTasksProgress, Tag } from '@components';
import { colors, textPresets } from '@theme';
import { getProjectMembers } from '@api/projects';
import { getCategoryName, sortProjectMembers, formatRelativeDate } from '@utils';

export default function ProjectCard ({ item, onPress, categories }) {
  const [members, setMembers] = useState([]);
  
  // Load members când cardul devine vizibil
  const loadMembers = useCallback(async () => {
    try {
      const membersData = await getProjectMembers(item.id);
      const sorted = sortProjectMembers(membersData, item.manager_id);
      setMembers(sorted);      
    } catch (error) {
      console.error('Error fetching project members:', error);
    }
  }, [item.id, item.manager_id]);

  useFocusEffect(
    useCallback(() => {
      loadMembers();
    }, [loadMembers])
  );
  
  // Formatare deadline cu formatRelativeDate
  const formattedDeadline = useMemo(() => 
    formatRelativeDate(item.deadline) || 'No deadline',
    [item.deadline]
  );

  // Numele categoriei memoizat
  const categoryName = useMemo(() => 
    getCategoryName(categories, item.category_id),
    [categories, item.category_id]
  );

  // Lista de membri formatată
  const membersList = useMemo(() => 
    members.length > 0 
      ? members.map(member => member.name).join(', ')
      : 'No members',
    [members]
  );

  // Handler pentru press
  const handlePress = useCallback(() => {
    onPress(item);
  }, [onPress, item]);

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.textSection}>
          <View style={styles.tagsContainer}>
            <Tag title={categoryName} />
            {item.status === 'new' && (
              <Tag 
                title="New" 
                backgroundColor={colors.taskStatus.new.color} 
                textColor={colors.white}
              />
            )}
          </View>
          
          <Text style={[textPresets.headerSmall, styles.projectName]}>
            {item.name}
          </Text>
          
          <Text 
            style={[textPresets.bodyMedium, styles.projectDescription]} 
            numberOfLines={2} 
            ellipsizeMode="tail"
          >
            {item.description}
          </Text>
          
          <View style={styles.membersContainer}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[textPresets.bodySmall, styles.projectTeam]}
            >
              {membersList}
            </Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <CompletedTasksProgress projectId={item.id} />
          <View style={styles.deadlineContainer}>
            <Text style={[textPresets.bodySmall, styles.deadline]}>
              {formattedDeadline}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background.primary,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    margin: 5,
    shadowColor: colors.shadow.primary,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textSection: {
    flex: 2,
  },
  tagsContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
    marginBottom: 4,
  },
  projectName: {
    marginBottom: 2,
  },
  projectDescription: {
    marginBottom: 3,
    color: colors.text.secondary,
  },
  membersContainer: {
    marginTop: 6,
    maxWidth: 180,
  },
  projectTeam: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.mediumOrange,
  },
  progressSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deadlineContainer: {
    marginTop: 6,
  },
  deadline: {
    color: colors.mediumOrange,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
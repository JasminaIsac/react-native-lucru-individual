import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useProjects, useUsers } from '@contexts/index';
import { useNavigation } from '@react-navigation/native';
import { colors, textPresets } from '@theme/index';
import Tag from './Tag';

const TaskCard = ({ item }) => {

  const { projects } = useProjects();
  const { users } = useUsers();

  const deadline = item.deadline ? item.deadline.split('T')[0] : 'No deadline';
  const updated_at = item.updated_at.split('T')[0];
  const navigation = useNavigation();

  const getProjectName = (projectId) =>
    projects.find((p) => p.id === projectId)?.name || 'Unknown Project';

  const getUserName = (userId) =>
   users.find((u) => u.id === userId)?.name || 'Unknown user';


   const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('en-CA', { month: 'short' }); // "Jan"
    const year = date.getFullYear();
    return { day, month, year };
  };

  const { day, month, year } = formatDate(deadline.toLocaleString('en-CA'));

  const handleTaskPress = (task) => {
    navigation.navigate('View Task', { task });
  };

  const getPriorityTagData = (priority) => {
    const data = colors.priority[priority?.toLowerCase()];
    return data
      ? { title: data.label, color: data.color, textColor: '#fff' }
      : { title: priority, color: '#95a5a6', textColor: '#fff' };
  };
  
  const getStatusData = (status) => {
    return colors.taskStatus[status.toLowerCase()] || { color: '#95a5a6', label: status };
  };
  const statusData = getStatusData(item.status);


  return (
    <TouchableOpacity style={[styles.card, item.status === 'completed' && styles.completedCard]} onPress={() => handleTaskPress(item)}>
      <View style={styles.cardHeader}>
        <View style={{flexDirection:'row', alignItems:'center', flex:2 }}>
        {(() => {
          const { title, color, textColor } = getPriorityTagData(item.priority);
          return <Tag title={title} backgroundColor={color} textColor={textColor} style={{marginRight:5}} />;
        })()}
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
          <Text style={[styles.statusLabel, { color: statusData.color, marginRight: 5 }]}>●</Text>
          <Text style={[textPresets.bodySmallBold]}>{statusData.label}</Text>
        </View>
        </View >

        <Text style={[textPresets.bodySmallBold, {color: colors.text.accentBlue, marginRight:15, textAlign:'right'}]}>{getUserName(item.assigned_to)}</Text>

      </View>

      <View style={[styles.cardContent, item.status === 'completed' && styles.completedCard]}>
        <View style={styles.textSection}>

          <Text style={[textPresets.headerMedium, {marginBottom:5}]}>{item.title}</Text>
          {item.description && (
            <Text style={[textPresets.bodySmall, {color: colors.text.secondary}]} numberOfLines={2} ellipsizeMode="tail" >{item.description}</Text>
          )}
        </View>
        <View style={styles.infoSection}>
          <View>
            <Text style={[styles.deadline,styles.deadlineDate]}>{day}</Text>
            <Text style={styles.deadline}>{month}, {year}</Text>
          </View>
        </View>
        
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.background.secondary ,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 15,
    shadowColor: colors.shadow.primary,
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 2, height: 2 },
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5
  },
  completedCard: {
    backgroundColor: colors.background.disabled,
  },
  cardContent: {
    backgroundColor: colors.background.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius:15,
    paddingHorizontal:16,
    paddingVertical:12,
  },
  textSection: {
    flex: 4,
  },
  infoSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statusLabel: {
    fontWeight:700,
  },
  taskProject:{
    fontSize: 14,
    fontWeight:600,
    color: '#0da8ea',
    marginBottom: 5,
  },
  taskDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  deadline: {
    fontSize: 14,
    color: '#ff9800',
    textAlign: 'center',
    fontWeight:700
  },
  deadlineDate:{
    fontSize:22,
    fontWeight:900,
  },
  developerName: {
    fontSize: 14,
    color: '#4579FB',
    fontWeight:700,
    textAlign: 'right',
    paddingRight:11
  },
  statusButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    margin: 0, 
  },
  highPriority: {
    backgroundColor: '#e74c3c',
  },
  mediumPriority: {
    backgroundColor: '#f1c40f',
  },
  lowPriority: {
    backgroundColor: '#2ecc71',
  },
  newStatus: {
    color: '#e224f9',
  },
  inProgressStatus:{
    color: '#4579FB',
  },
  pausedStatus:{
    color: '#f0d700'
  },
  toCheckStatus: {
    color: '#9ce62a',
  },
  completedStatus: {
    color: '#009a28',
  },
  returnedStatus:{
    color: '#f9245b'
  },
});

export default TaskCard;
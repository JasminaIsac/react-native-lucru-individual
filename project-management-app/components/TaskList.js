// TaskList.js
import React, { useState, useEffect } from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import TaskCard from './TaskCard';
import { textPresets, colors } from '@theme';

const TaskList = ({ tasks, projectId }) => {
  const [filteredTasks, setFilteredTasks] = useState(tasks);

  useEffect(() => {
    if (projectId) {
      setFilteredTasks(tasks.filter((task) => task.project_id === projectId));
    } else {
      setFilteredTasks(tasks);
    }
  }, [tasks, projectId]);

  return (
    <FlatList
      style={{ paddingBottom: 15 }}
      data={filteredTasks}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TaskCard item={item} />
      )}
      ListEmptyComponent={() => (
        <View style={styles.emptyContainer}>
          <Text style={[textPresets.noData, {color: colors.text.secondary}]}>No tasks added</Text>
        </View>
      )}
      scrollEnabled={false}
    />
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    marginTop: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TaskList;

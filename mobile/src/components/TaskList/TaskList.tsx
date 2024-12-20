import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TaskList = ({ date }: { date: Date }) => {
  // TODO: Remplacer par des données dynamiques
  const tasks = [
    { id: 1, title: 'Aller à la salle de sport', type: 'habit' },
    { id: 2, title: 'Rédiger un rapport', type: 'task' },
  ];

  return (
    <View style={styles.container}>
      {tasks.map((task) => (
        <View key={task.id} style={styles.task}>
          <Text style={styles.taskText}>{task.title}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  task: {
    padding: 10,
    backgroundColor: '#222',
    marginBottom: 10,
    borderRadius: 5,
  },
  taskText: {
    color: '#fff',
  },
});

export default TaskList;

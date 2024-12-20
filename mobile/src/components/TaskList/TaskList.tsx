import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchTasksAndHabits } from '../../api/task.service';

const TaskList = ({ date }: { date: Date }) => {
  const [data, setData] = useState<{ tasks: any[]; habits: any[] }>({ tasks: [], habits: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchTasksAndHabits(date.toISOString().split('T')[0]);
        setData(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [date]);

  if (loading) {
    return <ActivityIndicator size="large" color="#00aaff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Habitudes</Text>
      {data.habits.map((habit) => (
        <View key={habit.id} style={styles.task}>
          <Text style={styles.taskText}>{habit.name}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Tâches</Text>
      {data.tasks.map((task) => (
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
  sectionTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
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

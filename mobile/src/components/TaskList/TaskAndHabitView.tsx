import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from 'react-native';
import TaskList from './TaskList';
import HabitList from '../HabitList/HabitList';
import { toggleTaskComplete } from '../../api/tasks.api';
import { trackHabit } from '../../api/habits.api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = {
    tasks: any[];
    habits: any[];
    date: Date;
    setTasks: React.Dispatch<React.SetStateAction<any[]>>; // Ajout
    setHabits: React.Dispatch<React.SetStateAction<any[]>>; // Ajout
};

const TaskAndHabitView: React.FC<Props> = ({ tasks, habits, date, setTasks, setHabits }) => {
    const isEmpty = tasks.length === 0 && habits.length === 0;
    const items = [...tasks, ...habits].map((item) => ({
        ...item,
        type: item.deadline ? 'TASK' : 'HABIT',
    }));

    const handleToggleComplete = async (item: any) => {
        if (item.type === 'TASK') {
            await handleToggleTaskComplete(item.id);
        } else {
            await handleToggleHabitComplete(item.id, item.value);
        }
    };

    const handleToggleTaskComplete = async (id: number) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
                return;
            }
            await toggleTaskComplete(id, token, date.toISOString()); // Passe la date sélectionnée
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, completed: true, completedAt: date.toISOString() } : task
                )
            );
        } catch (error) {
            console.error('Failed to toggle task completion:', error);
            Alert.alert('Erreur', 'Impossible de marquer la tâche comme complétée.');
        }
    };    
    

    const handleToggleHabitComplete = async (id: number, value?: number) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
                return;
            }
            await trackHabit(id, token, date.toISOString(), value); // Passe la date et le token
            setHabits((prevHabits) =>
                prevHabits.map((habit) =>
                    habit.id === id
                        ? {
                              ...habit,
                              tracking: [
                                  ...habit.tracking.filter(
                                      (tracking: { date: string; }) =>
                                          tracking.date !== date.toISOString().split('T')[0]
                                  ), // Supprime les entrées existantes pour éviter les doublons
                                  { date: date.toISOString().split('T')[0], completed: true, value },
                              ],
                          }
                        : habit
                )
            );
        } catch (error) {
            console.error('Failed to track habit:', error);
            Alert.alert('Erreur', 'Impossible de marquer l\'habitude comme complétée.');
        }
    };      

    return (
        <View style={styles.container}>
            {isEmpty ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../../assets/images/calendar-placeholder.png')}
                        style={styles.image}
                    />
                    <Text style={styles.emptyTitle}>Aucune activité programmée</Text>
                    <Text style={styles.emptySubtitle}>Ajoutez de nouvelles activités</Text>
                </View>
            ) : (
                <>
                    <TaskList tasks={tasks} date={date} onToggleComplete={handleToggleTaskComplete} />
                    <HabitList habits={habits} onToggleComplete={handleToggleHabitComplete} selectedDate={date}/>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
    }
});

export default TaskAndHabitView;

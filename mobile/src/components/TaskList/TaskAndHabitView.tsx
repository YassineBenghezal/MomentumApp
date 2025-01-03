import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import TaskList from './TaskList';
import HabitList from '../HabitList/HabitList';
import { toggleTaskComplete, deleteTask, fetchTasks } from '../../api/tasks.api'; // Import fetchTasks from tasks.api
import { trackHabit, deleteHabit, fetchHabits } from '../../api/habits.api'; // Import fetchHabits from habits.api
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation.types';

type Props = {
    tasks: any[];
    habits: any[];
    date: Date;
    setTasks: React.Dispatch<React.SetStateAction<any[]>>;
    setHabits: React.Dispatch<React.SetStateAction<any[]>>;
    onOpenHabitStats: (habitId: number) => void;
};

const TaskAndHabitView: React.FC<Props> = ({ tasks, habits, date, setTasks, setHabits, onOpenHabitStats }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const isEmpty = tasks.length === 0 && habits.length === 0;

    const fetchTasksData = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
            return;
        }
        const fetchedTasks = await fetchTasks(token);
        setTasks(fetchedTasks);
    };

    const fetchHabitsData = async () => {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
            return;
        }
        const fetchedHabits = await fetchHabits(token);
        setHabits(fetchedHabits);
    };

    useEffect(() => {
        fetchTasksData();
        fetchHabitsData();
    }, []);

    const handleToggleTaskComplete = async (id: number) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
                return;
            }
            const response = await toggleTaskComplete(id, token, date.toISOString());
            const isCompleted = response.completed;

            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, completed: isCompleted, completedAt: isCompleted ? date.toISOString() : null } : task
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

            const response = await trackHabit(id, token, date.toISOString(), value);
            const updatedTracking = response.tracking;

            setHabits((prevHabits) =>
                prevHabits.map((habit) =>
                    habit.id === id
                        ? {
                              ...habit,
                              tracking: updatedTracking,
                          }
                        : habit
                )
            );
        } catch (error) {
            console.error('Failed to track habit:', error);
            Alert.alert('Erreur', 'Impossible de basculer la complétion de l\'habitude.');
        }
    };

    const handleEditTask = (task: any) => {
        navigation.navigate('EditTask', { task });
    };

    const handleDeleteTask = async (id: number) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
                return;
            }
            await deleteTask(id, token);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
            Alert.alert('Succès', 'La tâche a été supprimée avec succès.');
        } catch (error) {
            console.error('Failed to delete task:', error);
            Alert.alert('Erreur', 'Impossible de supprimer la tâche.');
        }
    };

    const handleEditHabit = (habit: any) => {
        navigation.navigate('EditHabit', { habit });
    };

    const handleDeleteHabit = async (id: number) => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
                return;
            }
            await deleteHabit(id, token);
            setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
            Alert.alert('Succès', 'L\'habitude a été supprimée avec succès.');
        } catch (error) {
            console.error('Failed to delete habit:', error);
            Alert.alert('Erreur', 'Impossible de supprimer l\'habitude.');
        }
    };

    const handleOpenHabitStats = (habitId: number) => {
        onOpenHabitStats(habitId);
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
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TaskList
                        tasks={tasks}
                        date={date}
                        onToggleComplete={handleToggleTaskComplete}
                        onEditTask={handleEditTask}
                        onDeleteTask={handleDeleteTask}
                        fetchTasks={fetchTasksData} // Pass fetchTasksData as a prop
                    />
                    <HabitList
                        habits={habits}
                        onToggleComplete={handleToggleHabitComplete}
                        onEditHabit={handleEditHabit}
                        onDeleteHabit={handleDeleteHabit}
                        selectedDate={date}
                        fetchHabits={fetchHabitsData} // Pass fetchHabitsData as a prop
                        onOpenHabitStats={handleOpenHabitStats}
                    />
                </ScrollView>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 5,
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
    },
    scrollContent: {
        paddingBottom: 100, // Ajoute un espace supplémentaire pour permettre le défilement
    },
});

export default TaskAndHabitView;
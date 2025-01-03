import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar, Alert, Platform, Text } from 'react-native';
import CalendarView from '../../components/Calendar/CalendarView';
import TaskAndHabitView from '../../components/TaskList/TaskAndHabitView';
import Header from '../../components/Header/Header';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTasksAndHabits } from '../../api/tasksAndHabits.api';
import { Task } from '../../types/task.types';
import { Habit } from '../../types/habit.types';
import { useFocusEffect } from '@react-navigation/native';

const HomePage = ({ navigation }: { navigation: any }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState<Task[]>([]);
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasksAndHabitsData = async (date: Date) => {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            
            const token = await AsyncStorage.getItem('authToken');
            
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour accéder aux données.');
                navigation.navigate('Login');
                return;
            }

            const data = await fetchTasksAndHabits(formattedDate, token);
            
            setTasks(data.tasks || []);
            setHabits(data.habits || []);
        } catch (err) {
            console.error('Erreur lors de la récupération des données :', err);
            setError('Impossible de récupérer les tâches et habitudes.');
        } finally {
            setLoading(false);
        }
    };

    const getFormattedDate = (date: Date) => {
        const today = new Date();
        if (
            date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear()
        ) {
            return "Aujourd'hui";
        }
        return date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    useEffect(() => {
        fetchTasksAndHabitsData(selectedDate);
    }, [selectedDate]);

    useEffect(() => {
        fetchTasksAndHabitsData(new Date());
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchTasksAndHabitsData(selectedDate);
        }, [selectedDate])
    );

    const handleMenuPress = () => {
        Alert.alert('Menu', 'Ouvre le menu burger');
    };

    const handleOpenCalendar = () => {
        setIsCalendarModalVisible(true);
    };

    const handleCloseCalendar = () => {
        setIsCalendarModalVisible(false);
    };

    const handleOpenHabitStats = (habitId: number) => {
        navigation.navigate('HabitStats', {
            habitId,
            onGoBack: () => fetchTasksAndHabitsData(selectedDate),
        });
    };

    if (loading) return <Text style={styles.loading}>Chargement...</Text>;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                onMenuPress={() => Alert.alert('Menu', 'Ouvre le menu burger')}
                showAuthButton={true}
                onAuthPress={() => navigation.navigate('Login')}
                title={getFormattedDate(selectedDate)}
                showCalendar={true}
                onOpenCalendar={handleOpenCalendar}
            />

            <View style={styles.calendarContainer}>
                <CalendarView
                    selectedDate={selectedDate}
                    onDateChange={(date) => {
                        setSelectedDate(date);
                        handleCloseCalendar();
                    }}
                    isVisible={isCalendarModalVisible}
                />
            </View>
            <View style={styles.content}>
                <TaskAndHabitView
                    tasks={tasks}
                    habits={habits}
                    date={selectedDate}
                    setTasks={setTasks}
                    setHabits={setHabits}
                    onOpenHabitStats={handleOpenHabitStats}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', // Couleur uniforme
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    },
    calendarContainer: {
        marginTop: 10,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20, // Uniformiser le padding
        paddingVertical: 10,
        backgroundColor: '#ffffff', // Ajout d'un fond pour le contenu
        borderRadius: 10,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#333', // Harmonisation des couleurs
        fontSize: 16,
    },
    error: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#ff0000',
        fontSize: 16,
    },
});

export default HomePage;

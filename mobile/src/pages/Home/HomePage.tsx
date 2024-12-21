import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar, Alert, Platform, Text } from 'react-native';
import CalendarView from '../../components/Calendar/CalendarView';
import TaskAndHabitView from '../../components/TaskList/TaskAndHabitView';
import Header from '../../components/Header/Header';
import BottomNav from '../../components/Navigation/BottomNav';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchTasksAndHabits } from '../../api/tasksAndHabits.api';

const HomePage = ({ navigation }: { navigation: any }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [habits, setHabits] = useState([]);
    const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasksAndHabitsData = async (date: Date) => {
        try {
            console.log('Fetching tasks and habits for date:', date);
            const formattedDate = date.toISOString().split('T')[0];
            console.log('Formatted date:', formattedDate);
            
            const token = await AsyncStorage.getItem('authToken');
            console.log('Token:', token);
            
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour accéder aux données.');
                navigation.navigate('Login');
                return;
            }

            const data = await fetchTasksAndHabits(formattedDate, token);
            console.log('Data:', data);
            
            setTasks(data.tasks || []);
            setHabits(data.habits || []);
        } catch (err) {
            console.error('Erreur lors de la récupération des données :', err);
            setError('Impossible de récupérer les tâches et habitudes.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddActivity = () => {
        navigation.navigate('AddActivity'); // Navigue vers l'écran d'ajout
    };

    useEffect(() => {
        fetchTasksAndHabitsData(selectedDate);
    }, [selectedDate]);

    const handleMenuPress = () => {
        Alert.alert('Menu', 'Ouvre le menu burger');
    };

    const handleOpenCalendar = () => {
        setIsCalendarModalVisible(true);
    };

    const handleCloseCalendar = () => {
        setIsCalendarModalVisible(false);
    };

    if (loading) return <Text style={styles.loading}>Chargement...</Text>;
    if (error) return <Text style={styles.error}>{error}</Text>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                onMenuPress={handleMenuPress}
                showAuthButton={true}
                onAuthPress={() => navigation.navigate('Login')}
                selectedDate={selectedDate.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                })}
                isToday={selectedDate.toDateString() === new Date().toDateString()}
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
                    onAddPress={() => navigation.navigate('AddActivity')}
                />
            </View>
            <BottomNav />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    },
    calendarContainer: {
        marginTop: 10,
    },
    content: {
        flex: 1,
        padding: 10,
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
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

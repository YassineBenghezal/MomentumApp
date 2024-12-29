import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { fetchTasks } from '../../api/tasks.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../../types/task.types'; // Import du type Task
import BottomNav from '../../components/Navigation/BottomNav';
import Header from '../../components/Header/Header';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation.types';

const TasksPage = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [tasks, setTasks] = useState<Task[]>([]); // Typage explicite
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    Alert.alert('Erreur', 'Vous devez être connecté pour voir vos tâches.');
                    return;
                }

                const data = await fetchTasks(token);
                setTasks(data);
            } catch (err) {
                console.error('Erreur lors de la récupération des tâches :', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Text style={styles.loading}>Chargement...</Text>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                onMenuPress={() => Alert.alert('Menu', 'Ouvre le menu burger')}
                showAuthButton={true}
                onAuthPress={() => navigation.navigate('Login')}
                title="Tâches"
            />
            <Text style={styles.header}>Mes Tâches</Text>
            <FlatList
                data={tasks}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.description}>{item.description}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000', // Fond uniforme
        paddingHorizontal: 20, // Aligné avec HomePage
        paddingVertical: 10,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#1a1a1a', // Fond sombre comme HomePage
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333', // Couleur alignée avec HabitsPage
    },
    loading: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#333', // Couleur uniforme
    },
    item: {
        padding: 10,
        backgroundColor: '#ffffff', // Aligné avec HabitsPage
        borderRadius: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333', // Couleur alignée
    },
    description: {
        fontSize: 14,
        color: '#666', // Harmonisation des couleurs
    },
});

export default TasksPage;

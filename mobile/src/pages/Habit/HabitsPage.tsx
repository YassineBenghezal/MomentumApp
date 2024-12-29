import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { fetchHabits } from '../../api/habits.api'; // Assure-toi d'avoir une fonction API pour récupérer les habitudes
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Habit } from '../../types/habit.types';
import BottomNav from '../../components/Navigation/BottomNav';
import Header from '../../components/Header/Header';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation.types';

const HabitsPage = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    Alert.alert('Erreur', 'Vous devez être connecté pour voir vos habitudes.');
                    return;
                }

                const data = await fetchHabits(token);
                setHabits(data);
            } catch (err) {
                console.error('Erreur lors de la récupération des habitudes :', err);
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
                title="Habitudes"
                showAuthButton={true}
                onAuthPress={() => navigation.navigate('Login')}
            />
            <View style={styles.container}>
                <Text style={styles.header}>Mes Habitudes</Text>
                {loading ? (
                    <Text style={styles.loading}>Chargement...</Text>
                ) : (
                    <FlatList
                        data={habits}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.item}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000', // Fond sombre comme HomePage
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    },
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#ffffff', // Texte clair pour contraste
    },
    loading: {
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
        color: '#ffffff',
    },
    item: {
        padding: 10,
        backgroundColor: '#333333', // Fond sombre pour correspondre au design
        borderRadius: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    description: {
        fontSize: 14,
        color: '#cccccc',
    },
});

export default HabitsPage;

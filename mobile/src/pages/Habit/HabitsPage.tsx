import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SafeAreaView, Platform, StatusBar, Modal, TouchableOpacity } from 'react-native';
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
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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

    const handleOpenModal = (habit: Habit) => {
        setSelectedHabit(habit);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedHabit(null);
        setModalVisible(false);
    };

    const handleDeleteHabit = () => {
        if (selectedHabit) {
            // Call delete habit API
            setModalVisible(false);
        }
    };

    if (loading) return <Text style={styles.loading}>Chargement...</Text>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                title="Habitudes"
                showAuthButton={true}
                onAuthPress={() => navigation.navigate('Login')}
            />
            <View style={styles.container}>
                <FlatList
                    data={habits}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleOpenModal(item)}>
                            <View style={styles.item}>
                                <Text style={styles.title}>{item.name}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            {selectedHabit && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedHabit.name}</Text>
                            <TouchableOpacity onPress={handleCloseModal}>
                                <Text style={styles.closeIcon}>✖</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalDescription}>{selectedHabit.description}</Text>
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate('EditHabit', { habit: selectedHabit })}>
                                    <Text style={styles.buttonText}>Modifier 🛠️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={handleDeleteHabit}>
                                    <Text style={styles.buttonText}>Supprimer 🗑️</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
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
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 14,
        marginBottom: 20,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    modalButton: {
        flex: 1,
        padding: 10,
        marginHorizontal: 5,
        backgroundColor: '#007BFF',
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        alignSelf: 'center',
        backgroundColor: '#ddd',
        borderRadius: 5,
    },
    closeButtonText: {
        fontSize: 16,
        color: '#333',
    },
    closeIcon: {
        fontSize: 18,
        color: '#333',
    },
    statsButton: {
        backgroundColor: '#00bcd4',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
    },
    statsButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default HabitsPage;

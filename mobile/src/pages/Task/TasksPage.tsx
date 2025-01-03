import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, SafeAreaView, Platform, StatusBar, Modal, TouchableOpacity } from 'react-native';
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
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

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

    const handleOpenModal = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setModalVisible(false);
    };

    const handleDeleteTask = () => {
        if (selectedTask) {
            // Call delete task API
            setModalVisible(false);
        }
    };

    if (loading) return <Text style={styles.loading}>Chargement...</Text>;

    return (
        <SafeAreaView style={styles.safeArea}>
            <Header
                onMenuPress={() => Alert.alert('Menu', 'Ouvre le menu burger')}
                showAuthButton={true}
                onAuthPress={() => navigation.navigate('Login')}
                title="Tâches"
            />
            <View style={styles.container}>
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleOpenModal(item)}>
                            <View style={styles.item}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            {selectedTask && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedTask.title}</Text>
                            <TouchableOpacity onPress={handleCloseModal}>
                                <Text style={styles.closeIcon}>✖</Text>
                            </TouchableOpacity>
                            <Text style={styles.modalDescription}>{selectedTask.description}</Text>
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate('EditTask', { task: selectedTask })}>
                                    <Text style={styles.buttonText}>Modifier 🛠️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={handleDeleteTask}>
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
});

export default TasksPage;

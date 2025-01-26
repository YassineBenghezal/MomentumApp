import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Button, Alert, TextInput, Switch } from 'react-native';
import { Task } from '../../types/task.types';
import { getCategoryColor, getCategoryIcon } from '../../constants/categories';
import { NavigationProp, useNavigation, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation.types';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Import FontAwesome for lock icon

type TaskListProps = {
    tasks?: Task[];
    date: Date;
    onToggleComplete: (id: number) => void;
    onEditTask: (task: Task) => void;
    onDeleteTask: (id: number) => void;
    fetchTasks: () => void; // Add a fetchTasks prop to refresh the task list
};

const TaskList: React.FC<TaskListProps> = ({ tasks = [], date, onToggleComplete, onEditTask, onDeleteTask, fetchTasks }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

    const isFutureDate = (date: Date) => {
        const today = new Date();
        return date >= today;
    };

    useFocusEffect(
        useCallback(() => {
            fetchTasks(); // Fetch tasks when the screen is focused
        }, [])
    );

    const handleOpenModal = (task: Task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedTask(null);
        setModalVisible(false);
    };

    const handleDeleteConfirmation = (id: number) => {
        setSelectedTask(tasks.find(task => task.id === id) || null);
        setConfirmDeleteVisible(true);
    };

    const confirmDeleteTask = () => {
        if (selectedTask) {
            onDeleteTask(selectedTask.id);
            setConfirmDeleteVisible(false);
        }
    };

    return (
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.contentContainer}>
            {tasks.map((task) => {
                const itemStyle = task.completed ? styles.itemContainerCompleted : styles.itemContainer;
                const textStyle = task.completed ? styles.itemNameCompleted : styles.itemName;

                return (
                    <TouchableOpacity key={task.id} onPress={() => handleOpenModal(task)}>
                        <View style={itemStyle}>
                            <View style={styles.iconAndName}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        { backgroundColor: getCategoryColor(task.category) },
                                    ]}
                                >
                                    {getCategoryIcon(task.category)}
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                                        {task.title}
                                    </Text>
                                    <Text style={styles.tag}>Tâche</Text>
                                </View>
                            </View>

                            <TouchableOpacity style={styles.circle} onPress={() => !isFutureDate(date) && onToggleComplete(task.id)}>
                                {isFutureDate(date) ? (
                                    <FontAwesome name="lock" size={18} color="#fff" />
                                ) : (
                                    <Text style={styles.circleText}>{task.completed ? '✔' : ''}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                );
            })}

            {selectedTask && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalContainer}>
                        {/* Bouton pour fermer */}
                        <TouchableOpacity
                            onPress={handleCloseModal}
                            style={styles.floatingCloseButton}
                        >
                            <Ionicons name="close" size={30} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.modalContentEnhanced}>
                            {/* Header avec le titre, icône de la catégorie et date */}
                            <View style={styles.modalHeaderEnhanced}>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.modalHabitTitle}>{selectedTask.title}</Text>
                                    <Text
                                        style={[
                                            styles.modalHabitDate,
                                            { color: getCategoryColor(selectedTask.category) },
                                        ]}
                                    >
                                        {new Date(selectedTask.deadline).toLocaleDateString()}
                                    </Text>
                                </View>
                                <View
                                    style={[
                                        styles.modalCategoryIcon,
                                        { backgroundColor: getCategoryColor(selectedTask.category) },
                                    ]}
                                >
                                    {getCategoryIcon(selectedTask.category, 24)}
                                </View>
                            </View>

                            {/* Description */}
                            <View style={styles.descriptionSection}>
                                <Text style={styles.descriptionText}>
                                    {selectedTask.description || 'Aucune description'}
                                </Text>
                            </View>

                            {/* Boutons d'actions */}
                            <View style={styles.actionContainerColumn}>
                                <TouchableOpacity
                                    style={styles.actionLine}
                                    onPress={() =>
                                        navigation.navigate('EditTask', { task: selectedTask })
                                    }
                                >
                                    <Ionicons name="create-outline" size={24} color="#fff" />
                                    <Text style={styles.actionText}>Modifier</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.actionLine}
                                    onPress={() => handleDeleteConfirmation(selectedTask.id)}
                                >
                                    <Ionicons name="trash-outline" size={24} color="#fff" />
                                    <Text style={styles.actionText}>Supprimer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}

            {confirmDeleteVisible && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={confirmDeleteVisible}
                    onRequestClose={() => setConfirmDeleteVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Confirmer la suppression</Text>
                            <Text>Êtes-vous sûr de vouloir supprimer cette tâche ?</Text>
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity style={styles.modalButton} onPress={confirmDeleteTask}>
                                    <Text style={styles.buttonText}>Oui</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => setConfirmDeleteVisible(false)}>
                                    <Text style={styles.buttonText}>Non</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: 5,
    },
    contentContainer: {
        paddingBottom: 20, // Ajuste l'espace supplémentaire pour permettre le défilement
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 2, // Réduit les marges pour augmenter la largeur des éléments
    },
    itemContainerCompleted: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#333',
        borderRadius: 10,
        padding: 10,
        marginHorizontal: 2, // Réduit les marges pour augmenter la largeur des éléments
    },
    iconAndName: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    textContainer: {
        maxWidth: '80%',
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    itemNameCompleted: {
        fontSize: 16,
        color: '#888',
        fontWeight: 'bold',
        textDecorationLine: 'line-through',
    },
    tag: {
        fontSize: 12,
        color: '#9E9E9E',
    },
    circle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleText: {
        fontSize: 18,
        color: '#fff',
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
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
    },
    closeIcon: {
        fontSize: 18,
        color: '#333',
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 10,
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
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalDescription: {
        fontSize: 14,
        marginBottom: 20,
    },
    modalDate: {
        fontSize: 14,
        color: '#888',
        marginBottom: 15,
    },
    noteSection: {
        backgroundColor: '#f8f8f8',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    noteLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    noteText: {
        fontSize: 14,
        color: '#555',
    },
    floatingCloseButton: {
        position: 'absolute',
        top: '2%',
        right: '5%',
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 20,
        zIndex: 10,
    },
    
    modalHeaderEnhanced: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    
    titleContainer: {
        flex: 1, // Permet au titre de prendre l'espace restant
        paddingRight: 10, // Évite que le titre touche l'icône
    },
    
    modalHabitTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    
    modalHabitDate: {
        fontSize: 14,
        color: '#aaa',
    },
    
    modalCategoryIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    
    descriptionSection: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    
    descriptionText: {
        fontSize: 14,
        color: '#aaa',
    },
    
    actionContainerColumn: {
        width: '100%',
        flexDirection: 'column',
        marginVertical: 10,
    },
    
    actionLine: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#444',
    },
    
    actionText: {
        marginLeft: 15,
        color: '#fff',
        fontSize: 16,
    }, 
    modalContentEnhanced: {
        width: '90%',
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },    
});

export default TaskList;
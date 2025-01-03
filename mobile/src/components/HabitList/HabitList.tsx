import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, Button, Alert, Switch } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons'; // Import FontAwesome and Ionicons for icons
import { Habit } from '../../types/habit.types';
import { getCategoryIcon, getCategoryColor } from '../../constants/categories';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation.types';

interface HabitListProps {
    habits: Habit[];
    onToggleComplete: (id: number, value?: number) => void;
    onEditHabit: (habit: Habit) => void;
    onDeleteHabit: (id: number) => void;
    selectedDate: Date;
    fetchHabits: () => void; // Add a fetchHabits prop to refresh the habit list
    onOpenHabitStats: (habitId: number) => void;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onToggleComplete, onEditHabit, onDeleteHabit, selectedDate, fetchHabits, onOpenHabitStats }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [inputValue, setInputValue] = useState<number>(0);
    const [isCompleted, setIsCompleted] = useState<boolean>(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const isFutureDate = (date: Date) => {
        const today = new Date();
        return date >= today;
    };

    useFocusEffect(
        useCallback(() => {
            fetchHabits(); // Fetch habits when the screen is focused
        }, [])
    );

    const handleOpenModal = (habit: Habit) => {
        const selectedDateString = selectedDate.toISOString().split('T')[0];
        const todayTracking = habit.tracking?.find((tracking) => {
            const trackingDate = tracking.date.split('T')[0];
            return trackingDate === selectedDateString;
        });
        const currentQuantity = todayTracking?.value || 0;
        const completed = todayTracking?.completed || false;
        setSelectedHabit(habit);
        setInputValue(currentQuantity);
        setIsCompleted(completed);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedHabit(null);
        setModalVisible(false);
    };

    const handleOpenEditModal = (habit: Habit) => {
        setSelectedHabit(habit);
        setEditModalVisible(true);
    };

    const handleCloseEditModal = () => {
        setSelectedHabit(null);
        setEditModalVisible(false);
    };

    const handleConfirm = async () => {
        if (selectedHabit) {
            await onToggleComplete(selectedHabit.id, Number(inputValue));
            handleCloseModal();
        }
    };

    const handleDeleteTracking = async () => {
        if (selectedHabit) {
            await onToggleComplete(selectedHabit.id);
            handleCloseModal();
        }
    };

    const handleDeleteConfirmation = (id: number) => {
        setSelectedHabit(habits.find(habit => habit.id === id) || null);
        setConfirmDeleteVisible(true);
    };

    const confirmDeleteHabit = () => {
        if (selectedHabit) {
            onDeleteHabit(selectedHabit.id);
            setConfirmDeleteVisible(false);
        }
    };

    return (
        <ScrollView style={styles.listContainer} contentContainerStyle={styles.contentContainer}>
            {habits.map((habit) => {
                const selectedDateString = selectedDate.toISOString().split('T')[0];
                const todayTracking = habit.tracking?.find((tracking) => {
                    const trackingDate = tracking.date.split('T')[0];
                    return trackingDate === selectedDateString;
                });
                const isCompleted = todayTracking?.completed || false;

                const itemStyle = isCompleted ? styles.itemContainerCompleted : styles.itemContainer;
                const textStyle = isCompleted ? styles.itemNameCompleted : styles.itemName;

                return (
                    <TouchableOpacity key={habit.id} onPress={() => handleOpenEditModal(habit)}>
                        <View style={itemStyle}>
                            <View style={styles.iconAndName}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        { backgroundColor: getCategoryColor(habit.category) },
                                    ]}
                                >
                                    {getCategoryIcon(habit.category)}
                                </View>
                                <View style={styles.textContainer}>
                                    <Text style={textStyle} numberOfLines={1} ellipsizeMode="tail">
                                        {habit.name}
                                    </Text>
                                    <Text style={styles.tag}>Habitude</Text>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={styles.circle}
                                onPress={() =>
                                    !isFutureDate(selectedDate) && (
                                        habit.completionMode === 'NUMERIC'
                                            ? handleOpenModal(habit)
                                            : onToggleComplete(habit.id)
                                    )
                                }
                            >
                                {isFutureDate(selectedDate) ? (
                                    <FontAwesome name="lock" size={18} color="#fff" />
                                ) : (
                                    <Text style={styles.circleText}>{isCompleted ? '✔' : ''}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                );
            })}

            {selectedHabit && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={editModalVisible}
                    onRequestClose={handleCloseEditModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedHabit.name}</Text>
                                <TouchableOpacity onPress={handleCloseEditModal}>
                                    <Text style={styles.closeIcon}>✖</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.descriptionSection}>
                                <Text style={styles.descriptionText}>
                                    {selectedHabit.description || 'Aucune description'}
                                </Text>
                            </View>
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity style={styles.modalButton} onPress={() => navigation.navigate('EditHabit', { habit: selectedHabit })}>
                                    <Text style={styles.buttonText}>Modifier 🛠️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => handleDeleteConfirmation(selectedHabit.id)}>
                                    <Text style={styles.buttonText}>Supprimer 🗑️</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={() => onOpenHabitStats(selectedHabit.id)}>
                                    <Ionicons name="stats-chart" size={20} color="#fff" />
                                    <Text style={styles.buttonText}>Statistiques 📊</Text>
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
                            <Text>Êtes-vous sûr de vouloir supprimer cette habitude ?</Text>
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity style={styles.modalButton} onPress={confirmDeleteHabit}>
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

            {selectedHabit && selectedHabit.completionMode === 'NUMERIC' && (
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={modalVisible}
                    onRequestClose={handleCloseModal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{selectedHabit.name}</Text>
                                <TouchableOpacity onPress={handleCloseModal}>
                                    <Text style={styles.closeIcon}>✖</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.counterSection}>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setInputValue((prev) => Math.max(prev - 1, 0))}
                                    disabled={isFutureDate(selectedDate)}
                                >
                                    <Text style={styles.counterText}>-</Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={[styles.counterInput, { color: '#000' }]}
                                    keyboardType="numeric"
                                    value={String(inputValue)}
                                    onChangeText={(text) => setInputValue(Number(text) || 0)}
                                    editable={!isFutureDate(selectedDate)}
                                />
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setInputValue((prev) => prev + 1)}
                                    disabled={isFutureDate(selectedDate)}
                                >
                                    <Text style={styles.counterText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.habitUnit}>
                                {inputValue} {selectedHabit.unit || ''}
                            </Text>
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity style={[styles.modalButton, styles.deleteButton]} onPress={handleDeleteTracking}>
                                    <Text style={styles.buttonText}>Retirer la valeur</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.modalButton} onPress={handleConfirm} disabled={isFutureDate(selectedDate)}>
                                    <Text style={styles.buttonText}>Confirmer</Text>
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
        paddingBottom: 20, // Ajoute un espace supplémentaire pour permettre le défilement
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
    descriptionSection: {
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    descriptionText: {
        fontSize: 14,
        color: '#333',
    },
    statusSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
        paddingHorizontal: 10,
    },
    counterSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 15,
        paddingHorizontal: 10,
    },
    counterButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#2d2d2d',
        justifyContent: 'center',
        alignItems: 'center',
    },
    counterText: {
        fontSize: 24,
        color: '#fff',
    },
    counterInput: {
        fontSize: 24,
        color: '#fff',
        marginHorizontal: 15,
        textAlign: 'center',
        width: 50,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    habitUnit: {
        fontSize: 16,
        color: '#333',
        marginTop: 10,
        textAlign: 'center',
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
        flexDirection: 'row', // Add this line to align icon and text
        justifyContent: 'center', // Add this line to center icon and text
    },
    deleteButton: {
        backgroundColor: '#FF0000',
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
});

export default HabitList;
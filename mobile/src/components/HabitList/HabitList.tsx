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

    const handleOpenHabitStats = (habitId: number) => {
        setEditModalVisible(false); // Ferme la modale
        onOpenHabitStats(habitId);
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
                <HabitModal
                    habit={selectedHabit}
                    visible={editModalVisible}
                    onClose={handleCloseEditModal}
                    onEdit={() => navigation.navigate('EditHabit', { habit: selectedHabit })}
                    onDelete={() => handleDeleteConfirmation(selectedHabit.id)}
                    onOpenStats={() => handleOpenHabitStats(selectedHabit.id)}
                />
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

export const HabitModal: React.FC<{
    habit: Habit;
    visible: boolean;
    onClose: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onOpenStats: () => void;
}> = ({ habit, visible, onClose, onEdit, onDelete, onOpenStats }) => (
    <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={onClose}
    >
        <View style={styles.modalContainer}>
            <TouchableOpacity
                onPress={onClose}
                style={styles.floatingCloseButton}
            >
                <Ionicons name="close" size={30} color="#fff" />
            </TouchableOpacity>
            <View style={styles.modalContentEnhanced}>
                <View style={styles.modalHeaderEnhanced}>
                    <View style={styles.titleContainer}>
                        <Text style={styles.modalHabitTitle}>{habit.name}</Text>
                        <Text
                            style={[
                                styles.modalHabitDate,
                                { color: getCategoryColor(habit.category) },
                            ]}
                        >
                            {new Date(habit.startDate).toLocaleDateString()}
                        </Text>
                    </View>
                    <View
                        style={[
                            styles.modalCategoryIcon,
                            { backgroundColor: getCategoryColor(habit.category) },
                        ]}
                    >
                        {getCategoryIcon(habit.category, 24)}
                    </View>
                </View>
                <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionText}>
                        {habit.description || 'Aucune description'}
                    </Text>
                </View>
                <View style={styles.actionContainerColumn}>
                    <TouchableOpacity
                        style={styles.actionLine}
                        onPress={onOpenStats}
                    >
                        <Ionicons name="stats-chart" size={24} color="#fff" />
                        <Text style={styles.actionText}>Statistiques</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionLine}
                        onPress={onEdit}
                    >
                        <Ionicons name="create-outline" size={24} color="#fff" />
                        <Text style={styles.actionText}>Modifier</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionLine}
                        onPress={onDelete}
                    >
                        <Ionicons name="trash-outline" size={24} color="#fff" />
                        <Text style={styles.actionText}>Supprimer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    </Modal>
);

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
    modalContentEnhanced: {
        width: '90%',
        backgroundColor: '#1E1E1E',
        borderRadius: 15,
        padding: 20,
        alignItems: 'center',
    },    
    descriptionSection: {
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    
    descriptionText: {
        fontSize: 14,
        color: '#aaa',
    }, 
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: '#333',
        padding: 15,
        marginVertical: 5,
        borderRadius: 10,
    },
    deleteButton: {
        backgroundColor: '#FF0000',
    },
    closeButtonEnhanced: {
        marginTop: 20,
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    
    closeButtonText: {
        fontSize: 16,
        color: '#fff',
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
       
});

export default HabitList;
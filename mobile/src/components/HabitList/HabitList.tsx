import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Habit } from '../../types/habit.types';
import { getCategoryIcon, getCategoryColor } from '../../constants/categories';

interface HabitListProps {
    habits: Habit[];
    onToggleComplete: (id: number, value?: number) => void;
    selectedDate: Date;
}

const HabitList: React.FC<HabitListProps> = ({ habits, onToggleComplete, selectedDate }) => {
    const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
    const [inputValue, setInputValue] = useState<number>(0);

    const handleOpenModal = (habit: Habit) => {
        setSelectedHabit(habit);
        setInputValue(0);
    };

    const handleConfirm = async () => {
        if (selectedHabit) {
            await onToggleComplete(selectedHabit.id, Number(inputValue));
            setSelectedHabit(null);
        }
    };

    return (
        <View style={styles.listContainer}>
            {habits.map((habit) => {
                const selectedDateString = selectedDate.toISOString().split('T')[0];
                
                const todayTracking = habit.tracking?.find((tracking) => {
                        const trackingDate = tracking.date.split('T')[0];
                        return trackingDate === selectedDateString;
                });
                
                
                const isCompleted = todayTracking?.completed || false;              
                

                return (
                    <View key={habit.id} style={styles.itemContainer}>
                        {/* Icône et nom */}
                        <View style={styles.iconAndName}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    { backgroundColor: getCategoryColor(habit.category) },
                                ]}
                            >
                                {getCategoryIcon(habit.category)}
                            </View>
                            <View>
                                <Text style={styles.itemName}>{habit.name}</Text>
                                <Text style={styles.tag}>Habitude</Text>
                            </View>
                        </View>

                        {/* Bouton d'action */}
                        <TouchableOpacity
                            style={styles.circle}
                            onPress={() =>
                                habit.completionMode === 'NUMERIC'
                                    ? handleOpenModal(habit)
                                    : onToggleComplete(habit.id)
                            }
                        >
                            {habit.completionMode === 'NUMERIC' ? (
                                <Text style={styles.circleText}>...</Text>
                            ) : (
                                <Text style={styles.circleText}>{isCompleted ? '✔' : ''}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                );
            })}
            {/* Modale pour entrer une valeur */}
            {selectedHabit && (
                <Modal transparent={true} animationType="slide">
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.habitTitle}>{selectedHabit.name}</Text>
                            <Text style={styles.habitDate}>
                                {selectedDate.toISOString().split('T')[0]}
                            </Text>
                            <View style={styles.counterContainer}>
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() =>
                                        setInputValue((prev) => Math.max(prev - 1, 0))
                                    }
                                >
                                    <Text style={styles.counterText}>-</Text>
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.counterInput}
                                    keyboardType="numeric"
                                    value={String(inputValue)}
                                    onChangeText={(text) => setInputValue(Number(text) || 0)}
                                />
                                <TouchableOpacity
                                    style={styles.counterButton}
                                    onPress={() => setInputValue((prev) => prev + 1)}
                                >
                                    <Text style={styles.counterText}>+</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.habitUnit}>
                                {inputValue} {selectedHabit.unit || ''}
                            </Text>
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={() => setSelectedHabit(null)}
                                >
                                    <Text style={styles.cancelText}>Annuler</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.confirmButton}
                                    onPress={handleConfirm}
                                >
                                    <Text style={styles.confirmText}>Confirmer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '90%',
        backgroundColor: '#1c1c1c',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    habitTitle: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    habitDate: {
        fontSize: 14,
        color: '#ccc',
        marginVertical: 10,
    },
    counterContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
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
    counterValue: {
        fontSize: 24,
        color: '#fff',
        marginHorizontal: 15,
    },
    habitUnit: {
        fontSize: 14,
        color: '#ccc',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 20,
    },
    cancelButton: {
        flex: 1,
        marginRight: 5,
        backgroundColor: '#ff4d4d',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    confirmButton: {
        flex: 1,
        marginLeft: 5,
        backgroundColor: '#4caf50',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    cancelText: {
        color: '#fff',
        fontSize: 16,
    },
    confirmText: {
        color: '#fff',
        fontSize: 16,
    },
    habitItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    habitName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    actionButton: {
        fontSize: 10,
        color: '#007BFF',
    },
    counterInput: {
        fontSize: 24,
        color: '#fff',
        marginHorizontal: 15,
        textAlign: 'center',
        width: 50, // Adjust width as necessary
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    listContainer: {
        padding: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#1E1E1E',
        borderRadius: 10,
        padding: 10,
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
    icon: {
        fontSize: 20,
        color: '#fff',
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
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
    
});

export default HabitList;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Habit = {
    id: number;
    name: string;
    description: string;
    frequency: string;
    startDate: string;
};

interface HabitListProps {
    habits: Habit[];
}

const HabitList: React.FC<HabitListProps> = ({ habits }) => (
    <View style={styles.container}>
        <Text style={styles.header}>Habitudes</Text>
        {habits.length === 0 ? (
            <Text style={styles.empty}>Aucune habitude disponible.</Text>
        ) : (
            <View>
                {habits.map((habit) => (
                    <View key={habit.id} style={styles.habitItem}>
                        <Text style={styles.habitName}>
                            {habit.name} - {habit.description}
                        </Text>
                        <Text style={styles.habitFrequency}>Fréquence : {habit.frequency}</Text>
                    </View>
                ))}
            </View>
        )}
    </View>
);

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        marginBottom: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    empty: {
        fontSize: 16,
        fontStyle: 'italic',
        color: '#888',
    },
    habitItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    habitName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    habitFrequency: {
        fontSize: 14,
        color: '#666',
    },
});

export default HabitList;

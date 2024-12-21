import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import TaskList from './TaskList';
import HabitList from '../HabitList/HabitList';

type Props = {
    tasks: any[];
    habits: any[];
    date: Date;
    onAddPress: () => void;
};

const TaskAndHabitView: React.FC<Props> = ({ tasks, habits, date, onAddPress }) => {
    const isEmpty = tasks.length === 0 && habits.length === 0;

    return (
        <View style={styles.container}>
            {isEmpty ? (
                <View style={styles.emptyContainer}>
                    <Image
                        source={require('../../../assets/images/calendar-placeholder.png')}
                        style={styles.image}
                    />
                    <Text style={styles.emptyTitle}>Aucune activité programmée</Text>
                    <Text style={styles.emptySubtitle}>Ajoutez de nouvelles activités</Text>
                </View>
            ) : (
                <>
                    <TaskList tasks={tasks} date={date} />
                    <HabitList habits={habits} />
                </>
            )}

            {/* Bouton pour ajouter des activités */}
            <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 60,
        height: 60,
        backgroundColor: '#00bcd4',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    addButtonText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default TaskAndHabitView;

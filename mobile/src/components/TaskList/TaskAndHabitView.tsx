import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import TaskList from './TaskList';
import HabitList from '../HabitList/HabitList';

type Props = {
    tasks: any[];
    habits: any[];
    date: Date;
};

const TaskAndHabitView: React.FC<Props> = ({ tasks, habits, date }) => {
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
    }
});

export default TaskAndHabitView;

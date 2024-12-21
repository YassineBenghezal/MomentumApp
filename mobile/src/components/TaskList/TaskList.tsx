import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

type Task = {
    id: number;
    title: string;
    description: string;
};

type TaskListProps = {
    tasks?: Task[]; // Les tâches peuvent être undefined ou une liste vide
    date: Date; // Date sélectionnée
};

const TaskList: React.FC<TaskListProps> = ({ tasks = [], date }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                Tâches pour le {date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
            {tasks.length === 0 ? (
                <Text style={styles.empty}>Aucune tâche pour cette date.</Text>
            ) : (
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.taskItem}>
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.description}>{item.description}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 10,
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
    taskItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});

export default TaskList;

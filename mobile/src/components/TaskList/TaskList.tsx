import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Task } from '../../types/task.types';
import { getCategoryColor, getCategoryIcon } from '../../constants/categories';

type TaskListProps = {
    tasks?: Task[];
    date: Date;
    onToggleComplete: (id: number) => void; // Fonction pour basculer le statut de complétion
};

const TaskList: React.FC<TaskListProps> = ({ tasks = [], date, onToggleComplete }) => {
    return (
        <View style={styles.listContainer}>
            {tasks.map((task) => {
                return (
                    <View key={task.id} style={styles.itemContainer}>
                        {/* Icône et nom */}
                        <View style={styles.iconAndName}>
                        <View
                            style={[
                                styles.iconContainer,
                                { backgroundColor: getCategoryColor(task.category) },
                            ]}
                        >
                            {getCategoryIcon(task.category)}
                        </View>
                            <View>
                                <Text style={styles.itemName}>{task.title}</Text>
                                <Text style={styles.tag}>Tâche</Text>
                            </View>
                        </View>

                        {/* Bouton d'action */}
                        <TouchableOpacity style={styles.circle} onPress={() => onToggleComplete(task.id)}>
                            <Text style={styles.circleText}>{task.completed ? '✔' : ''}</Text>
                        </TouchableOpacity>
                    </View>
                );
            })}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    completed: {
        textDecorationLine: 'line-through',
        color: '#888',
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
    actionButton: {
        fontSize: 20,
        color: '#007BFF',
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

export default TaskList;

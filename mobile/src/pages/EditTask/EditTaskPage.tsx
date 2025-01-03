import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Assurez-vous d'importer Picker depuis @react-native-picker/picker
import { Task, Category, Priority } from '../../types/task.types';
import { updateTask } from '../../api/tasks.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

type EditTaskPageProps = {
    route: { params: { task: Task } };
    navigation: any;
};

const EditTaskPage: React.FC<EditTaskPageProps> = ({ route, navigation }) => {
    const { task } = route.params;
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [category, setCategory] = useState<Category>(task.category);
    const [priority, setPriority] = useState<Priority>(task.priority);
    const [deadline, setDeadline] = useState<Date | null>(new Date(task.deadline));
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false);
        if (selectedDate) {
            setDeadline(selectedDate);
        }
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
                return;
            }
            const updatedTask = { ...task, title, description, category, priority, deadline: deadline?.toISOString() || null };
            await updateTask(task.id, updatedTask, token);
            Alert.alert('Succès', 'La tâche a été modifiée avec succès.');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to update task:', error);
            Alert.alert('Erreur', 'Impossible de modifier la tâche.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Titre</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                multiline
            />
            <Text style={styles.label}>Catégorie</Text>
            <Picker selectedValue={category} onValueChange={(itemValue) => setCategory(itemValue)}>
                <Picker.Item label="Art" value="ART" />
                <Picker.Item label="Tâche" value="TASK" />
                <Picker.Item label="Méditation" value="MEDITATION" />
                <Picker.Item label="Études" value="STUDIES" />
                <Picker.Item label="Sports" value="SPORTS" />
                <Picker.Item label="Divertissement" value="ENTERTAINMENT" />
                <Picker.Item label="Social" value="SOCIAL" />
                <Picker.Item label="Finances" value="FINANCES" />
                <Picker.Item label="Santé" value="HEALTH" />
                <Picker.Item label="Travail" value="WORK" />
                <Picker.Item label="Nourriture" value="FOOD" />
                <Picker.Item label="Maison" value="HOME" />
                <Picker.Item label="Extérieur" value="OUTDOORS" />
                <Picker.Item label="Autre" value="OTHER" />
            </Picker>
            <Text style={styles.label}>Priorité</Text>
            <Picker selectedValue={priority} onValueChange={(itemValue) => setPriority(itemValue)}>
                <Picker.Item label="Haute" value="HIGH" />
                <Picker.Item label="Moyenne" value="MEDIUM" />
                <Picker.Item label="Basse" value="LOW" />
            </Picker>
            <Text style={styles.label}>Date limite</Text>
            <Button
                title={deadline ? deadline.toLocaleDateString('fr-FR') : 'Choisir une date'}
                onPress={() => setShowDatePicker(true)}
            />
            {showDatePicker && (
                <DateTimePicker
                    value={deadline || new Date()}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                />
            )}
            <Button title="Enregistrer" onPress={handleSave} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
});

export default EditTaskPage;
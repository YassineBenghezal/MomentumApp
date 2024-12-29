import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTask } from '../../api/tasks.api';
import { Picker } from '@react-native-picker/picker';

const AddTaskPage = ({ navigation }: { navigation: any }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('OTHER');
    const [priority, setPriority] = useState('MEDIUM');
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowDatePicker(false); // Ferme le sélecteur
        if (selectedDate) {
            setDeadline(selectedDate); // Met à jour la date si l'utilisateur a choisi une date
        }
    };

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Erreur', 'Le titre est obligatoire.');
            return;
        }

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            Alert.alert('Erreur', 'Vous devez être connecté pour créer une tâche.');
            navigation.navigate('Login');
            return;
        }

        const taskData = {
            title,
            description,
            category,
            priority,
            deadline: deadline?.toISOString() || null,
            completed: false,
            archived: false,
        };

        try {
            await createTask(taskData, token);
            Alert.alert('Succès', 'Tâche créée avec succès !');
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la création de la tâche :', error);
            Alert.alert('Erreur', 'Impossible de créer la tâche.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Créer une Tâche</Text>
            <Text style={styles.label}>Titre</Text>
            <TextInput
                style={styles.input}
                placeholder="Titre"
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description (optionnel)"
                value={description}
                onChangeText={setDescription}
            />
            <Text style={styles.label}>Catégorie</Text>
            <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={(itemValue) => setCategory(itemValue)}
            >
                <Picker.Item label="Autre" value="OTHER" />
                <Picker.Item label="Travail" value="WORK" />
                <Picker.Item label="Personnel" value="PERSONAL" />
            </Picker>
            <Text style={styles.label}>Priorité</Text>
            <Picker
                selectedValue={priority}
                style={styles.picker}
                onValueChange={(itemValue) => setPriority(itemValue)}
            >
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
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
    picker: { marginBottom: 10 },
});

export default AddTaskPage;

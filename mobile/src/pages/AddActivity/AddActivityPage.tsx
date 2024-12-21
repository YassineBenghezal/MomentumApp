import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createHabit } from '../../api/habits.api';
import { createTask } from '../../api/tasks.api';

const AddActivityPage = ({ navigation }: { navigation: any }) => {
    const [isHabit, setIsHabit] = useState(false); // Choix entre tâche et habitude
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('OTHER');
    const [priority, setPriority] = useState('MEDIUM');
    const [frequency, setFrequency] = useState('daily');
    const [days, setDays] = useState<string[]>([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [deadline, setDeadline] = useState<Date | null>(null);
    const [isDeadlinePickerVisible, setIsDeadlinePickerVisible] = useState(false);
    const [isStartDatePickerVisible, setIsStartDatePickerVisible] = useState(false);
    const [isEndDatePickerVisible, setIsEndDatePickerVisible] = useState(false);


    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert('Erreur', 'Le titre est obligatoire.');
            return;
        }

        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            Alert.alert('Erreur', 'Vous devez être connecté pour créer une activité.');
            navigation.navigate('Login');
            return;
        }

        const activityData = isHabit
            ? {
                  name: title,
                  description,
                  category,
                  frequency,
                  days,
                  startDate: startDate.toISOString(),
                  endDate: endDate?.toISOString() || null,
              }
            : {
                  title,
                  description,
                  category,
                  priority,
                  deadline: deadline?.toISOString() || null,
              };

        try {
            if (isHabit) {
                await createHabit(activityData, token);
                Alert.alert('Succès', 'Habitude créée avec succès !');
            } else {
                await createTask(activityData, token);
                Alert.alert('Succès', 'Tâche créée avec succès !');
            }
            navigation.goBack();
        } catch (error) {
            console.error('Erreur lors de la création de l\'activité :', error);
            Alert.alert('Erreur', 'Impossible de créer l\'activité.');
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Créer une {isHabit ? 'habitude' : 'tâche'}</Text>

            <View style={styles.switchContainer}>
                <Button title="Créer une tâche" onPress={() => setIsHabit(false)} />
                <Button title="Créer une habitude" onPress={() => setIsHabit(true)} />
            </View>

            {/* Titre */}
            <Text style={styles.label}>Titre</Text>
            <TextInput
                style={styles.input}
                placeholder="Titre"
                value={title}
                onChangeText={setTitle}
            />

            {/* Description */}
            <Text style={styles.label}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description (optionnel)"
                value={description}
                onChangeText={setDescription}
            />

            {/* Catégorie */}
            <Text style={styles.label}>Catégorie</Text>
            <Picker
                selectedValue={category}
                style={styles.picker}
                onValueChange={(itemValue) => setCategory(itemValue)}
            >
                <Picker.Item label="Sports" value="SPORTS" />
                <Picker.Item label="Finances" value="FINANCES" />
                <Picker.Item label="Santé" value="SANTÉ" />
                <Picker.Item label="Autre" value="AUTRE" />
            </Picker>

            {/* Champs spécifiques à une tâche */}
            {!isHabit && (
                <>
                    <Text style={styles.label}>Date limite</Text>
                    <Button
                        title={deadline ? `Modifier : ${deadline.toLocaleDateString('fr-FR')}` : 'Choisir une date limite'}
                        onPress={() => setIsDeadlinePickerVisible(true)}
                    />
                    {isDeadlinePickerVisible && (
                        <DateTimePicker
                            value={deadline || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setIsDeadlinePickerVisible(false);
                                if (date) setDeadline(date);
                            }}
                        />
                    )}
                </>
            )}

            {/* Champs spécifiques à une habitude */}
            {isHabit && (
                <>
                    <Text style={styles.label}>Date de début</Text>
                    <Button
                        title={startDate ? `Modifier : ${startDate.toLocaleDateString('fr-FR')}` : 'Choisir une date de début'}
                        onPress={() => setIsStartDatePickerVisible(true)}
                    />
                    {isStartDatePickerVisible && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setIsStartDatePickerVisible(false);
                                if (date) setStartDate(date);
                            }}
                        />
                    )}

                    <Text style={styles.label}>Date de fin (optionnel)</Text>
                    <Button
                        title={endDate ? `Modifier : ${endDate.toLocaleDateString('fr-FR')}` : 'Choisir une date de fin'}
                        onPress={() => setIsEndDatePickerVisible(true)}
                    />
                    {isEndDatePickerVisible && (
                        <DateTimePicker
                            value={endDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={(event, date) => {
                                setIsEndDatePickerVisible(false);
                                setEndDate(date || null);
                            }}
                        />
                    )}
                </>
            )}


            <Button title="Enregistrer" onPress={handleSave} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginTop: 10,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    picker: {
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
});

export default AddActivityPage;

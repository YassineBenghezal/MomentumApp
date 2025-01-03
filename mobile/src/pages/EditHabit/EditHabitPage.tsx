import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Habit, Category, Frequency } from '../../types/habit.types';
import { updateHabit } from '../../api/habits.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker'; // Import DateTimePicker

type EditHabitPageProps = {
    route: { params: { habit: Habit } };
    navigation: any;
};

const EditHabitPage: React.FC<EditHabitPageProps> = ({ route, navigation }) => {
    const { habit } = route.params;
    const [name, setName] = useState(habit.name);
    const [description, setDescription] = useState(habit.description);
    const [category, setCategory] = useState<Category>(habit.category);
    const [frequency, setFrequency] = useState<Frequency>(habit.frequency);
    const [daysOfWeek, setDaysOfWeek] = useState<string[]>(habit.daysOfWeek || []);
    const [daysOfMonth, setDaysOfMonth] = useState<string[]>(habit.daysOfMonth || []);
    const [daysOfYear, setDaysOfYear] = useState<{ month: number; day: number }[]>(habit.daysOfYear || []);
    const [occurrences, setOccurrences] = useState<number | undefined>(habit.occurrences);
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>(habit.period || 'week');
    const [startDate, setStartDate] = useState(new Date(habit.startDate));
    const [endDate, setEndDate] = useState<Date | null>(habit.endDate ? new Date(habit.endDate) : null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);

    const handleStartDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
        }
    };

    const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };

    const toggleDayOfWeek = (day: string) => {
        setDaysOfWeek((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const toggleDayOfMonth = (day: string) => {
        setDaysOfMonth((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    const removeYearlyDay = (index: number) => {
        setDaysOfYear((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            if (!token) {
                Alert.alert('Erreur', 'Vous devez être connecté pour effectuer cette action.');
                return;
            }
            const updatedHabit = {
                ...habit,
                name,
                description,
                category,
                frequency,
                daysOfWeek: frequency === 'WEEKLY' ? daysOfWeek : undefined,
                daysOfMonth: frequency === 'MONTHLY' ? daysOfMonth : undefined,
                daysOfYear: frequency === 'YEARLY' ? daysOfYear : undefined,
                occurrences: frequency === 'CUSTOM' ? occurrences : undefined,
                period: frequency === 'CUSTOM' ? period : undefined,
                startDate: startDate.toISOString(),
                endDate: endDate ? endDate.toISOString() : null
            };
            await updateHabit(habit.id, updatedHabit, token);
            Alert.alert('Succès', 'L\'habitude a été modifiée avec succès.');
            navigation.goBack();
        } catch (error) {
            console.error('Failed to update habit:', error);
            Alert.alert('Erreur', 'Impossible de modifier l\'habitude.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Nom</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
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
            <Text style={styles.label}>Fréquence</Text>
            <Picker selectedValue={frequency} onValueChange={(itemValue) => setFrequency(itemValue)}>
                <Picker.Item label="Quotidienne" value="DAILY" />
                <Picker.Item label="Jours spécifiques de la semaine" value="WEEKLY" />
                <Picker.Item label="Jours spécifiques du mois" value="MONTHLY" />
                <Picker.Item label="Jours spécifiques de l'année" value="YEARLY" />
                <Picker.Item label="Nombre de fois sur une période" value="CUSTOM" />
            </Picker>

            {frequency === 'WEEKLY' && (
                <>
                    <Text style={styles.label}>Jours de la semaine</Text>
                    <View style={styles.weekdayGrid}>
                        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.weekdayButton,
                                    daysOfWeek.includes(String(index)) ? styles.selectedButton : styles.unselectedButton,
                                ]}
                                onPress={() => toggleDayOfWeek(String(index))}
                            >
                                <Text style={styles.buttonText}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}

            {frequency === 'MONTHLY' && (
                <>
                    <Text style={styles.label}>Jours spécifiques du mois</Text>
                    <View style={styles.gridContainer}>
                        {Array.from({ length: 31 }, (_, i) => String(i + 1)).map((day) => (
                            <TouchableOpacity
                                key={day}
                                style={[
                                    styles.dayButton,
                                    daysOfMonth.includes(day) ? styles.selectedButton : styles.unselectedButton,
                                ]}
                                onPress={() => toggleDayOfMonth(day)}
                            >
                                <Text style={styles.buttonText}>{day}</Text>
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            style={[
                                styles.dayButton,
                                daysOfMonth.includes('Dernier') ? styles.selectedButton : styles.unselectedButton,
                            ]}
                            onPress={() => toggleDayOfMonth('Dernier')}
                        >
                            <Text style={styles.buttonText}>Dernier</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}

            {frequency === 'YEARLY' && (
                <>
                    <Text style={styles.label}>Jours spécifiques de l'année</Text>
                    {daysOfYear.map((entry, index) => (
                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                            <Picker
                                selectedValue={entry.month}
                                style={{ flex: 1 }}
                                onValueChange={(value) =>
                                    setDaysOfYear((prev) =>
                                        prev.map((e, i) => (i === index ? { ...e, month: Number(value) } : e))
                                    )
                                }
                            >
                                {['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'].map((month, i) => (
                                    <Picker.Item key={i} label={month} value={String(i + 1)} />
                                ))}
                            </Picker>
                            <TextInput
                                style={[styles.input, { flex: 1 }]}
                                placeholder="Jour"
                                keyboardType="numeric"
                                value={entry.day ? String(entry.day) : ''}
                                onChangeText={(text) =>
                                    setDaysOfYear((prev) =>
                                        prev.map((e, i) => (i === index ? { ...e, day: parseInt(text, 10) || 0 } : e))
                                    )
                                }
                            />
                            <TouchableOpacity
                                style={[styles.removeButton]}
                                onPress={() => removeYearlyDay(index)}
                            >
                                <Text style={styles.removeButtonText}>X</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                    <Button
                        title="Ajouter un jour"
                        onPress={() => setDaysOfYear((prev) => [...prev, { month: 1, day: 1 }])}
                    />
                </>
            )}

            {frequency === 'CUSTOM' && (
                <>
                    <Text style={styles.label}>Nombre de fois</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre"
                        keyboardType="numeric"
                        value={occurrences ? String(occurrences) : ''}
                        onChangeText={(text) => setOccurrences(text ? parseInt(text, 10) : undefined)}
                    />
                    <Text style={styles.label}>Période</Text>
                    <Picker
                        selectedValue={period}
                        style={styles.picker}
                        onValueChange={(value) => setPeriod(value)}
                    >
                        <Picker.Item label="Semaine" value="week" />
                        <Picker.Item label="Mois" value="month" />
                        <Picker.Item label="Année" value="year" />
                    </Picker>
                </>
            )}

            <Text style={styles.label}>Date de début</Text>
            <Button
                title={startDate.toLocaleDateString('fr-FR')}
                onPress={() => setShowStartDatePicker(true)}
            />
            {showStartDatePicker && (
                <DateTimePicker
                    value={startDate}
                    mode="date"
                    display="default"
                    onChange={handleStartDateChange}
                />
            )}
            <Text style={styles.label}>Date de fin</Text>
            <Button
                title={endDate ? endDate.toLocaleDateString('fr-FR') : 'Choisir une date'}
                onPress={() => setShowEndDatePicker(true)}
            />
            {showEndDatePicker && (
                <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={handleEndDateChange}
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
    picker: {
        marginBottom: 10,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    dayButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 5,
    },
    weekdayGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    weekdayButton: {
        width: 70,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        marginVertical: 5,
    },
    selectedButton: {
        backgroundColor: '#00bcd4',
    },
    unselectedButton: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    removeButton: {
        backgroundColor: '#ff4d4d',
        borderRadius: 10,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    removeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EditHabitPage;

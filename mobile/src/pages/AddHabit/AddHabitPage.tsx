import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert, TouchableOpacity, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createHabit } from '../../api/habits.api';
import { Category, Habit } from '../../types/habit.types';

const AddHabitPage = ({ navigation }: { navigation: any }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<Category>('OTHER');
    const [frequencyType, setFrequencyType] = useState<Habit['frequency']>('DAILY');
    const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
    const [daysOfMonth, setDaysOfMonth] = useState<string[]>([]);
    const [daysOfYear, setDaysOfYear] = useState<{ month: number; day: number }[]>([]);
    const [occurrences, setOccurrences] = useState<number | undefined>(undefined);
    const [period, setPeriod] = useState<'week' | 'month' | 'year'>('week');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [completionMode, setCompletionMode] = useState<'BINARY' | 'NUMERIC'>('BINARY'); // Mode de complétion
    const [unit, setUnit] = useState<string>(''); // Unité de référence pour le mode numérique


    const handleStartDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowStartDatePicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
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
        if (!title.trim()) {
            Alert.alert('Erreur', 'Le titre est obligatoire.');
            return;
        }
    
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
            Alert.alert('Erreur', 'Vous devez être connecté pour créer une habitude.');
            navigation.navigate('Login');
            return;
        }
    
        const habitData: Partial<Habit> = {
            name: title,
            description,
            category,
            frequency: frequencyType as Habit['frequency'],
            daysOfWeek: frequencyType === 'WEEKLY' ? daysOfWeek : undefined,
            daysOfMonth: frequencyType === 'MONTHLY' ? daysOfMonth : undefined,
            daysOfYear: frequencyType === 'YEARLY' ? daysOfYear : undefined,
            occurrences: frequencyType === 'CUSTOM' ? occurrences : undefined,
            period: frequencyType === 'CUSTOM' ? period : undefined,
            startDate: startDate.toISOString(),
            endDate: endDate ? endDate.toISOString() : null,
            completionMode,
            unit: completionMode === 'NUMERIC' ? unit : undefined,
        };
    
        try {
            await createHabit(habitData, token);
            Alert.alert('Succès', 'Habitude créée avec succès !');
            navigation.goBack();
        } catch (error) {
            console.error("Erreur lors de la création de l'habitude :", error);
            Alert.alert('Erreur', "Impossible de créer l'habitude.");
        }
    };    

    const handleEndDateChange = (event: any, selectedDate: Date | undefined) => {
        setShowEndDatePicker(false);
        if (selectedDate) {
            setEndDate(selectedDate);
        }
    };    

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Créer une Habitude</Text>

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
                onValueChange={(itemValue) => setCategory(itemValue as Category)}
            >
                <Picker.Item label="Autre" value="OTHER" />
                <Picker.Item label="Travail" value="WORK" />
                <Picker.Item label="Personnel" value="PERSONAL" />
                <Picker.Item label="Santé" value="HEALTH" />
                <Picker.Item label="Finance" value="FINANCE" />
            </Picker>

            <Text style={styles.label}>Mode de complétion</Text>
            <Picker
                selectedValue={completionMode}
                style={styles.picker}
                onValueChange={(value) => setCompletionMode(value)}
            >
                <Picker.Item label="Oui / Non (ex : binaire)" value="BINARY" />
                <Picker.Item label="Valeur numérique (ex : quantifiable)" value="NUMERIC" />
            </Picker>
            <Text style={styles.description}>
                {completionMode === 'BINARY'
                    ? "Ce mode vous permet d'indiquer si l'habitude est complétée ou non (Oui/Non)."
                    : "Ce mode vous permet de quantifier votre habitude (par exemple, 4 cigarettes ou 30 minutes)."}
            </Text>

            {completionMode === 'NUMERIC' && (
                <View>
                    <Text style={styles.label}>Unité de référence</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez une unité (ex : minutes, cigarettes)"
                        value={unit}
                        onChangeText={setUnit}
                    />
                </View>
            )}

            <Text style={styles.label}>Fréquence</Text>
            <Picker
                selectedValue={frequencyType}
                style={styles.picker}
                onValueChange={(value) => setFrequencyType(value)}
            >
                <Picker.Item label="Quotidienne" value="DAILY" />
                <Picker.Item label="Jours spécifiques de la semaine" value="WEEKLY" />
                <Picker.Item label="Jours spécifiques du mois" value="MONTHLY" />
                <Picker.Item label="Jours spécifiques de l'année" value="YEARLY" />
                <Picker.Item label="Nombre de fois sur une période" value="CUSTOM" />
            </Picker>

            {frequencyType === 'WEEKLY' && (
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

            {frequencyType === 'MONTHLY' && (
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

            {frequencyType === 'YEARLY' && (
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

            {frequencyType === 'CUSTOM' && (
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

            <Text style={styles.label}>Date de fin (optionnelle)</Text>
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

            <View style={styles.saveButton}>
                <Button title="Enregistrer" onPress={handleSave} />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    label: { fontSize: 16, marginTop: 10, marginBottom: 5 },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 10 },
    picker: { marginBottom: 10 },
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
    saveButton: {
        marginTop: 30,
        marginBottom: 50,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    description: {
        fontSize: 14,
        fontStyle: 'italic',
        marginBottom: 10,
        color: '#555',
    },
});

export default AddHabitPage;

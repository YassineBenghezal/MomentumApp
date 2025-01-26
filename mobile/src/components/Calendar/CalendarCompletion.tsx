import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';

const CalendarCompletion = ({ trackingData }: { trackingData: any[] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalVisible, setModalVisible] = useState(false);

    const changeMonth = (increment: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + increment);
        setCurrentDate(newDate);
    };

    const openModal = () => setModalVisible(true);
    const closeModal = () => setModalVisible(false);

    const selectDate = (month: number, year: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(year, month, 1);
        setCurrentDate(newDate);
        closeModal();
    };

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    return (
        <View style={styles.container}>
            {/* Header avec navigation */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                    <Text style={styles.arrow}>{'<'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={openModal}>
                    <Text style={styles.monthYearText}>
                        {currentDate.toLocaleString('fr-FR', { month: 'long', year: 'numeric' })}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                    <Text style={styles.arrow}>{'>'}</Text>
                </TouchableOpacity>
            </View>

            {/* Calendrier horizontal */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.calendarContainer}>
                {Array.from({ length: daysInMonth }, (_, index) => {
                    const day = index + 1;
                    const isCompleted = trackingData.some((item) => {
                        const date = new Date(item.date);
                        return (
                            date.getDate() === day &&
                            date.getMonth() === currentDate.getMonth() &&
                            date.getFullYear() === currentDate.getFullYear()
                        );
                    });

                    return (
                        <TouchableOpacity key={day} style={[styles.dayContainer, isCompleted && styles.dayCompleted]}>
                            <Text style={styles.dayText}>{day}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Modale pour choisir mois et année */}
            <Modal visible={isModalVisible} transparent animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Définir une date</Text>
                        <ScrollView>
                            {Array.from({ length: 12 }).map((_, monthIndex) => (
                                <TouchableOpacity
                                    key={monthIndex}
                                    style={styles.modalItem}
                                    onPress={() => selectDate(monthIndex, currentDate.getFullYear())}
                                >
                                    <Text style={styles.modalText}>
                                        {new Date(0, monthIndex).toLocaleString('fr-FR', { month: 'long' })}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                            <Text style={styles.closeText}>Annuler</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#000' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    arrow: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
    monthYearText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
    calendarContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        backgroundColor: '#333',
        borderRadius: 10,
    },
    dayContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        borderRadius: 20,
        backgroundColor: '#555',
    },
    dayCompleted: { backgroundColor: '#0f0' },
    dayText: { color: '#fff', fontSize: 16 },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#1e1e1e',
        borderRadius: 10,
        padding: 20,
    },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 10 },
    modalItem: { paddingVertical: 10 },
    modalText: { color: '#fff', textAlign: 'center' },
    modalCloseButton: { marginTop: 20, alignItems: 'center' },
    closeText: { color: '#00BFFF', fontSize: 16, fontWeight: 'bold' },
});

export default CalendarCompletion;

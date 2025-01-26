import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TimeSection = ({ completedThisWeek, completedThisMonth, completedThisYear, completedAllTime }: { completedThisWeek: number, completedThisMonth: number, completedThisYear: number, completedAllTime: number }) => {
    return (
        <View style={styles.centeredBlock}>
            {getCustomIcon('TIME')}
            <Text style={styles.sectionTitle}>Temps accomplis</Text>
            <View style={styles.timeStats}>
                <Text style={styles.timeStat}>Cette semaine : {completedThisWeek}</Text>
                <Text style={styles.timeStat}>Ce mois : {completedThisMonth}</Text>
                <Text style={styles.timeStat}>Cette année : {completedThisYear}</Text>
                <Text style={styles.timeStat}>Tout : {completedAllTime}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    centeredBlock: {
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        borderWidth: 1,
        borderColor: '#aaa',
        borderRadius: 10,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        textTransform: 'uppercase',
        textAlign: 'center',
        paddingVertical: 5,
        backgroundColor: '#333',
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    timeStats: {
        width: '100%',
        marginTop: 10,
    },
    timeStat: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 5,
        textAlign: 'center',
    },
});

export default TimeSection;
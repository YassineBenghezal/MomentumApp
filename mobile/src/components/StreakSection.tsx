import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StreakSection = ({ currentStreak, bestStreak, streakUnit }: { currentStreak: number, bestStreak: number, streakUnit: string }) => {
    return (
        <View style={styles.centeredBlock}>
            {getCustomIcon('STREAK')}
            <Text style={styles.sectionTitle}>Série</Text>
            <View style={styles.statRow}>
                <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>Actuelle</Text>
                    <Text style={styles.statValue}>{currentStreak} {streakUnit}</Text>
                </View>
                <View style={styles.statBlock}>
                    <Text style={styles.statLabel}>Meilleure</Text>
                    <Text style={styles.statValue}>{bestStreak} {streakUnit}</Text>
                </View>
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
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    statBlock: {
        alignItems: 'center',
        width: '45%',
    },
    statLabel: {
        color: '#aaa',
        fontSize: 14,
        marginBottom: 5,
    },
    statValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default StreakSection;
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity } from 'react-native';
import { fetchHabitStats } from '../../api/habits.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { CommonActions, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation.types';
import { Habit } from '../../types/habit.types';

const screenWidth = Dimensions.get('window').width;

type HabitStatsPageRouteProp = RouteProp<RootStackParamList, 'HabitStats'>;

interface HabitStats {
    stats: {
        habit: Habit;
        completionRate: number;
    };
}

const HabitStatsPage = ({ route, navigation }: { route: HabitStatsPageRouteProp, navigation: any }) => {
    const { habitId } = route.params;
    const [stats, setStats] = useState<HabitStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = await AsyncStorage.getItem('authToken');
                if (!token) {
                    setError('Vous devez être connecté pour voir vos statistiques.');
                    return;
                }
                const data = await fetchHabitStats(token, habitId);
                setStats(data);
            } catch (err) {
                console.error('Erreur lors de la récupération des statistiques :', err);
                setError('Impossible de récupérer les statistiques.');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
        return () => {
        };
    }, [habitId]);

    if (loading) return <Text style={styles.loading}>Chargement...</Text>;
    if (error) return <Text style={styles.error}>{error}</Text>;

    const completionRate = stats?.stats.completionRate ? stats.stats.completionRate / 100 : 0;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
            <TouchableOpacity
                onPress={() =>
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        })
                    )
                }
            >
                <Text style={styles.backButton}>{'<'}</Text>
            </TouchableOpacity>
                <Text style={styles.habitTitle}>{stats?.stats.habit.name || 'Habitude'}</Text>
            </View>
            <View style={styles.container}>
                <Text style={styles.sectionTitle}>Score d'habitude</Text>
                <View style={styles.chartContainer}>
                    <ProgressChart
                        data={{ data: [completionRate] }}
                        width={screenWidth - 40}
                        height={220}
                        strokeWidth={16}
                        radius={50}
                        chartConfig={{
                            backgroundGradientFrom: '#1e1e1e',
                            backgroundGradientTo: '#1e1e1e',
                            color: (opacity = 1) => `rgba(0, 191, 255, ${opacity})`,
                            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                            style: { borderRadius: 16 },
                        }}
                        hideLegend={true}
                    />
                    <Text style={styles.completionText}>{Math.round(completionRate * 100)}</Text>
                </View>
                <View style={styles.statsContainer}>
                    <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Actuelle</Text>
                        <Text style={styles.statValue}>2 SEMAINES</Text>
                    </View>
                    <View style={styles.statBlock}>
                        <Text style={styles.statLabel}>Meilleure</Text>
                        <Text style={styles.statValue}>2 SEMAINES</Text>
                    </View>
                </View>
                <View style={styles.timeStats}>
                    <Text style={styles.sectionTitle}>Temps accomplis</Text>
                    <Text style={styles.timeStat}>Cette semaine : 2</Text>
                    <Text style={styles.timeStat}>Ce mois : 1</Text>
                    <Text style={styles.timeStat}>Cette année : 1</Text>
                    <Text style={styles.timeStat}>Tout : 4</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#000',
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    backButton: {
        color: '#fff',
        fontSize: 18,
    },
    habitTitle: {
        flex: 1,
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1e1e1e',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    chartContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        marginBottom: 20,
    },
    completionText: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
    },
    statBlock: {
        alignItems: 'center',
    },
    statLabel: {
        color: '#aaa',
        fontSize: 14,
    },
    statValue: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    timeStats: {
        marginTop: 30,
    },
    timeStat: {
        color: '#fff',
        fontSize: 16,
        marginVertical: 5,
    },
    loading: {
        color: '#fff',
        textAlign: 'center',
        marginTop: '50%',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginTop: '50%',
    },
});

export default HabitStatsPage;

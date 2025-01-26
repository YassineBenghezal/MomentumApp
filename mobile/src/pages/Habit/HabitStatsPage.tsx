import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, ScrollView, BackHandler, Alert } from 'react-native';
import { fetchHabitStats } from '../../api/habits.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation.types';
import { Habit, Tracking } from '../../types/habit.types';
import { getCategoryColor, getCategoryIcon } from '../../constants/categories';
import CalendarCompletion from '../../components/Calendar/CalendarCompletion';

type HabitStatsPageRouteProp = RouteProp<RootStackParamList, 'HabitStats'>;

interface HabitStats {
    stats: {
        habit: Habit;
        completionRate: number;
    };
    currentStreak: number;
    bestStreak: number;
}

const getStreakUnit = (frequency: string, period?: string) => {
    switch (frequency) {
        case 'DAILY':
            return 'JOURS';
        case 'WEEKLY':
            return 'SEMAINES';
        case 'MONTHLY':
            return 'MOIS';
        case 'YEARLY':
            return 'ANNÉES';
        case 'CUSTOM':
            return period?.toUpperCase() || 'PÉRIODE';
        default:
            return 'JOURS';
    }
};

const calculateCompletedTimes = (tracking: Tracking[], period: 'week' | 'month' | 'year' | 'all') => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Start of the week (Monday)
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1); // Start of the year
            break;
        case 'all':
        default:
            return tracking.length; // All time
    }

    return tracking.filter(track => new Date(track.date) >= startDate).length;
};

const calculateTotalUnits = (tracking: Tracking[], period: 'week' | 'month' | 'year' | 'all') => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
        case 'week':
            startDate = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Start of the week (Monday)
            break;
        case 'month':
            startDate = new Date(now.getFullYear(), now.getMonth(), 1); // Start of the month
            break;
        case 'year':
            startDate = new Date(now.getFullYear(), 0, 1); // Start of the year
            break;
        case 'all':
        default:
            return tracking.reduce((total, track) => total + (track.value || 0), 0); // All time
    }

    return tracking
        .filter(track => new Date(track.date) >= startDate)
        .reduce((total, track) => total + (track.value || 0), 0);
};

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
    }, [habitId]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                Alert.alert(
                    'Confirmation',
                    'Voulez-vous vraiment quitter cette page ?',
                    [
                        {
                            text: 'Annuler',
                            onPress: () => null,
                            style: 'cancel',
                        },
                        {
                            text: 'Oui',
                            onPress: () => navigation.goBack(),
                        },
                    ],
                    { cancelable: false }
                );
                return true; // Empêche le comportement par défaut
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [navigation])
    );

    if (loading) return <Text style={styles.loading}>Chargement...</Text>;
    if (error) return <Text style={styles.error}>{error}</Text>;

    const completionRate = useMemo(() => stats?.stats.completionRate ? stats.stats.completionRate / 100 : 0, [stats]);
    const streakUnit = useMemo(() => getStreakUnit(stats?.stats.habit.frequency || 'DAILY', stats?.stats.habit.period), [stats]);

    const completedThisWeek = useMemo(() => calculateCompletedTimes(stats?.stats.habit.tracking || [], 'week'), [stats]);
    const completedThisMonth = useMemo(() => calculateCompletedTimes(stats?.stats.habit.tracking || [], 'month'), [stats]);
    const completedThisYear = useMemo(() => calculateCompletedTimes(stats?.stats.habit.tracking || [], 'year'), [stats]);
    const completedAllTime = useMemo(() => calculateCompletedTimes(stats?.stats.habit.tracking || [], 'all'), [stats]);

    const totalUnitsThisWeek = useMemo(() => calculateTotalUnits(stats?.stats.habit.tracking || [], 'week'), [stats]);
    const totalUnitsThisMonth = useMemo(() => calculateTotalUnits(stats?.stats.habit.tracking || [], 'month'), [stats]);
    const totalUnitsThisYear = useMemo(() => calculateTotalUnits(stats?.stats.habit.tracking || [], 'year'), [stats]);
    const totalUnitsAllTime = useMemo(() => calculateTotalUnits(stats?.stats.habit.tracking || [], 'all'), [stats]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backButton}>{'<'}</Text>
                </TouchableOpacity>
                <Text style={styles.habitTitle}>{stats?.stats.habit.name || 'Habitude'}</Text>
                <View style={[styles.categoryIcon, { backgroundColor: getCategoryColor(stats?.stats.habit.category || 'OTHER') }]}>
                    {getCategoryIcon(stats?.stats.habit.category || 'OTHER', 24, '#fff')}
                </View>
            </View>
            <ScrollView style={styles.container}>
                <ScoreSection completionRate={completionRate} />
                <StreakSection currentStreak={stats?.currentStreak || 0} bestStreak={stats?.bestStreak || 0} streakUnit={streakUnit} />
                <TimeSection completedThisWeek={completedThisWeek} completedThisMonth={completedThisMonth} completedThisYear={completedThisYear} completedAllTime={completedAllTime} />
                {stats?.stats.habit.completionMode === 'NUMERIC' && (
                    <View style={styles.centeredBlock}>
                        {getCustomIcon('TIME')}
                        <Text style={styles.sectionTitle}>Total {stats.stats.habit.unit}</Text>
                        <View style={styles.timeStats}>
                            <Text style={styles.timeStat}>Cette semaine : {totalUnitsThisWeek} {stats.stats.habit.unit}</Text>
                            <Text style={styles.timeStat}>Ce mois : {totalUnitsThisMonth} {stats.stats.habit.unit}</Text>
                            <Text style={styles.timeStat}>Cette année : {totalUnitsThisYear} {stats.stats.habit.unit}</Text>
                            <Text style={styles.timeStat}>Tout : {totalUnitsAllTime} {stats.stats.habit.unit}</Text>
                        </View>
                    </View>
                )}
                <View style={styles.centeredBlock}>
                    <CalendarCompletion trackingData={stats?.stats.habit.tracking || []} />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
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
    categoryIcon: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#1e1e1e',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
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
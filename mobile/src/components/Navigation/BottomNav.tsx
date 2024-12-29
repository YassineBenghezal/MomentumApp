import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation.types';

const BottomNav = () => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute();

    const isActive = (routeName: keyof RootStackParamList) => route.name === routeName;

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.navItem, isActive('Home') && styles.activeNavItem]}
                onPress={() => navigation.navigate('Home')}
            >
                <Ionicons name="today-outline" size={24} color={isActive('Home') ? '#00bcd4' : '#fff'} />
                <Text style={[styles.navText, isActive('Home') && styles.activeNavText]}>Aujourd'hui</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.navItem, isActive('Habits') && styles.activeNavItem]}
                onPress={() => navigation.navigate('Habits')}
            >
                <Ionicons name="leaf-outline" size={24} color={isActive('Habits') ? '#00bcd4' : '#fff'} />
                <Text style={[styles.navText, isActive('Habits') && styles.activeNavText]}>Habitudes</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.navItem, isActive('Tasks') && styles.activeNavItem]}
                onPress={() => navigation.navigate('Tasks')}
            >
                <Ionicons name="checkmark-done-outline" size={24} color={isActive('Tasks') ? '#00bcd4' : '#fff'} />
                <Text style={[styles.navText, isActive('Tasks') && styles.activeNavText]}>Tâches</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#1a1a1a',
        paddingVertical: 15,
    },
    navItem: {
        alignItems: 'center',
    },
    activeNavItem: {
        borderBottomWidth: 2,
        borderBottomColor: '#00bcd4',
    },
    navText: {
        color: '#fff',
        fontSize: 14,
        marginTop: 5,
    },
    activeNavText: {
        color: '#00bcd4',
        fontWeight: 'bold',
    },
});

export default BottomNav;

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from './pages/Home/HomePage';
import HabitsPage from './pages/Habit/HabitsPage';
import TasksPage from './pages/Task/TasksPage';
import LoginPage from './pages/Auth/LoginPage';
import SignupPage from './pages/Auth/SignupPage';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from './types/navigation.types';
import AddHabitPage from './pages/AddHabit/AddHabitPage';
import AddTaskPage from './pages/AddTask/AddTaskPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const FloatingButton = ({
    setModalVisible,
}: {
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
    <View style={styles.floatingButtonContainer}>
        <TouchableOpacity
            style={styles.addButton}
            onPress={(event) => {
                event.stopPropagation(); // Empêche la propagation de l'événement
                setModalVisible(true); // Ouvre simplement le modal
            }}
        >
            <Ionicons name="add" size={32} color="#fff" />
        </TouchableOpacity>
    </View>
);

const ModalWithNavigation = ({
    modalVisible,
    setModalVisible,
    navigation,
}: {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    navigation: NavigationProp<RootStackParamList>;
}) => (
    <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
                {/* Option pour Habitude */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={(event) => {
                        event.stopPropagation(); // Empêche la propagation
                        setModalVisible(false); // Ferme la modale
                        navigation.navigate('AddHabit'); // Navigation
                    }}
                >
                    <Ionicons name="trophy" size={24} color="#00bcd4" />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>Habitude</Text>
                        <Text style={styles.optionDescription}>
                            Une activité récurrente à réaliser (ex : Faire du sport chaque jour).
                        </Text>
                    </View>
                </TouchableOpacity>
                {/* Option pour Tâche */}
                <TouchableOpacity
                    style={styles.option}
                    onPress={(event) => {
                        event.stopPropagation(); // Empêche la propagation
                        setModalVisible(false); // Ferme la modale
                        navigation.navigate('AddTask'); // Navigation
                    }}
                >
                    <Ionicons name="checkmark" size={24} color="#00bcd4" />
                    <View style={styles.optionTextContainer}>
                        <Text style={styles.optionTitle}>Tâche</Text>
                        <Text style={styles.optionDescription}>
                            Une action unique avec une deadline (ex : Acheter du pain).
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
);

const Tabs = ({
    setModalVisible,
    navigation,
}: {
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    navigation: NavigationProp<RootStackParamList>;
}) => (
    <>
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'calendar-outline';

                    if (route.name === 'Home') {
                        iconName = focused ? 'calendar' : 'calendar-outline';
                    } else if (route.name === 'Habits') {
                        iconName = focused ? 'trophy' : 'trophy-outline';
                    } else if (route.name === 'Tasks') {
                        iconName = focused ? 'checkmark-done' : 'checkmark-done-outline';
                    }

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#00bcd4',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: styles.tabBarStyle,
                headerShown: false,
            })}
        >
            <Tab.Screen name="Home" component={HomePage} />
            <Tab.Screen name="Habits" component={HabitsPage} />
            <Tab.Screen name="Tasks" component={TasksPage} />
        </Tab.Navigator>
        <FloatingButton setModalVisible={setModalVisible} />
    </>
);

const App = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={LoginPage} />
                <Stack.Screen name="Signup" component={SignupPage} />
                <Stack.Screen
                    name="MainTabs"
                    component={({ navigation }: { navigation: NavigationProp<RootStackParamList> }) => (
                        <>
                            <Tabs setModalVisible={setModalVisible} navigation={navigation} />
                            <ModalWithNavigation
                                modalVisible={modalVisible}
                                setModalVisible={setModalVisible}
                                navigation={navigation}
                            />
                        </>
                    )}
                />
                <Stack.Screen name="AddHabit" component={AddHabitPage} />
                <Stack.Screen name="AddTask" component={AddTaskPage} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBarStyle: {
        backgroundColor: '#1a1a1a',
        borderTopWidth: 0,
        elevation: 0,
        shadowOpacity: 0,
        height: 60,
    },
    floatingButtonContainer: {
        position: 'absolute',
        bottom: 80,
        right: 20,
        zIndex: 10,
    },
    addButton: {
        backgroundColor: '#00bcd4',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
    },
    optionTextContainer: {
        marginLeft: 10,
        flex: 1,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    optionDescription: {
        fontSize: 14,
        color: '#666',
    },
});

export default App;

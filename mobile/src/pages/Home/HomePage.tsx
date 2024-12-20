import React, { useState } from 'react';
import { SafeAreaView, View, StyleSheet, StatusBar, Alert, Platform } from 'react-native';
import CalendarView from '../../components/Calendar/CalendarView';
import TaskList from '../../components/TaskList/TaskList';
import Header from '../../components/Header/Header';
import BottomNav from '../../components/Navigation/BottomNav';

const HomePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCalendarModalVisible, setIsCalendarModalVisible] = useState(false);

  const handleMenuPress = () => {
    Alert.alert('Menu', 'Ouvre le menu burger');
    // Ajoute ici la logique pour ouvrir un menu latéral
  };

  const handleAuthPress = () => {
    console.log('Navigate to Login/Signup screen');
    // Navigation logique pour login/signup
  };

  const handleOpenCalendar = () => {
    setIsCalendarModalVisible(true);
  };

  const handleCloseCalendar = () => {
    setIsCalendarModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        onMenuPress={handleMenuPress}
        showAuthButton={true}
        onAuthPress={handleAuthPress}
        selectedDate={selectedDate.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })}
        isToday={selectedDate.toDateString() === new Date().toDateString()}
        onOpenCalendar={handleOpenCalendar}
      />

      {/* Calendrier et contenu */}
      <View style={styles.calendarContainer}>
        <CalendarView
          selectedDate={selectedDate}
          onDateChange={(date) => {
            setSelectedDate(date);
            handleCloseCalendar(); // Ferme la modale après sélection
          }}
          isVisible={isCalendarModalVisible} // Passe la visibilité à CalendarView
        />
      </View>
      <View style={styles.content}>
        <TaskList date={selectedDate} />
      </View>
      <BottomNav />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0, // Ajoute un padding pour Android
  },
  calendarContainer: {
    marginTop: 10,
  },
  content: {
    flex: 1,
    padding: 10,
  },
});

export default HomePage;

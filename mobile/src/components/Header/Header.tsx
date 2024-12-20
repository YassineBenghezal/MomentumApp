import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

interface HeaderProps {
  onMenuPress?: () => void; // Ouvre le menu burger
  showAuthButton?: boolean; // Afficher ou non le bouton Auth
  onAuthPress?: () => void; // Action du bouton Auth
  selectedDate?: string; // Date affichée à côté du menu
  isToday?: boolean; // Indique si la date correspond à aujourd'hui
  onOpenCalendar?: () => void; // Ouvre la modale calendrier
  navigation?: StackNavigationProp<any>;
}

const Header: React.FC<HeaderProps> = ({
  onMenuPress,
  showAuthButton = false,
  onAuthPress,
  selectedDate,
  isToday = false,
  onOpenCalendar,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        {/* Menu Burger et Date */}
        <View style={styles.left}>
          <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
            <Ionicons name="menu-outline" size={24} color="#fff" />
          </TouchableOpacity>
          {selectedDate && <Text style={styles.dateText}>{isToday ? "Aujourd'hui" : selectedDate}</Text>}
        </View>

        {/* Icône Calendrier et Auth */}
        <View style={styles.right}>
          <TouchableOpacity onPress={onOpenCalendar} style={styles.calendarButton}>
            <Ionicons name="calendar-outline" size={24} color="#fff" />
          </TouchableOpacity>
          {showAuthButton && (
            <TouchableOpacity style={styles.authButton} onPress={onAuthPress}>
                <Ionicons name="person-outline" size={24} color="#fff" />
            </TouchableOpacity>
            )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) / 2 : 10,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 10,
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarButton: {
    marginRight: 15,
  },
  authButton: {},
});

export default Header;

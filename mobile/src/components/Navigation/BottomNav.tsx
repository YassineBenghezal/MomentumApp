import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const BottomNav = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="today-outline" size={24} color="#fff" />
        <Text style={styles.navText}>Aujourd'hui</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="leaf-outline" size={24} color="#fff" />
        <Text style={styles.navText}>Habitudes</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="checkmark-done-outline" size={24} color="#fff" />
        <Text style={styles.navText}>Tâches</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="folder-outline" size={24} color="#fff" />
        <Text style={styles.navText}>Catégories</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Ionicons name="document-text-outline" size={24} color="#fff" />
        <Text style={styles.navText}>Notes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a', // Couleur sombre
    paddingVertical: 15, // Plus d'espace vertical
  },
  navItem: {
    alignItems: 'center',
  },
  navText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 5, // Espace entre l'icône et le texte
  },
});

export default BottomNav;
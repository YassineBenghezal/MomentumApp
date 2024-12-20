import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const MenuDropdown = () => {
  return (
    <TouchableOpacity style={styles.menu}>
      <Ionicons name="menu" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menu: {
    position: 'absolute',
    left: 10,
    top: 10,
  },
});

export default MenuDropdown;

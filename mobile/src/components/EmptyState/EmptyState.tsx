import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const EmptyState = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/icons/calendar.png')} style={styles.icon} />
      <Text style={styles.title}>Aucune activité programmée</Text>
      <Text style={styles.subtitle}>Ajouter de nouvelles activités</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 80,
    height: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
  },
});

export default EmptyState;

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { signup } from '../../api/auth.service';

import { NavigationProp } from '@react-navigation/native';

interface SignupPageProps {
  navigation: NavigationProp<any>;
}

const SignupPage: React.FC<SignupPageProps> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      await signup(username, password);
      Alert.alert('Succès', 'Compte créé avec succès !');
      navigation.navigate('Login'); // Redirection vers la page de connexion
    } catch (error) {
      Alert.alert('Erreur', (error as Error).message || 'Échec de l’inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Inscription...' : "S'inscrire"}</Text>
      </TouchableOpacity>
      <Text style={styles.footerText}>
        Déjà un compte ?{' '}
        <Text style={styles.link} onPress={() => navigation.navigate('Login')}>
          Se connecter
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#00aaff',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    marginTop: 20,
    color: '#fff',
  },
  link: {
    color: '#00aaff',
    textDecorationLine: 'underline',
  },
});

export default SignupPage;

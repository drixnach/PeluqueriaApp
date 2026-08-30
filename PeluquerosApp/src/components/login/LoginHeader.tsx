import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function LoginHeader() {
  return (
    <View>
      <Text style={styles.title}>Bienvenido!</Text>
      <Text style={styles.subtitle}>Ingresa para ver tu agenda.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
});
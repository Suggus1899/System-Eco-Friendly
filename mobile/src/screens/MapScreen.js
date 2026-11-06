import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mapa de Centros de Reciclaje</Text>
      <Text style={styles.content}>Aquí se mostrará el mapa con centros cercanos</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50'
  },
  content: {
    fontSize: 16,
    color: '#7f8c8d'
  }
});

export default MapScreen;
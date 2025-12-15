import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.placeholder}>
        <Text style={styles.icon}>🗺️</Text>
        <Text style={styles.title}>Mapa de Centros de Reciclaje</Text>
        <Text style={styles.subtitle}>
          Aquí se mostrará un mapa interactivo con los centros de reciclaje cercanos
        </Text>
        <Text style={styles.text}>
          Integración con React Native Maps y OpenStreetMap
        </Text>
      </View>

      <View style={styles.centersList}>
        <Text style={styles.listTitle}>Centros Cercanos:</Text>
        <CenterItem name="La Recuperadora Guárico 2016 C.A." distance="2.5 km" />
        <CenterItem name="Centro de Reciclaje Norte" distance="3.8 km" />
        <CenterItem name="Punto Verde Sur" distance="5.2 km" />
      </View>
    </View>
  );
}

function CenterItem({ name, distance }) {
  return (
    <View style={styles.centerItem}>
      <Text style={styles.centerIcon}>📍</Text>
      <View style={styles.centerInfo}>
        <Text style={styles.centerName}>{name}</Text>
        <Text style={styles.centerDistance}>{distance}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  placeholder: {
    backgroundColor: '#e8f5e9',
    padding: 30,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
    textAlign: 'center',
  },
  text: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
  },
  centersList: {
    padding: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  centerItem: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  centerInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  centerDistance: {
    fontSize: 14,
    color: '#2ecc71',
  },
});

export default MapScreen;

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌱 EcoGestión Local</Text>
        <Text style={styles.subtitle}>Tu guía de reciclaje</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📦 Guía de Separación</Text>
        <View style={styles.categoryList}>
          <CategoryItem icon="🔵" name="Plástico" />
          <CategoryItem icon="🟢" name="Vidrio" />
          <CategoryItem icon="🟡" name="Papel" />
          <CategoryItem icon="🟤" name="Orgánico" />
          <CategoryItem icon="⚡" name="Electrónicos" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>📅 Próxima Recolección</Text>
        <Text style={styles.text}>Lunes, 8:00 AM - Plásticos</Text>
        <Text style={styles.text}>Miércoles, 7:00 AM - Orgánicos</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>🏆 Tus Puntos</Text>
        <Text style={styles.points}>150 puntos</Text>
        <Text style={styles.text}>¡Sigue reciclando para ganar más!</Text>
      </View>
    </ScrollView>
  );
}

function CategoryItem({ icon, name }) {
  return (
    <View style={styles.categoryItem}>
      <Text style={styles.categoryIcon}>{icon}</Text>
      <Text style={styles.categoryName}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2ecc71',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
  card: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  text: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 12,
    color: '#2c3e50',
  },
  points: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2ecc71',
    textAlign: 'center',
    marginVertical: 10,
  },
});

export default HomeScreen;

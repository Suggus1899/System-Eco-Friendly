import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

function ChallengesScreen() {
  const challenges = [
    { 
      id: 1, 
      title: 'Semana del Reciclaje', 
      description: 'Recicla al menos 5 items diferentes esta semana',
      points: 50,
      difficulty: 'Fácil',
      completed: false
    },
    { 
      id: 2, 
      title: 'Maestro del Compostaje', 
      description: 'Crea tu propio compost con residuos orgánicos',
      points: 100,
      difficulty: 'Medio',
      completed: false
    },
    { 
      id: 3, 
      title: 'Cero Plástico', 
      description: 'Pasa una semana sin usar plásticos de un solo uso',
      points: 150,
      difficulty: 'Difícil',
      completed: false
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Retos Semanales</Text>
        <Text style={styles.headerSubtitle}>Completa retos y gana puntos</Text>
      </View>

      {challenges.map((challenge) => (
        <View key={challenge.id} style={styles.challengeCard}>
          <View style={styles.challengeHeader}>
            <Text style={styles.challengeTitle}>{challenge.title}</Text>
            <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(challenge.difficulty) }]}>
              <Text style={styles.difficultyText}>{challenge.difficulty}</Text>
            </View>
          </View>
          
          <Text style={styles.challengeDescription}>{challenge.description}</Text>
          
          <View style={styles.challengeFooter}>
            <View style={styles.pointsContainer}>
              <Text style={styles.pointsLabel}>Recompensa:</Text>
              <Text style={styles.pointsValue}>🏆 {challenge.points} puntos</Text>
            </View>
            
            <TouchableOpacity style={styles.completeButton}>
              <Text style={styles.completeButtonText}>Completar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={styles.badgesSection}>
        <Text style={styles.sectionTitle}>🎖️ Tus Insignias</Text>
        <View style={styles.badgesGrid}>
          <BadgeItem name="Principiante Verde" earned={true} />
          <BadgeItem name="Reciclador Activo" earned={false} />
          <BadgeItem name="Eco Guerrero" earned={false} />
        </View>
      </View>
    </ScrollView>
  );
}

function BadgeItem({ name, earned }) {
  return (
    <View style={[styles.badgeItem, !earned && styles.badgeItemLocked]}>
      <Text style={styles.badgeIcon}>{earned ? '🎖️' : '🔒'}</Text>
      <Text style={styles.badgeName}>{name}</Text>
    </View>
  );
}

function getDifficultyColor(difficulty) {
  const colors = {
    'Fácil': '#2ecc71',
    'Medio': '#f39c12',
    'Difícil': '#e74c3c',
  };
  return colors[difficulty] || '#95a5a6';
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 5,
  },
  challengeCard: {
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
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  difficultyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  challengeDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
  },
  challengeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointsContainer: {
    flex: 1,
  },
  pointsLabel: {
    fontSize: 12,
    color: '#95a5a6',
  },
  pointsValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc71',
  },
  completeButton: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  completeButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  badgesSection: {
    margin: 10,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  badgeItem: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    minWidth: 100,
  },
  badgeItemLocked: {
    backgroundColor: '#ecf0f1',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  badgeName: {
    fontSize: 12,
    color: '#2c3e50',
    textAlign: 'center',
  },
});

export default ChallengesScreen;

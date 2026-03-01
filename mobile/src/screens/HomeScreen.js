import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useAtom, useSetAtom } from 'jotai';
import { usersService } from '../services/api';
import { userAtom, userProgressAtom, userLoadingAtom } from '../store/atoms';

function HomeScreen({ navigation }) {
  const [user, setUser] = useAtom(userAtom);
  const [progress, setProgress] = useAtom(userProgressAtom);
  const [loading, setLoading] = useAtom(userLoadingAtom);

  useEffect(() => {
    loadUserData();
  }, []);

  const navigateToMaterials = React.useCallback(() => navigation.navigate('Materials'), [navigation]);
  const navigateToMap = React.useCallback(() => navigation.navigate('Map'), [navigation]);
  const navigateToSchedule = React.useCallback(() => navigation.navigate('Schedule'), [navigation]);
  const navigateToChallenges = React.useCallback(() => navigation.navigate('Challenges'), [navigation]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [profileRes, progressRes] = await Promise.all([
        usersService.getProfile(),
        usersService.getProgress()
      ]);
      setUser(profileRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>¡Hola, {user?.name || 'Usuario'}!</Text>
        <Text style={styles.headerSubtitle}>Puntos: {progress?.points || 0} 🌟</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#3498db' }]}
          onPress={navigateToMaterials}
        >
          <Text style={styles.actionIcon}>♻️</Text>
          <Text style={styles.actionText}>Guía de Separación</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#27ae60' }]}
          onPress={navigateToMap}
        >
          <Text style={styles.actionIcon}>📍</Text>
          <Text style={styles.actionText}>Centros de Reciclaje</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#e74c3c' }]}
          onPress={navigateToSchedule}
        >
          <Text style={styles.actionIcon}>📅</Text>
          <Text style={styles.actionText}>Mi Calendario</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#f39c12' }]}
          onPress={navigateToChallenges}
        >
          <Text style={styles.actionIcon}>🎯</Text>
          <Text style={styles.actionText}>Retos Semanales</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tu Progreso</Text>
        <View style={styles.progressCard}>
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>{progress?.points || 0}</Text>
            <Text style={styles.progressLabel}>Puntos</Text>
          </View>
          <View style={styles.progressItem}>
            <Text style={styles.progressValue}>{progress?.completed_challenges || 0}</Text>
            <Text style={styles.progressLabel}>Retos Completados</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Consejos del Día 💡</Text>
        <View style={styles.tipCard}>
          <Text style={styles.tipText}>
            Recuerda enjuagar los envases antes de reciclarlos. 
            Esto ayuda a mantener la calidad del material reciclado.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 20,
    paddingTop: 40
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ecf0f1'
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 10
  },
  actionCard: {
    width: '48%',
    margin: '1%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 10
  },
  actionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  section: {
    padding: 15,
    marginTop: 10
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2c3e50'
  },
  progressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    elevation: 2
  },
  progressItem: {
    alignItems: 'center'
  },
  progressValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3498db'
  },
  progressLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5
  },
  tipCard: {
    backgroundColor: '#fff3cd',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12'
  },
  tipText: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20
  }
});

export default HomeScreen;

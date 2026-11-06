import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';

function MaterialsScreen() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const materials = [
    { id: 1, name: 'Botellas de Plástico PET', category: 'Plástico', icon: '🔵' },
    { id: 2, name: 'Vidrio', category: 'Vidrio', icon: '🟢' },
    { id: 3, name: 'Papel y Cartón', category: 'Papel', icon: '🟡' },
    { id: 4, name: 'Residuos Orgánicos', category: 'Orgánico', icon: '🟤' },
    { id: 5, name: 'Baterías', category: 'Electrónicos', icon: '⚡' },
    { id: 6, name: 'Latas de Aluminio', category: 'Metal', icon: '⚪' },
  ];

  const filteredMaterials = materials.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar material..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView style={styles.list}>
        {filteredMaterials.map((material) => (
          <View key={material.id} style={styles.materialCard}>
            <Text style={styles.materialIcon}>{material.icon}</Text>
            <View style={styles.materialInfo}>
              <Text style={styles.materialName}>{material.name}</Text>
              <Text style={styles.materialCategory}>{material.category}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#ecf0f1',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  list: {
    flex: 1,
    padding: 10,
  },
  materialCard: {
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
  materialIcon: {
    fontSize: 40,
    marginRight: 15,
  },
  materialInfo: {
    flex: 1,
  },
  materialName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  materialCategory: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});

export default MaterialsScreen;

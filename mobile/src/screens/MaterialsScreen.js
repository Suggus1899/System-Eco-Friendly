import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { materialsService, offlineStorage } from '../services/api';
import { 
  materialsAtom, 
  filteredMaterialsAtom, 
  searchQueryAtom, 
  selectedCategoryAtom, 
  materialsLoadingAtom,
  categoriesAtom
} from '../store/atoms';

function MaterialsScreen() {
  const [materials] = useAtom(materialsAtom);
  const filteredMaterials = useAtomValue(filteredMaterialsAtom);
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const [loading, setLoading] = useAtom(materialsLoadingAtom);
  const categories = useAtomValue(categoriesAtom);

  // Create a category lookup map for better performance
  const categoryMap = React.useMemo(() => {
    return categories.reduce((map, cat) => {
      map[cat.key] = cat;
      return map;
    }, {});
  }, [categories]);

  useEffect(() => {
    loadMaterials();
  }, []);

  const setMaterials = useSetAtom(materialsAtom);

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const response = await materialsService.getAll();
      setMaterials(response.data);
      await offlineStorage.saveMaterials(response.data);
    } catch (error) {
      console.error('Error loading materials:', error);
      // Load from offline storage
      const offlineMaterials = await offlineStorage.getMaterials();
      setMaterials(offlineMaterials);
    } finally {
      setLoading(false);
    }
  };

  const renderMaterial = React.useCallback(({ item }) => (
    <View style={styles.materialCard}>
      <View style={styles.materialHeader}>
        <Text style={styles.materialName}>{item.name}</Text>
        {item.recyclable && <Text style={styles.recyclableBadge}>♻️ Reciclable</Text>}
      </View>
      <Text style={styles.materialCategory}>{categoryMap[item.category]?.label || item.category}</Text>
      {item.description && (
        <Text style={styles.materialDescription}>{item.description}</Text>
      )}
      {item.disposal_instructions && (
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>📋 Instrucciones:</Text>
          <Text style={styles.instructionsText}>{item.disposal_instructions}</Text>
        </View>
      )}
    </View>
  ), [categoryMap]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar materiales..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlashList
          horizontal
          data={categories}
          keyExtractor={item => item.key}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === item.key && styles.categoryChipActive
              ]}
              onPress={() => setSelectedCategory(item.key)}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === item.key && styles.categoryLabelActive
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          estimatedItemSize={120}
        />
      </View>

      <FlashList
        data={filteredMaterials}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMaterial}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron materiales</Text>
        }
        estimatedItemSize={150}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  searchContainer: {
    padding: 15,
    backgroundColor: 'white'
  },
  searchInput: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    fontSize: 16
  },
  categoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10
  },
  categoryChipActive: {
    backgroundColor: '#3498db'
  },
  categoryIcon: {
    fontSize: 18,
    marginRight: 5
  },
  categoryLabel: {
    fontSize: 14,
    color: '#2c3e50'
  },
  categoryLabelActive: {
    color: 'white',
    fontWeight: 'bold'
  },
  listContainer: {
    padding: 15
  },
  materialCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2
  },
  materialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  materialName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1
  },
  recyclableBadge: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: 'bold'
  },
  materialCategory: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8
  },
  materialDescription: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 10,
    lineHeight: 20
  },
  instructionsBox: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginTop: 5
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5
  },
  instructionsText: {
    fontSize: 13,
    color: '#2c3e50',
    lineHeight: 18
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 50
  }
});

export default MaterialsScreen;

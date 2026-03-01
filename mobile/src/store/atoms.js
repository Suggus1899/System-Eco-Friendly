import { atom } from 'jotai';

// User-related atoms
export const userAtom = atom(null);
export const userProgressAtom = atom(null);

// Materials-related atoms
export const materialsAtom = atom([]);
export const filteredMaterialsAtom = atom((get) => {
  const materials = get(materialsAtom);
  const searchQuery = get(searchQueryAtom);
  const selectedCategory = get(selectedCategoryAtom);

  let filtered = materials;

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(m => m.category === selectedCategory);
  }

  if (searchQuery) {
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return filtered;
});

export const searchQueryAtom = atom('');
export const selectedCategoryAtom = atom('all');

// Loading states
export const materialsLoadingAtom = atom(false);
export const userLoadingAtom = atom(false);

// Categories
export const categoriesAtom = atom([
  { key: 'all', label: 'Todos', icon: '📦' },
  { key: 'organico', label: 'Orgánico', icon: '🥬' },
  { key: 'plastico', label: 'Plástico', icon: '♻️' },
  { key: 'vidrio', label: 'Vidrio', icon: '🫙' },
  { key: 'papel', label: 'Papel', icon: '📄' },
  { key: 'electronico', label: 'Electrónico', icon: '🔌' }
]);
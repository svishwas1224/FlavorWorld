import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const CUISINES = [
  'Italian', 'Indian', 'Mexican', 'Japanese', 'Chinese',
  'French', 'Thai', 'Greek', 'Moroccan', 'American',
  'British', 'Canadian', 'Croatian', 'Dutch', 'Egyptian',
  'Filipino', 'Jamaican', 'Malaysian', 'Polish',
  'Portuguese', 'Russian', 'Spanish', 'Turkish',
  'Vietnamese', 'Unknown', 'North Indian', 'South Indian'
]

const CATEGORIES = [
  'Breakfast', 'Lunch', 'Dinner', 'Dessert',
  'Starter', 'Side', 'Snack', 'Vegan', 'Vegetarian'
]

const DIETARY_FILTERS = [
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'glutenFree', label: 'Gluten-Free' },
  { id: 'highProtein', label: 'High-Protein' }
]

export const useFilterStore = create(
  persist(
    (set, get) => ({
      // Sidebar state
      isSidebarOpen: true,
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),

      // Filter states
      selectedCuisines: [],
      selectedCategories: [],
      selectedDietary: [],
      searchQuery: '',

      // Actions
      toggleCuisine: (cuisine) => set((state) => ({
        selectedCuisines: state.selectedCuisines.includes(cuisine)
          ? state.selectedCuisines.filter(c => c !== cuisine)
          : [...state.selectedCuisines, cuisine]
      })),

      toggleCategory: (category) => set((state) => ({
        selectedCategories: state.selectedCategories.includes(category)
          ? state.selectedCategories.filter(c => c !== category)
          : [...state.selectedCategories, category]
      })),

      toggleDietary: (dietaryId) => set((state) => ({
        selectedDietary: state.selectedDietary.includes(dietaryId)
          ? state.selectedDietary.filter(d => d !== dietaryId)
          : [...state.selectedDietary, dietaryId]
      })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      clearFilters: () => set({
        selectedCuisines: [],
        selectedCategories: [],
        selectedDietary: [],
        searchQuery: ''
      }),

      // Get active filters count
      getActiveFiltersCount: () => {
        const state = get()
        return state.selectedCuisines.length + 
               state.selectedCategories.length + 
               state.selectedDietary.length + 
               (state.searchQuery ? 1 : 0)
      },

      // Check if any filters are active
      hasActiveFilters: () => {
        const state = get()
        return state.selectedCuisines.length > 0 ||
               state.selectedCategories.length > 0 ||
               state.selectedDietary.length > 0 ||
               state.searchQuery.length > 0
      }
    }),
    {
      name: 'filter-storage',
    }
  )
)

// Export constants for use in components
export { CUISINES, CATEGORIES, DIETARY_FILTERS }

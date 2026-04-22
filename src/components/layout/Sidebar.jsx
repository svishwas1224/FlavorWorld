import { useState } from 'react'
import { ChevronDown, ChevronRight, X, Filter, Globe, ChefHat, Heart, ShoppingCart } from 'lucide-react'
import { useFilterStore, CUISINES, CATEGORIES, DIETARY_FILTERS } from '../../store/useFilterStore'
import { usePlannerStore } from '../../store/usePlannerStore'

const Sidebar = () => {
  const {
    isSidebarOpen,
    selectedCuisines,
    selectedCategories,
    selectedDietary,
    toggleCuisine,
    toggleCategory,
    toggleDietary,
    clearFilters,
    getActiveFiltersCount
  } = useFilterStore()

  const { savedRecipes } = usePlannerStore()
  const [expandedSections, setExpandedSections] = useState({
    cuisines: true,
    categories: true,
    dietary: true,
    saved: true
  })

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  if (!isSidebarOpen) return null

  return (
    <div className="w-80 bg-surface border-r border-border h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold">Filters</h2>
          {getActiveFiltersCount() > 0 && (
            <button
              onClick={clearFilters}
              className="text-sm text-accent hover:text-accent-muted transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* World Cuisines */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('cuisines')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-accent transition-colors"
          >
            {expandedSections.cuisines ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Globe size={16} />
            <span className="font-medium">World Cuisines</span>
          </button>
          
          {expandedSections.cuisines && (
            <div className="space-y-2 ml-8 max-h-48 overflow-y-auto">
              {CUISINES.map(cuisine => (
                <label key={cuisine} className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCuisines.includes(cuisine)}
                    onChange={() => toggleCuisine(cuisine)}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm">{cuisine}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Meal Categories */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-accent transition-colors"
          >
            {expandedSections.categories ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <ChefHat size={16} />
            <span className="font-medium">Meal Categories</span>
          </button>
          
          {expandedSections.categories && (
            <div className="space-y-2 ml-8">
              {CATEGORIES.map(category => (
                <label key={category} className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm">{category}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Dietary Filters */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('dietary')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-accent transition-colors"
          >
            {expandedSections.dietary ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Filter size={16} />
            <span className="font-medium">Dietary Filters</span>
          </button>
          
          {expandedSections.dietary && (
            <div className="space-y-2 ml-8">
              {DIETARY_FILTERS.map(filter => (
                <label key={filter.id} className="flex items-center gap-2 cursor-pointer hover:text-accent transition-colors">
                  <input
                    type="checkbox"
                    checked={selectedDietary.includes(filter.id)}
                    onChange={() => toggleDietary(filter.id)}
                    className="rounded border-border text-accent focus:ring-accent"
                  />
                  <span className="text-sm">{filter.label}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Saved Recipes */}
        <div className="mb-6">
          <button
            onClick={() => toggleSection('saved')}
            className="flex items-center gap-2 w-full text-left mb-3 hover:text-accent transition-colors"
          >
            {expandedSections.saved ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <Heart size={16} />
            <span className="font-medium">Saved Recipes ({savedRecipes.length})</span>
          </button>
          
          {expandedSections.saved && (
            <div className="space-y-2 ml-8">
              {savedRecipes.length === 0 ? (
                <p className="text-sm text-text-muted">No saved recipes yet</p>
              ) : (
                savedRecipes.slice(0, 5).map(recipe => (
                  <div key={recipe.id} className="text-sm text-text-muted hover:text-text transition-colors">
                    {recipe.strMeal}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar

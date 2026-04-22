import RecipeCard from './RecipeCard'

const RecipeGrid = ({ meals, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton-card" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted mb-4">Error loading recipes. Please try again.</p>
        <button className="btn-primary">Retry</button>
      </div>
    )
  }

  if (!meals || meals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl">No recipes found</span>
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">No recipes found</h3>
        <p className="text-text-muted mb-6">
          Try adjusting your filters or search for something different
        </p>
        <div className="space-y-2 text-sm text-text-muted">
          <p>Try searching for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {['pasta', 'pizza', 'salad', 'soup', 'chicken'].map(term => (
              <span key={term} className="bg-gray-100 px-3 py-1 rounded-full">
                {term}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {meals.map((meal, index) => (
        <RecipeCard key={meal.id} meal={meal} index={index} />
      ))}
    </div>
  )
}

export default RecipeGrid

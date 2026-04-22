import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart, Clock, Users, Plus } from 'lucide-react'
import { usePlannerStore } from '../../store/usePlannerStore'

const RecipeCard = ({ meal, index = 0, showSaveButton = true, showAddToPlan = true }) => {
  const { saveRecipe, savedRecipes } = usePlannerStore()
  const isSaved = savedRecipes.some(r => r.id === meal.id)

  const handleSave = (e) => {
    e.preventDefault()
    saveRecipe(meal)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -4, shadow: '0 10px 30px rgba(0,0,0,0.15)' }}
      className="card hover-lift"
    >
      <Link to={`/recipe/${meal.id}`}>
        <div className="relative group">
          {/* Recipe Image */}
          <div className="aspect-video overflow-hidden bg-gray-100">
            {meal.strMealThumb ? (
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-2">
            {showSaveButton && (
              <button
                onClick={handleSave}
                className={`p-2 rounded-full transition-colors ${
                  isSaved 
                    ? 'bg-accent text-white' 
                    : 'bg-white/90 backdrop-blur text-gray-700 hover:bg-white'
                }`}
              >
                <Heart size={16} fill={isSaved ? 'currentColor' : 'none'} />
              </button>
            )}
            {showAddToPlan && (
              <button className="p-2 rounded-full bg-white/90 backdrop-blur text-gray-700 hover:bg-white transition-colors">
                <Plus size={16} />
              </button>
            )}
          </div>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-medium">View Recipe</span>
          </div>
        </div>

        {/* Recipe Info */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg mb-2 line-clamp-2">
            {meal.strMeal}
          </h3>
          
          <div className="flex items-center gap-4 text-sm text-text-muted mb-3">
            {meal.strArea && (
              <span className="bg-accent/10 text-accent px-2 py-1 rounded-full text-xs font-medium">
                {meal.strArea}
              </span>
            )}
            {meal.strCategory && (
              <span className="bg-gray-100 px-2 py-1 rounded-full text-xs">
                {meal.strCategory}
              </span>
            )}
          </div>

          {/* Quick stats */}
          <div className="flex items-center gap-4 text-sm text-text-muted">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>30 min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} />
              <span>4 servings</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default RecipeCard

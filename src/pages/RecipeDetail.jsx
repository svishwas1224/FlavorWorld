import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Heart, Clock, Users, Share2, Plus, Check } from 'lucide-react'
import { mealdbAPI } from '../api/mealdb'
import { youtubeAPI } from '../api/youtube'
import { usePlannerStore } from '../store/usePlannerStore'

const RecipeDetail = () => {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [youtubeVideos, setYoutubeVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [servings, setServings] = useState(4)
  const [checkedIngredients, setCheckedIngredients] = useState([])

  const { saveRecipe, savedRecipes, addToRecentlyViewed } = usePlannerStore()
  const isSaved = savedRecipes.some(r => r.id === recipe?.id)

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setLoading(true)
        const recipeData = await mealdbAPI.lookupById(id)
        
        if (recipeData) {
          setRecipe(recipeData)
          addToRecentlyViewed(recipeData)
          
          // Load YouTube videos
          const videos = await youtubeAPI.searchRecipeVideos(recipeData.strMeal)
          setYoutubeVideos(videos.videos || [])
        }
      } catch (error) {
        console.error('Error loading recipe:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadRecipe()
    }
  }, [id, addToRecentlyViewed])

  const handleSave = () => {
    if (recipe) {
      saveRecipe(recipe)
    }
  }

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const copyIngredients = () => {
    const ingredients = mealdbAPI.parseIngredients(recipe)
    const text = ingredients
      .filter((_, index) => !checkedIngredients.includes(index))
      .map(ing => `${ing.measure} ${ing.name}`)
      .join('\n')
    
    navigator.clipboard.writeText(text)
  }

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-xl mb-6"></div>
        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2 w-1/2"></div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">Recipe not found</p>
        <Link to="/" className="btn-primary mt-4">Back to Home</Link>
      </div>
    )
  }

  const ingredients = mealdbAPI.parseIngredients(recipe)
  const instructions = mealdbAPI.parseInstructions(recipe.strInstructions)

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-text mb-4">
          <ArrowLeft size={20} />
          Back
        </Link>

        {/* Hero Image */}
        <div className="relative h-64 md:h-96 rounded-xl overflow-hidden mb-6">
          {recipe.strMealThumb && (
            <img
              src={recipe.strMealThumb}
              alt={recipe.strMeal}
              className="w-full h-full object-cover"
            />
          )}
        </div>

        {/* Recipe Info */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-4xl font-bold mb-2">{recipe.strMeal}</h1>
            <div className="flex items-center gap-4 text-text-muted">
              {recipe.strArea && (
                <span className="bg-accent/10 text-accent px-3 py-1 rounded-full text-sm font-medium">
                  {recipe.strArea}
                </span>
              )}
              {recipe.strCategory && (
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {recipe.strCategory}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className={`p-3 rounded-lg transition-colors ${
                isSaved 
                  ? 'bg-accent text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Heart size={20} fill={isSaved ? 'currentColor' : 'none'} />
            </button>
            <button className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              <Share2 size={20} />
            </button>
            <button className="p-3 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* Info Strip */}
        <div className="flex items-center gap-6 text-sm text-text-muted border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>30 min</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <select 
              value={servings} 
              onChange={(e) => setServings(parseInt(e.target.value))}
              className="border border-border rounded px-2 py-1"
            >
              {[1, 2, 4, 6, 8].map(num => (
                <option key={num} value={num}>{num} servings</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span>~350 kcal per serving</span>
          </div>
        </div>
      </motion.div>

      {/* Ingredients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-bold">Ingredients</h2>
          <button
            onClick={copyIngredients}
            className="text-accent hover:text-accent-muted text-sm"
          >
            Copy Ingredients
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                checkedIngredients.includes(index)
                  ? 'bg-gray-50 border-gray-300 line-through text-text-muted'
                  : 'bg-surface border-border hover:bg-gray-50'
              }`}
              onClick={() => toggleIngredient(index)}
            >
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                checkedIngredients.includes(index)
                  ? 'bg-accent border-accent'
                  : 'border-border'
              }`}>
                {checkedIngredients.includes(index) && <Check size={12} className="text-white" />}
              </div>
              {ingredient.image && (
                <img
                  src={ingredient.image}
                  alt={ingredient.name}
                  className="w-8 h-8 object-cover rounded"
                />
              )}
              <div>
                <span className="font-medium">{ingredient.measure}</span>
                <span className="ml-2">{ingredient.name}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="font-display text-2xl font-bold mb-4">Instructions</h2>
        <div className="space-y-4">
          {instructions.map((instruction, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 bg-surface border-l-4 border-accent rounded-r-lg"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center font-medium">
                {index + 1}
              </div>
              <p className="text-gray-700">{instruction}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* YouTube Videos */}
      {youtubeVideos.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="font-display text-2xl font-bold mb-4">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {youtubeVideos.map((video) => (
              <a
                key={video.videoId}
                href={youtubeAPI.getVideoUrl(video.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="card hover-lift cursor-pointer"
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-32 object-cover"
                />
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2 mb-1">{video.title}</h3>
                  <p className="text-xs text-text-muted">{video.channel}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default RecipeDetail

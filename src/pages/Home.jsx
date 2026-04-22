import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Shuffle, TrendingUp } from 'lucide-react'
import SearchBar from '../components/search/SearchBar'
import RecipeGrid from '../components/recipe/RecipeGrid'
import { mealdbAPI } from '../api/mealdb'
import { usePlannerStore } from '../store/usePlannerStore'

const Home = () => {
  const [trendingMeals, setTrendingMeals] = useState([])
  const [featuredCuisines, setFeaturedCuisines] = useState([])
  const [loading, setLoading] = useState(true)
  const { recentlyViewed } = usePlannerStore()

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Load trending meals (random selection)
        const trending = await Promise.all(
          Array.from({ length: 6 }, async () => {
            const meal = await mealdbAPI.getRandomMeal()
            return meal
          })
        )
        setTrendingMeals(trending.filter(Boolean))

        // Load featured cuisines
        const cuisines = ['Italian', 'Indian', 'Mexican', 'Japanese', 'Chinese', 'Thai']
        const cuisineData = await Promise.all(
          cuisines.map(async (cuisine) => {
            const meals = await mealdbAPI.filterByArea(cuisine)
            return { name: cuisine, meals: meals.slice(0, 3) }
          })
        )
        setFeaturedCuisines(cuisineData)
      } catch (error) {
        console.error('Error loading home data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHomeData()
  }, [])

  const handleSurpriseMe = async () => {
    try {
      const randomMeal = await mealdbAPI.getRandomMeal()
      if (randomMeal) {
        window.location.href = `/recipe/${randomMeal.id}`
      }
    } catch (error) {
      console.error('Error getting random meal:', error)
    }
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-display text-5xl md:text-6xl font-bold mb-6 italic">
            What are you craving today?
          </h1>
          <p className="text-xl text-text-muted mb-8 max-w-2xl mx-auto">
            Discover delicious recipes from around the world. Search by cuisine, ingredient, or meal type.
          </p>
          
          <div className="mb-8">
            <SearchBar />
          </div>

          <button
            onClick={handleSurpriseMe}
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Shuffle size={20} />
            Surprise Me
          </button>
        </motion.div>
      </section>

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section>
          <h2 className="font-display text-2xl font-bold mb-6">Recently Viewed</h2>
          <div className="flex gap-4 overflow-x-auto pb-4">
            {recentlyViewed.map((recipe) => (
              <div key={recipe.id} className="flex-shrink-0 w-48">
                <div className="card overflow-hidden">
                  {recipe.strMealThumb && (
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="w-full h-32 object-cover"
                    />
                  )}
                  <div className="p-3">
                    <h3 className="font-medium text-sm line-clamp-2">{recipe.strMeal}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Featured Cuisines */}
      <section>
        <h2 className="font-display text-2xl font-bold mb-6">Featured Cuisines</h2>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {featuredCuisines.map((cuisine) => (
            <div key={cuisine.name} className="flex-shrink-0">
              <div className="text-center">
                <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                  <span className="text-2xl">cuisine.name.charAt(0)</span>
                </div>
                <p className="text-sm font-medium">{cuisine.name}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Today */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-2xl font-bold flex items-center gap-2">
            <TrendingUp size={24} />
            Trending Today
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="text-accent hover:text-accent-muted transition-colors"
          >
            Refresh
          </button>
        </div>
        
        <RecipeGrid meals={trendingMeals} loading={loading} />
      </section>
    </div>
  )
}

export default Home

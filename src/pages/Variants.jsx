import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import RecipeGrid from '../components/recipe/RecipeGrid'
import { mealdbAPI } from '../api/mealdb'

const Variants = () => {
  const { mealName } = useParams()
  const [variants, setVariants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadVariants = async () => {
      try {
        setLoading(true)
        // Search for the meal name
        const results = await mealdbAPI.searchByName(mealName)
        
        if (results && results.length > 0) {
          setVariants(results)
        } else {
          // Try to get more results by searching in different ways
          const additionalResults = []
          
          // Try by category if it's a common category
          const commonCategories = ['Pasta', 'Pizza', 'Salad', 'Soup', 'Chicken', 'Beef', 'Dessert']
          if (commonCategories.includes(mealName)) {
            const categoryResults = await mealdbAPI.filterByCategory(mealName)
            additionalResults.push(...categoryResults)
          }
          
          setVariants(additionalResults)
        }
      } catch (err) {
        setError('Failed to load variants')
        console.error('Error loading variants:', err)
      } finally {
        setLoading(false)
      }
    }

    if (mealName) {
      loadVariants()
    }
  }, [mealName])

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <Link to="/" className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="font-display text-3xl font-bold capitalize">
            {mealName} Variants
          </h1>
          <p className="text-text-muted">
            {variants.length} {variants.length === 1 ? 'variant' : 'variants'} found
          </p>
        </div>
      </motion.div>

      {/* Results */}
      <RecipeGrid meals={variants} loading={loading} error={error} />
    </div>
  )
}

export default Variants

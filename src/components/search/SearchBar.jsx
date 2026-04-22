import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useFilterStore } from '../../store/useFilterStore'
import { mealdbAPI } from '../../api/mealdb'

const SearchBar = ({ placeholder = "Search for recipes...", showSuggestions = true }) => {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestionsDropdown, setShowSuggestionsDropdown] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const navigate = useNavigate()
  const { setSearchQuery, searchQuery } = useFilterStore()

  useEffect(() => {
    const delayedSearch = setTimeout(async () => {
      if (query.trim().length > 0) {
        setLoading(true)
        try {
          const results = await mealdbAPI.searchByName(query.trim())
          setSuggestions(results.slice(0, 5))
        } catch (error) {
          console.error('Search error:', error)
          setSuggestions([])
        }
        setLoading(false)
      } else {
        setSuggestions([])
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [query])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchQuery(query.trim())
      setShowSuggestionsDropdown(false)
      // Navigate based on whether it's a broad search or specific
      navigate(`/meal/${encodeURIComponent(query.trim())}`)
    }
  }

  const handleSuggestionClick = (meal) => {
    setQuery(meal.strMeal)
    setSearchQuery(meal.strMeal)
    setShowSuggestionsDropdown(false)
    navigate(`/recipe/${meal.id}`)
  }

  const handleClear = () => {
    setQuery('')
    setSearchQuery('')
    setSuggestions([])
    setShowSuggestionsDropdown(false)
  }

  return (
    <div className="relative max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={20} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestionsDropdown(true)}
            placeholder={placeholder}
            className="w-full pl-12 pr-12 py-4 rounded-full border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent text-lg"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestionsDropdown && showSuggestions && (
        <div className="absolute top-full mt-2 w-full bg-surface border border-border rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-text-muted">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent mx-auto"></div>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="py-2">
              {suggestions.map((meal) => (
                <button
                  key={meal.id}
                  onClick={() => handleSuggestionClick(meal)}
                  className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {meal.strMealThumb && (
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-medium">{meal.strMeal}</div>
                    <div className="text-sm text-text-muted">
                      {meal.strArea && `${meal.strArea} · `}
                      {meal.strCategory}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length > 0 ? (
            <div className="p-4 text-center text-text-muted">
              No recipes found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1'

export const mealdbAPI = {
  // Search meals by name
  searchByName: async (query) => {
    const response = await fetch(`${BASE_URL}/search.php?s=${query}`)
    const data = await response.json()
    return data.meals || []
  },

  // Search meals by first letter
  searchByFirstLetter: async (letter) => {
    const response = await fetch(`${BASE_URL}/search.php?f=${letter}`)
    const data = await response.json()
    return data.meals || []
  },

  // Lookup meal by ID
  lookupById: async (id) => {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`)
    const data = await response.json()
    return data.meals ? data.meals[0] : null
  },

  // Get random meal
  getRandomMeal: async () => {
    const response = await fetch(`${BASE_URL}/random.php`)
    const data = await response.json()
    return data.meals ? data.meals[0] : null
  },

  // Filter by category
  filterByCategory: async (category) => {
    const response = await fetch(`${BASE_URL}/filter.php?c=${category}`)
    const data = await response.json()
    return data.meals || []
  },

  // Filter by area (cuisine)
  filterByArea: async (area) => {
    const response = await fetch(`${BASE_URL}/filter.php?a=${area}`)
    const data = await response.json()
    return data.meals || []
  },

  // Filter by ingredient
  filterByIngredient: async (ingredient) => {
    const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`)
    const data = await response.json()
    return data.meals || []
  },

  // Get all categories
  getCategories: async () => {
    const response = await fetch(`${BASE_URL}/categories.php`)
    const data = await response.json()
    return data.categories || []
  },

  // Get all areas (cuisines)
  getAreas: async () => {
    const response = await fetch(`${BASE_URL}/list.php?a=list`)
    const data = await response.json()
    return data.meals || []
  },

  // Get all ingredients
  getIngredients: async () => {
    const response = await fetch(`${BASE_URL}/list.php?i=list`)
    const data = await response.json()
    return data.meals || []
  },

  // Get ingredient image URL
  getIngredientImageUrl: (name) => {
    return `https://www.themealdb.com/images/ingredients/${name}-Small.png`
  },

  // Helper function to parse ingredients from meal object
  parseIngredients: (meal) => {
    const ingredients = []
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`]
      const measure = meal[`strMeasure${i}`]
      
      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure ? measure.trim() : '',
          image: mealdbAPI.getIngredientImageUrl(ingredient.trim())
        })
      }
    }
    return ingredients
  },

  // Helper function to parse instructions into steps
  parseInstructions: (instructions) => {
    if (!instructions) return []
    
    // Split by numbered steps or newlines
    const steps = instructions
      .split(/\d+\.\s*|\n/)
      .filter(step => step.trim().length > 0)
      .map(step => step.trim())
    
    return steps.length > 0 ? steps : [instructions]
  }
}

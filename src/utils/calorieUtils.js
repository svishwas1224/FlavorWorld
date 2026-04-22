import calorieMap from '../data/calorieMap.json'

// Helper function to find calories for a meal
export const getMealCalories = (mealName) => {
  // First try exact match
  if (calorieMap[mealName]) {
    return calorieMap[mealName]
  }

  // Search in Indian dishes
  if (calorieMap['Indian Dishes']) {
    for (const [dish, data] of Object.entries(calorieMap['Indian Dishes'])) {
      if (dish.toLowerCase().includes(mealName.toLowerCase()) || 
          mealName.toLowerCase().includes(dish.toLowerCase())) {
        return data
      }
    }
  }

  // Search in desserts
  if (calorieMap['Desserts']) {
    for (const [dessert, data] of Object.entries(calorieMap['Desserts'])) {
      if (dessert.toLowerCase().includes(mealName.toLowerCase()) || 
          mealName.toLowerCase().includes(dessert.toLowerCase())) {
        return data
      }
    }
  }

  // Fallback to default calories
  return {
    kcal: 350,
    protein: 15,
    carbs: 45,
    fat: 12
  }
}

// Helper function to get cooking time based on category
export const getCookingTime = (category) => {
  const timeMap = {
    'Breakfast': 15,
    'Lunch': 25,
    'Dinner': 45,
    'Dessert': 60,
    'Starter': 30,
    'Side': 20,
    'Snack': 10,
    'Vegan': 35,
    'Vegetarian': 30
  }
  
  return timeMap[category] || 30
}

// Helper function to estimate macro percentages
export const getMacroPercentages = (protein, carbs, fat) => {
  const totalCalories = (protein * 4) + (carbs * 4) + (fat * 9)
  
  return {
    protein: Math.round((protein * 4 / totalCalories) * 100),
    carbs: Math.round((carbs * 4 / totalCalories) * 100),
    fat: Math.round((fat * 9 / totalCalories) * 100)
  }
}

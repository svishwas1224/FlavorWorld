import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getMealCalories } from '../utils/calorieUtils'

const MEAL_TYPES = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export const usePlannerStore = create(
  persist(
    (set, get) => ({
      // Goal settings
      goal: 'bulk', // 'bulk' or 'cut'
      currentWeight: 70, // kg
      targetWeight: 75, // kg
      weeksToGoal: 8,
      dailyCalorieTarget: 2500,
      
      // Meal plan data
      weeklyPlan: DAYS_OF_WEEK.reduce((acc, day) => ({
        ...acc,
        [day]: MEAL_TYPES.reduce((dayAcc, mealType) => ({
          ...dayAcc,
          [mealType]: []
        }), {})
      }), {}),

      // Saved recipes for planning
      savedRecipes: [],

      // Recently viewed recipes
      recentlyViewed: [],

      // Actions
      setGoal: (goal) => set({ goal }),
      
      setWeightData: (currentWeight, targetWeight, weeksToGoal) => set({
        currentWeight,
        targetWeight,
        weeksToGoal
      }),

      calculateDailyCalories: () => {
        const state = get()
        const { currentWeight, targetWeight, weeksToGoal, goal } = state
        
        // Simple BMR calculation (Mifflin-St Jeor formula approximation)
        const bmr = currentWeight * 22 // Simplified calculation
        
        // Add activity factor (moderately active)
        const tdee = bmr * 1.55
        
        // Calculate surplus or deficit
        const weeklyChange = Math.abs(targetWeight - currentWeight) / weeksToGoal
        const dailyCalorieAdjustment = weeklyChange * 7700 / 7 // 7700 calories per kg
        
        const dailyTarget = goal === 'bulk' 
          ? tdee + dailyCalorieAdjustment 
          : tdee - dailyCalorieAdjustment
        
        set({ dailyCalorieTarget: Math.round(dailyTarget) })
      },

      addMealToPlan: (day, mealType, meal) => {
        set((state) => ({
          weeklyPlan: {
            ...state.weeklyPlan,
            [day]: {
              ...state.weeklyPlan[day],
              [mealType]: [...state.weeklyPlan[day][mealType], meal]
            }
          }
        }))
      },

      removeMealFromPlan: (day, mealType, mealIndex) => {
        set((state) => ({
          weeklyPlan: {
            ...state.weeklyPlan,
            [day]: {
              ...state.weeklyPlan[day],
              [mealType]: state.weeklyPlan[day][mealType].filter((_, index) => index !== mealIndex)
            }
          }
        }))
      },

      updateMealServings: (day, mealType, mealIndex, servings) => {
        set((state) => ({
          weeklyPlan: {
            ...state.weeklyPlan,
            [day]: {
              ...state.weeklyPlan[day],
              [mealType]: state.weeklyPlan[day][mealType].map((meal, index) =>
                index === mealIndex ? { ...meal, servings } : meal
              )
            }
          }
        }))
      },

      saveRecipe: (recipe) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.some(r => r.id === recipe.id)
            ? state.savedRecipes
            : [...state.savedRecipes, recipe]
        }))
      },

      removeSavedRecipe: (recipeId) => {
        set((state) => ({
          savedRecipes: state.savedRecipes.filter(r => r.id !== recipeId)
        }))
      },

      addToRecentlyViewed: (recipe) => {
        set((state) => ({
          recentlyViewed: [
            recipe,
            ...state.recentlyViewed.filter(r => r.id !== recipe.id)
          ].slice(0, 6) // Keep only last 6
        }))
      },

      // Get daily calories for a specific day
      getDailyCalories: (day) => {
        const state = get()
        const dayPlan = state.weeklyPlan[day] || {}
        
        return Object.values(dayPlan).flat().reduce((total, meal) => {
          const calories = get().getMealCalories(meal)
          const servings = meal.servings || 1
          return total + (calories * servings)
        }, 0)
      },

      // Get meal calories (from calorie map or default)
      getMealCalories: (meal) => {
        const calorieData = getMealCalories(meal.strMeal || meal.name)
        return calorieData.kcal
      },

      // Get weekly nutrition totals
      getWeeklyNutrition: () => {
        const state = get()
        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFat = 0

        DAYS_OF_WEEK.forEach(day => {
          const dayPlan = state.weeklyPlan[day] || {}
          Object.values(dayPlan).flat().forEach(meal => {
            const servings = meal.servings || 1
            totalCalories += (state.getMealCalories(meal) * servings)
            // Add protein, carbs, fat calculations when calorie map is implemented
          })
        })

        return {
          totalCalories,
          avgDailyCalories: Math.round(totalCalories / 7),
          totalProtein,
          totalCarbs,
          totalFat
        }
      },

      // Clear all data
      clearPlanner: () => set({
        weeklyPlan: DAYS_OF_WEEK.reduce((acc, day) => ({
          ...acc,
          [day]: MEAL_TYPES.reduce((dayAcc, mealType) => ({
            ...dayAcc,
            [mealType]: []
          }), {})
        }), {}),
        savedRecipes: [],
        recentlyViewed: []
      })
    }),
    {
      name: 'planner-storage',
    }
  )
)

export { MEAL_TYPES, DAYS_OF_WEEK }

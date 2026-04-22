import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getMealCalories, getCookingTime, getMacroPercentages } from '../../utils/calorieUtils'
import { exportMealPlanAsPDF, exportShoppingListAsPDF } from '../../utils/pdfExport'

// Mock the calorie map
vi.mock('../../data/calorieMap.json', () => ({
  default: {
    'Chicken Biryani': {
      kcal: 450,
      protein: 25,
      carbs: 50,
      fat: 15
    },
    'Indian Dishes': {
      'Paneer Tikka': {
        kcal: 380,
        protein: 20,
        carbs: 30,
        fat: 18
      },
      'Dal Makhani': {
        kcal: 320,
        protein: 12,
        carbs: 40,
        fat: 10
      }
    },
    'Desserts': {
      'Gulab Jamun': {
        kcal: 280,
        protein: 4,
        carbs: 45,
        fat: 8
      }
    }
  }
}))

describe('Utility Functions Integration Tests', () => {
  describe('Calorie Utils', () => {
    it('should return exact match calories', () => {
      const result = getMealCalories('Chicken Biryani')
      
      expect(result).toEqual({
        kcal: 450,
        protein: 25,
        carbs: 50,
        fat: 15
      })
    })

    it('should find calories in Indian dishes', () => {
      const result = getMealCalories('Paneer Tikka')
      
      expect(result).toEqual({
        kcal: 380,
        protein: 20,
        carbs: 30,
        fat: 18
      })
    })

    it('should find calories with partial match', () => {
      const result = getMealCalories('Dal Makhani Special')
      
      expect(result).toEqual({
        kcal: 320,
        protein: 12,
        carbs: 40,
        fat: 10
      })
    })

    it('should find calories in desserts', () => {
      const result = getMealCalories('Gulab Jamun')
      
      expect(result).toEqual({
        kcal: 280,
        protein: 4,
        carbs: 45,
        fat: 8
      })
    })

    it('should return default calories for unknown meals', () => {
      const result = getMealCalories('Unknown Dish')
      
      expect(result).toEqual({
        kcal: 350,
        protein: 15,
        carbs: 45,
        fat: 12
      })
    })

    it('should handle case insensitive search', () => {
      const result = getMealCalories('chicken biryani')
      
      expect(result.kcal).toBe(450)
    })

    it('should get cooking time for known categories', () => {
      expect(getCookingTime('Breakfast')).toBe(15)
      expect(getCookingTime('Lunch')).toBe(25)
      expect(getCookingTime('Dinner')).toBe(45)
      expect(getCookingTime('Dessert')).toBe(60)
    })

    it('should return default cooking time for unknown categories', () => {
      expect(getCookingTime('Unknown')).toBe(30)
    })

    it('should calculate macro percentages correctly', () => {
      const result = getMacroPercentages(25, 50, 15)
      
      // Protein: 25 * 4 = 100 calories
      // Carbs: 50 * 4 = 200 calories  
      // Fat: 15 * 9 = 135 calories
      // Total: 435 calories
      
      expect(result.protein).toBe(23) // 100/435 * 100
      expect(result.carbs).toBe(46)   // 200/435 * 100
      expect(result.fat).toBe(31)    // 135/435 * 100
    })

    it('should handle zero values in macro calculations', () => {
      const result = getMacroPercentages(0, 0, 0)
      
      expect(result.protein).toBe(0)
      expect(result.carbs).toBe(0)
      expect(result.fat).toBe(0)
    })

    it('should handle single macro calculations', () => {
      const result = getMacroPercentages(25, 0, 0)
      
      expect(result.protein).toBe(100)
      expect(result.carbs).toBe(0)
      expect(result.fat).toBe(0)
    })
  })

  describe('PDF Export Utils', () => {
    let mockPDF

    beforeEach(() => {
      mockPDF = {
        setFontSize: vi.fn(),
        setFont: vi.fn(),
        text: vi.fn(),
        addPage: vi.fn(),
        save: vi.fn(),
        internal: {
          pageSize: {
            getWidth: () => 210,
            getHeight: () => 297
          }
        }
      }

      // Mock jsPDF constructor
      vi.mock('jspdf', () => ({
        default: vi.fn(() => mockPDF)
      }))

      vi.clearAllMocks()
    })

    it('should export meal plan as PDF', async () => {
      const weeklyPlan = {
        Monday: {
          Breakfast: [
            {
              strMeal: 'Oatmeal',
              calories: 150,
              servings: 1
            }
          ],
          Lunch: [
            {
              strMeal: 'Chicken Salad',
              calories: 350,
              servings: 1
            }
          ]
        },
        Tuesday: {
          Breakfast: [],
          Lunch: [],
          Dinner: []
        }
      }

      const nutritionData = {
        avgDailyCalories: 2000,
        totalCalories: 14000
      }

      await exportMealPlanAsPDF(weeklyPlan, nutritionData)

      // Verify PDF methods were called
      expect(mockPDF.setFontSize).toHaveBeenCalledWith(24)
      expect(mockPDF.setFont).toHaveBeenCalledWith('helvetica', 'bold')
      expect(mockPDF.text).toHaveBeenCalledWith('FlavorWorld Meal Plan', 105, { align: 'center' })
      expect(mockPDF.text).toHaveBeenCalledWith('Weekly Summary', 20, 70)
      expect(mockPDF.text).toHaveBeenCalledWith('Average Daily Calories: 2000 kcal', 20, 85)
      expect(mockPDF.save).toHaveBeenCalledWith('flavorworld-meal-plan.pdf')
    })

    it('should handle empty meal plan in PDF export', async () => {
      const weeklyPlan = {
        Monday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] },
        Tuesday: { Breakfast: [], Lunch: [], Dinner: [], Snack: [] }
      }

      const nutritionData = {
        avgDailyCalories: 0,
        totalCalories: 0
      }

      await exportMealPlanAsPDF(weeklyPlan, nutritionData)

      expect(mockPDF.text).toHaveBeenCalledWith('Weekly Summary', 20, 70)
      expect(mockPDF.text).toHaveBeenCalledWith('Average Daily Calories: 0 kcal', 20, 85)
      expect(mockPDF.save).toHaveBeenCalledWith('flavorworld-meal-plan.pdf')
    })

    it('should add new page when content exceeds page height', async () => {
      const weeklyPlan = {
        Monday: {
          Breakfast: Array(20).fill().map((_, i) => ({
            strMeal: `Meal ${i}`,
            calories: 300,
            servings: 1
          }))
        }
      }

      const nutritionData = {
        avgDailyCalories: 6000,
        totalCalories: 42000
      }

      await exportMealPlanAsPDF(weeklyPlan, nutritionData)

      expect(mockPDF.addPage).toHaveBeenCalled()
    })

    it('should export shopping list as PDF', async () => {
      const ingredients = [
        { name: 'Tomatoes', measure: '2 cups' },
        { name: 'Chicken Breast', measure: '500g' },
        { name: 'Rice', measure: '1 cup' },
        { name: 'Salt', measure: '1 tsp' }
      ]

      await exportShoppingListAsPDF(ingredients)

      expect(mockPDF.setFontSize).toHaveBeenCalledWith(24)
      expect(mockPDF.setFont).toHaveBeenCalledWith('helvetica', 'bold')
      expect(mockPDF.text).toHaveBeenCalledWith('Shopping List', 105, { align: 'center' })
      expect(mockPDF.text).toHaveBeenCalledWith('Produce', 20, 70)
      expect(mockPDF.text).toHaveBeenCalledWith('Protein', 20, expect.any(Number))
      expect(mockPDF.text).toHaveBeenCalledWith('Grains', 20, expect.any(Number))
      expect(mockPDF.text).toHaveBeenCalledWith('Spices', 20, expect.any(Number))
      expect(mockPDF.save).toHaveBeenCalledWith('shopping-list.pdf')
    })

    it('should categorize ingredients correctly in shopping list', async () => {
      const ingredients = [
        { name: 'Tomatoes', measure: '2 cups' },
        { name: 'Chicken Breast', measure: '500g' },
        { name: 'Milk', measure: '1 liter' },
        { name: 'Bread', measure: '1 loaf' },
        { name: 'Cumin', measure: '1 tsp' }
      ]

      await exportShoppingListAsPDF(ingredients)

      // Verify ingredients are in correct categories
      expect(mockPDF.text).toHaveBeenCalledWith('- 2 cups Tomatoes', 25, expect.any(Number))
      expect(mockPDF.text).toHaveBeenCalledWith('- 500g Chicken Breast', 25, expect.any(Number))
      expect(mockPDF.text).toHaveBeenCalledWith('- 1 liter Milk', 25, expect.any(Number))
      expect(mockPDF.text).toHaveBeenCalledWith('- 1 loaf Bread', 25, expect.any(Number))
      expect(mockPDF.text).toHaveBeenCalledWith('- 1 tsp Cumin', 25, expect.any(Number))
    })

    it('should handle empty ingredients list in shopping list', async () => {
      const ingredients = []

      await exportShoppingListAsPDF(ingredients)

      expect(mockPDF.text).toHaveBeenCalledWith('Shopping List', 105, { align: 'center' })
      expect(mockPDF.save).toHaveBeenCalledWith('shopping-list.pdf')
    })

    it('should handle unknown ingredients in shopping list', async () => {
      const ingredients = [
        { name: 'Unknown Item', measure: '1 unit' }
      ]

      await exportShoppingListAsPDF(ingredients)

      expect(mockPDF.text).toHaveBeenCalledWith('Other', 20, expect.any(Number))
      expect(mockPDF.text).toHaveBeenCalledWith('- 1 unit Unknown Item', 25, expect.any(Number))
    })

    it('should handle ingredient names with different cases', async () => {
      const ingredients = [
        { name: 'TOMATOES', measure: '2 cups' },
        { name: 'chicken breast', measure: '500g' }
      ]

      await exportShoppingListAsPDF(ingredients)

      expect(mockPDF.text).toHaveBeenCalledWith('- 2 cups TOMATOES', 25, expect.any(Number))
      expect(mockPDF.text).toHaveBeenCalledWith('- 500g chicken breast', 25, expect.any(Number))
    })
  })

  describe('Utils Integration', () => {
    it('should integrate calorie calculations with PDF export', async () => {
      const mealName = 'Chicken Biryani'
      const calories = getMealCalories(mealName)
      
      const weeklyPlan = {
        Monday: {
          Breakfast: [
            {
              strMeal: mealName,
              calories: calories.kcal,
              servings: 1
            }
          ]
        }
      }

      const nutritionData = {
        avgDailyCalories: calories.kcal,
        totalCalories: calories.kcal
      }

      await exportMealPlanAsPDF(weeklyPlan, nutritionData)

      expect(mockPDF.text).toHaveBeenCalledWith(`  - ${mealName} (${calories.kcal} kcal)`, 30, expect.any(Number))
    })

    it('should handle macro calculations in meal planning', () => {
      const calories = getMealCalories('Chicken Biryani')
      const macros = getMacroPercentages(calories.protein, calories.carbs, calories.fat)

      expect(macros.protein + macros.carbs + macros.fat).toBeCloseTo(100, 0)
    })

    it('should integrate cooking time with meal planning', () => {
      const cookingTime = getCookingTime('Dinner')
      expect(cookingTime).toBe(45)

      const breakfastTime = getCookingTime('Breakfast')
      expect(breakfastTime).toBe(15)
    })
  })
})

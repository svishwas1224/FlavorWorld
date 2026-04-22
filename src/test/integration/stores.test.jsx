import { describe, it, expect, beforeEach, vi } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useFilterStore } from '../../store/useFilterStore'
import { usePlannerStore } from '../../store/usePlannerStore'

describe('State Management Integration Tests', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Filter Store', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useFilterStore())

      expect(result.current.isSidebarOpen).toBe(true)
      expect(result.current.selectedCuisines).toEqual([])
      expect(result.current.selectedCategories).toEqual([])
      expect(result.current.selectedDietary).toEqual([])
      expect(result.current.searchQuery).toBe('')
    })

    it('should toggle sidebar state', () => {
      const { result } = renderHook(() => useFilterStore())

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.isSidebarOpen).toBe(false)

      act(() => {
        result.current.toggleSidebar()
      })

      expect(result.current.isSidebarOpen).toBe(true)
    })

    it('should set sidebar state explicitly', () => {
      const { result } = renderHook(() => useFilterStore())

      act(() => {
        result.current.setSidebarOpen(false)
      })

      expect(result.current.isSidebarOpen).toBe(false)
    })

    it('should toggle cuisine selection', () => {
      const { result } = renderHook(() => useFilterStore())

      act(() => {
        result.current.toggleCuisine('Italian')
      })

      expect(result.current.selectedCuisines).toContain('Italian')

      act(() => {
        result.current.toggleCuisine('Italian')
      })

      expect(result.current.selectedCuisines).not.toContain('Italian')
    })

    it('should toggle category selection', () => {
      const { result } = renderHook(() => useFilterStore())

      act(() => {
        result.current.toggleCategory('Breakfast')
      })

      expect(result.current.selectedCategories).toContain('Breakfast')

      act(() => {
        result.current.toggleCategory('Breakfast')
      })

      expect(result.current.selectedCategories).not.toContain('Breakfast')
    })

    it('should toggle dietary filters', () => {
      const { result } = renderHook(() => useFilterStore())

      act(() => {
        result.current.toggleDietary('vegetarian')
      })

      expect(result.current.selectedDietary).toContain('vegetarian')

      act(() => {
        result.current.toggleDietary('vegetarian')
      })

      expect(result.current.selectedDietary).not.toContain('vegetarian')
    })

    it('should set search query', () => {
      const { result } = renderHook(() => useFilterStore())

      act(() => {
        result.current.setSearchQuery('chicken recipes')
      })

      expect(result.current.searchQuery).toBe('chicken recipes')
    })

    it('should clear all filters', () => {
      const { result } = renderHook(() => useFilterStore())

      act(() => {
        result.current.toggleCuisine('Italian')
        result.current.toggleCategory('Breakfast')
        result.current.toggleDietary('vegetarian')
        result.current.setSearchQuery('chicken')
      })

      expect(result.current.selectedCuisines).toContain('Italian')
      expect(result.current.selectedCategories).toContain('Breakfast')
      expect(result.current.selectedDietary).toContain('vegetarian')
      expect(result.current.searchQuery).toBe('chicken')

      act(() => {
        result.current.clearFilters()
      })

      expect(result.current.selectedCuisines).toEqual([])
      expect(result.current.selectedCategories).toEqual([])
      expect(result.current.selectedDietary).toEqual([])
      expect(result.current.searchQuery).toBe('')
    })

    it('should calculate active filters count', () => {
      const { result } = renderHook(() => useFilterStore())

      expect(result.current.getActiveFiltersCount()).toBe(0)

      act(() => {
        result.current.toggleCuisine('Italian')
        result.current.toggleCategory('Breakfast')
        result.current.setSearchQuery('chicken')
      })

      expect(result.current.getActiveFiltersCount()).toBe(3)
    })

    it('should check if any filters are active', () => {
      const { result } = renderHook(() => useFilterStore())

      expect(result.current.hasActiveFilters()).toBe(false)

      act(() => {
        result.current.toggleCuisine('Italian')
      })

      expect(result.current.hasActiveFilters()).toBe(true)
    })

    it('should persist state to localStorage', () => {
      const { result } = renderHook(() => useFilterStore())

      act(() => {
        result.current.toggleCuisine('Italian')
        result.current.setSearchQuery('chicken')
      })

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'filter-storage',
        expect.any(String)
      )
    })
  })

  describe('Planner Store', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePlannerStore())

      expect(result.current.goal).toBe('bulk')
      expect(result.current.currentWeight).toBe(70)
      expect(result.current.targetWeight).toBe(75)
      expect(result.current.weeksToGoal).toBe(8)
      expect(result.current.dailyCalorieTarget).toBe(2500)
      expect(result.current.savedRecipes).toEqual([])
      expect(result.current.recentlyViewed).toEqual([])
    })

    it('should set goal', () => {
      const { result } = renderHook(() => usePlannerStore())

      act(() => {
        result.current.setGoal('cut')
      })

      expect(result.current.goal).toBe('cut')
    })

    it('should set weight data', () => {
      const { result } = renderHook(() => usePlannerStore())

      act(() => {
        result.current.setWeightData(80, 85, 12)
      })

      expect(result.current.currentWeight).toBe(80)
      expect(result.current.targetWeight).toBe(85)
      expect(result.current.weeksToGoal).toBe(12)
    })

    it('should calculate daily calories', () => {
      const { result } = renderHook(() => usePlannerStore())

      act(() => {
        result.current.setWeightData(70, 75, 8)
        result.current.calculateDailyCalories()
      })

      expect(result.current.dailyCalorieTarget).toBeGreaterThan(0)
    })

    it('should add meal to plan', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockMeal = {
        id: '52772',
        name: 'Test Meal',
        servings: 1
      }

      act(() => {
        result.current.addMealToPlan('Monday', 'Breakfast', mockMeal)
      })

      expect(result.current.weeklyPlan.Monday.Breakfast).toContain(mockMeal)
    })

    it('should remove meal from plan', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockMeal = {
        id: '52772',
        name: 'Test Meal',
        servings: 1
      }

      act(() => {
        result.current.addMealToPlan('Monday', 'Breakfast', mockMeal)
      })

      act(() => {
        result.current.removeMealFromPlan('Monday', 'Breakfast', 0)
      })

      expect(result.current.weeklyPlan.Monday.Breakfast).toEqual([])
    })

    it('should update meal servings', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockMeal = {
        id: '52772',
        name: 'Test Meal',
        servings: 1
      }

      act(() => {
        result.current.addMealToPlan('Monday', 'Breakfast', mockMeal)
      })

      act(() => {
        result.current.updateMealServings('Monday', 'Breakfast', 0, 2)
      })

      expect(result.current.weeklyPlan.Monday.Breakfast[0].servings).toBe(2)
    })

    it('should save recipe', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockRecipe = {
        id: '52772',
        name: 'Test Recipe'
      }

      act(() => {
        result.current.saveRecipe(mockRecipe)
      })

      expect(result.current.savedRecipes).toContain(mockRecipe)
    })

    it('should not save duplicate recipes', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockRecipe = {
        id: '52772',
        name: 'Test Recipe'
      }

      act(() => {
        result.current.saveRecipe(mockRecipe)
        result.current.saveRecipe(mockRecipe)
      })

      expect(result.current.savedRecipes).toHaveLength(1)
    })

    it('should remove saved recipe', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockRecipe = {
        id: '52772',
        name: 'Test Recipe'
      }

      act(() => {
        result.current.saveRecipe(mockRecipe)
      })

      act(() => {
        result.current.removeSavedRecipe('52772')
      })

      expect(result.current.savedRecipes).toEqual([])
    })

    it('should add to recently viewed', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockRecipe = {
        id: '52772',
        name: 'Test Recipe'
      }

      act(() => {
        result.current.addToRecentlyViewed(mockRecipe)
      })

      expect(result.current.recentlyViewed[0]).toBe(mockRecipe)
    })

    it('should limit recently viewed to 6 items', () => {
      const { result } = renderHook(() => usePlannerStore())

      const recipes = Array.from({ length: 8 }, (_, i) => ({
        id: `recipe-${i}`,
        name: `Recipe ${i}`
      }))

      act(() => {
        recipes.forEach(recipe => {
          result.current.addToRecentlyViewed(recipe)
        })
      })

      expect(result.current.recentlyViewed).toHaveLength(6)
    })

    it('should move recently viewed item to front when viewed again', () => {
      const { result } = renderHook(() => usePlannerStore())

      const recipe1 = { id: '1', name: 'Recipe 1' }
      const recipe2 = { id: '2', name: 'Recipe 2' }

      act(() => {
        result.current.addToRecentlyViewed(recipe1)
        result.current.addToRecentlyViewed(recipe2)
        result.current.addToRecentlyViewed(recipe1)
      })

      expect(result.current.recentlyViewed[0]).toBe(recipe1)
      expect(result.current.recentlyViewed[1]).toBe(recipe2)
    })

    it('should calculate daily calories', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockMeal = {
        id: '52772',
        strMeal: 'Test Meal',
        servings: 2
      }

      act(() => {
        result.current.addMealToPlan('Monday', 'Breakfast', mockMeal)
      })

      const dailyCalories = result.current.getDailyCalories('Monday')
      expect(dailyCalories).toBeGreaterThan(0)
    })

    it('should get weekly nutrition totals', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockMeal = {
        id: '52772',
        strMeal: 'Test Meal',
        servings: 1
      }

      act(() => {
        result.current.addMealToPlan('Monday', 'Breakfast', mockMeal)
        result.current.addMealToPlan('Tuesday', 'Lunch', mockMeal)
      })

      const weeklyNutrition = result.current.getWeeklyNutrition()
      expect(weeklyNutrition.totalCalories).toBeGreaterThan(0)
      expect(weeklyNutrition.avgDailyCalories).toBeGreaterThan(0)
    })

    it('should clear all planner data', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockMeal = {
        id: '52772',
        name: 'Test Meal'
      }

      act(() => {
        result.current.saveRecipe(mockMeal)
        result.current.addToRecentlyViewed(mockMeal)
        result.current.addMealToPlan('Monday', 'Breakfast', mockMeal)
      })

      act(() => {
        result.current.clearPlanner()
      })

      expect(result.current.savedRecipes).toEqual([])
      expect(result.current.recentlyViewed).toEqual([])
      expect(result.current.weeklyPlan.Monday.Breakfast).toEqual([])
    })

    it('should persist state to localStorage', () => {
      const { result } = renderHook(() => usePlannerStore())

      const mockRecipe = {
        id: '52772',
        name: 'Test Recipe'
      }

      act(() => {
        result.current.saveRecipe(mockRecipe)
      })

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'planner-storage',
        expect.any(String)
      )
    })
  })

  describe('Store Integration', () => {
    it('should work together across multiple stores', () => {
      const filterStore = renderHook(() => useFilterStore())
      const plannerStore = renderHook(() => usePlannerStore())

      act(() => {
        filterStore.result.current.setSearchQuery('chicken')
        filterStore.result.current.toggleCuisine('Italian')
      })

      act(() => {
        const mockRecipe = {
          id: '52772',
          name: 'Chicken Recipe',
          strArea: 'Italian'
        }
        plannerStore.result.current.saveRecipe(mockRecipe)
      })

      expect(filterStore.result.current.searchQuery).toBe('chicken')
      expect(filterStore.result.current.selectedCuisines).toContain('Italian')
      expect(plannerStore.result.current.savedRecipes).toHaveLength(1)
    })
  })
})

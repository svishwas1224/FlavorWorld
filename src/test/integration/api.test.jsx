import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mealdbAPI } from '../../api/mealdb'

describe('MealDB API Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic API Functions', () => {
    it('should search meals by name', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '52772',
            strMeal: 'Teriyaki Chicken Casserole',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.searchByName('chicken')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=chicken'
      )
      expect(result).toEqual(mockResponse.meals)
    })

    it('should search meals by first letter', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '52893',
            strMeal: 'Apple & Blackberry Crumble',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/x0lk931585548189.jpg'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.searchByFirstLetter('a')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/search.php?f=a'
      )
      expect(result).toEqual(mockResponse.meals)
    })

    it('should lookup meal by ID', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '52772',
            strMeal: 'Teriyaki Chicken Casserole',
            strCategory: 'Chicken',
            strArea: 'Japanese'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.lookupById('52772')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/lookup.php?i=52772'
      )
      expect(result).toEqual(mockResponse.meals[0])
    })

    it('should get random meal', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '52959',
            strMeal: 'Baked Salmon with Fennel',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/1548772327.jpg'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.getRandomMeal()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/random.php'
      )
      expect(result).toEqual(mockResponse.meals[0])
    })
  })

  describe('Filter Functions', () => {
    it('should filter by category', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '52893',
            strMeal: 'Apple & Blackberry Crumble',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/x0lk931585548189.jpg'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.filterByCategory('Dessert')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/filter.php?c=Dessert'
      )
      expect(result).toEqual(mockResponse.meals)
    })

    it('should filter by area', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '52768',
            strMeal: 'Spaghetti Bolognese',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/sutxsu1468245430.jpg'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.filterByArea('Italian')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/filter.php?a=Italian'
      )
      expect(result).toEqual(mockResponse.meals)
    })

    it('should filter by ingredient', async () => {
      const mockResponse = {
        meals: [
          {
            idMeal: '52772',
            strMeal: 'Teriyaki Chicken Casserole',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.filterByIngredient('chicken_breast')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/filter.php?i=chicken_breast'
      )
      expect(result).toEqual(mockResponse.meals)
    })
  })

  describe('List Functions', () => {
    it('should get all categories', async () => {
      const mockResponse = {
        categories: [
          {
            idCategory: '1',
            strCategory: 'Beef',
            strCategoryThumb: 'https://www.themealdb.com/images/category/beef.png'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.getCategories()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/categories.php'
      )
      expect(result).toEqual(mockResponse.categories)
    })

    it('should get all areas', async () => {
      const mockResponse = {
        meals: [
          {
            strArea: 'American'
          },
          {
            strArea: 'British'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.getAreas()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/list.php?a=list'
      )
      expect(result).toEqual(mockResponse.meals)
    })

    it('should get all ingredients', async () => {
      const mockResponse = {
        meals: [
          {
            idIngredient: '1',
            strIngredient: 'Chicken'
          },
          {
            idIngredient: '2',
            strIngredient: 'Salmon'
          }
        ]
      }

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const result = await mealdbAPI.getIngredients()

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/list.php?i=list'
      )
      expect(result).toEqual(mockResponse.meals)
    })
  })

  describe('Helper Functions', () => {
    it('should generate ingredient image URL', () => {
      const url = mealdbAPI.getIngredientImageUrl('Chicken')
      expect(url).toBe('https://www.themealdb.com/images/ingredients/Chicken-Small.png')
    })

    it('should parse ingredients from meal object', () => {
      const mockMeal = {
        strIngredient1: 'Chicken',
        strMeasure1: '200g',
        strIngredient2: 'Rice',
        strMeasure2: '1 cup',
        strIngredient3: '',
        strMeasure3: ''
      }

      const ingredients = mealdbAPI.parseIngredients(mockMeal)

      expect(ingredients).toEqual([
        {
          name: 'Chicken',
          measure: '200g',
          image: 'https://www.themealdb.com/images/ingredients/Chicken-Small.png'
        },
        {
          name: 'Rice',
          measure: '1 cup',
          image: 'https://www.themealdb.com/images/ingredients/Rice-Small.png'
        }
      ])
    })

    it('should parse instructions into steps', () => {
      const instructions = '1. Preheat oven to 350°F. 2. Mix ingredients. 3. Bake for 30 minutes.'
      const steps = mealdbAPI.parseInstructions(instructions)

      expect(steps).toEqual([
        'Preheat oven to 350°F.',
        'Mix ingredients.',
        'Bake for 30 minutes.'
      ])
    })

    it('should handle simple instructions without numbers', () => {
      const instructions = 'Just mix everything together and serve.'
      const steps = mealdbAPI.parseInstructions(instructions)

      expect(steps).toEqual(['Just mix everything together and serve.'])
    })
  })

  describe('Error Handling', () => {
    it('should handle empty search results', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null })
      })

      const result = await mealdbAPI.searchByName('nonexistent')

      expect(result).toEqual([])
    })

    it('should handle network errors', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(mealdbAPI.searchByName('chicken')).rejects.toThrow('Network error')
    })

    it('should handle API errors', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      })

      await expect(mealdbAPI.searchByName('chicken')).rejects.toThrow()
    })

    it('should handle malformed JSON', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.reject(new Error('Invalid JSON'))
      })

      await expect(mealdbAPI.searchByName('chicken')).rejects.toThrow('Invalid JSON')
    })
  })

  describe('URL Encoding', () => {
    it('should properly encode special characters in search', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: [] })
      })

      await mealdbAPI.searchByName('Chicken & Rice')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/search.php?s=Chicken & Rice'
      )
    })

    it('should handle spaces in category names', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: [] })
      })

      await mealdbAPI.filterByCategory('Side Dish')

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/filter.php?c=Side Dish'
      )
    })
  })
})

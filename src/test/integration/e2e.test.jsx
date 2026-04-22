import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../../App'

describe('End-to-End Integration Tests', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    
    vi.clearAllMocks()
    
    // Mock comprehensive API responses
    global.fetch.mockImplementation((url) => {
      if (url.includes('random.php')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            meals: [{
              idMeal: '52772',
              strMeal: 'Teriyaki Chicken Casserole',
              strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg',
              strCategory: 'Chicken',
              strArea: 'Japanese'
            }]
          })
        })
      }
      
      if (url.includes('filter.php?a=Italian')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            meals: [
              {
                idMeal: '52768',
                strMeal: 'Spaghetti Bolognese',
                strMealThumb: 'https://www.themealdb.com/images/media/meals/sutxsu1468245430.jpg',
                strCategory: 'Pasta',
                strArea: 'Italian'
              }
            ]
          })
        })
      }
      
      if (url.includes('search.php?s=chicken')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            meals: [
              {
                idMeal: '52792',
                strMeal: 'Chicken and mushroom Hotpot',
                strMealThumb: 'https://www.themealdb.com/images/media/meals/qtyswx1468253022.jpg',
                strCategory: 'Chicken',
                strArea: 'British'
              }
            ]
          })
        })
      }
      
      if (url.includes('lookup.php?i=52772')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            meals: [{
              idMeal: '52772',
              strMeal: 'Teriyaki Chicken Casserole',
              strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg',
              strCategory: 'Chicken',
              strArea: 'Japanese',
              strInstructions: '1. Preheat oven to 350°F. 2. Mix ingredients. 3. Bake for 30 minutes.',
              strIngredient1: 'Chicken',
              strMeasure1: '200g',
              strIngredient2: 'Rice',
              strMeasure2: '1 cup'
            }]
          })
        })
      }
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: [] })
      })
    })
  })

  describe('Complete User Journey', () => {
    it('should handle complete recipe discovery flow', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      // 1. User lands on homepage
      await waitFor(() => {
        expect(screen.getByText(/What are you craving today?/i)).toBeInTheDocument()
      })

      // 2. User searches for recipes
      const searchInput = screen.getByPlaceholderText(/Search recipes/i)
      fireEvent.change(searchInput, { target: { value: 'chicken' } })
      fireEvent.focus(searchInput)

      // 3. Search suggestions appear
      await waitFor(() => {
        expect(screen.getByText('Chicken and mushroom Hotpot')).toBeInTheDocument()
      })

      // 4. User clicks on a suggestion
      const suggestion = screen.getByText('Chicken and mushroom Hotpot')
      fireEvent.click(suggestion)

      // 5. Should navigate to recipe detail (mocked)
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('lookup.php?i=52792')
        )
      })
    })

    it('should handle surprise me functionality', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/Surprise Me/i)).toBeInTheDocument()
      })

      const surpriseButton = screen.getByText(/Surprise Me/i)
      fireEvent.click(surpriseButton)

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://www.themealdb.com/api/json/v1/1/random.php'
        )
      })
    })

    it('should handle featured cuisines loading', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/Featured Cuisines/i)).toBeInTheDocument()
      })

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('filter.php?a=Italian')
      )
    })

    it('should handle trending meals loading', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/Trending Today/i)).toBeInTheDocument()
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'https://www.themealdb.com/api/json/v1/1/random.php'
      )
    })
  })

  describe('Error Handling Flow', () => {
    it('should handle API failures gracefully', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'))

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/What are you craving today?/i)).toBeInTheDocument()
      })

      // UI should still render despite API errors
      expect(screen.getByText(/Discover delicious recipes/i)).toBeInTheDocument()
    })

    it('should handle empty search results', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null })
      })

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText(/Search recipes/i)
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
      fireEvent.focus(searchInput)

      await waitFor(() => {
        expect(screen.getByText(/No recipes found/i)).toBeInTheDocument()
      })
    })
  })

  describe('Responsive Design Flow', () => {
    it('should work on mobile viewport', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      })

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/What are you craving today?/i)).toBeInTheDocument()
      })

      // Mobile-specific interactions should work
      expect(screen.getByPlaceholderText(/Search recipes/i)).toBeInTheDocument()
    })

    it('should work on tablet viewport', async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      })

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/What are you craving today?/i)).toBeInTheDocument()
      })
    })
  })

  describe('Performance Integration', () => {
    it('should handle multiple rapid API calls', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/Trending Today/i)).toBeInTheDocument()
      })

      // Multiple API calls should be handled
      expect(global.fetch).toHaveBeenCalledTimes(7) // 6 for trending + 1 for Italian
    })

    it('should handle search debouncing', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText(/Search recipes/i)
      
      // Rapid typing should be debounced
      fireEvent.change(searchInput, { target: { value: 'c' } })
      fireEvent.change(searchInput, { target: { value: 'ch' } })
      fireEvent.change(searchInput, { target: { value: 'chi' } })
      fireEvent.change(searchInput, { target: { value: 'chic' } })
      fireEvent.change(searchInput, { target: { value: 'chicken' } })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search.php?s=chicken')
        )
      })

      // Should only call API once due to debouncing
      const searchCalls = global.fetch.mock.calls.filter(call => 
        call[0].includes('search.php?s=')
      )
      expect(searchCalls).toHaveLength(1)
    })
  })

  describe('Accessibility Integration', () => {
    it('should have proper ARIA labels', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/What are you craving today?/i)).toBeInTheDocument()
      })

      // Search input should have proper attributes
      const searchInput = screen.getByPlaceholderText(/Search recipes/i)
      expect(searchInput).toHaveAttribute('type', 'text')
    })

    it('should handle keyboard navigation', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText(/Search recipes/i)
      
      // Should be focusable
      searchInput.focus()
      expect(searchInput).toHaveFocus()
    })
  })

  describe('Data Persistence Integration', () => {
    it('should persist user preferences', async () => {
      // Mock localStorage with existing data
      const mockFilterData = JSON.stringify({
        state: {
          isSidebarOpen: false,
          selectedCuisines: ['Italian'],
          searchQuery: 'pasta'
        },
        version: 0
      })

      localStorageMock.getItem.mockReturnValue(mockFilterData)

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/What are you craving today?/i)).toBeInTheDocument()
      })

      // Should load persisted data
      expect(localStorageMock.getItem).toHaveBeenCalledWith('filter-storage')
    })
  })
})

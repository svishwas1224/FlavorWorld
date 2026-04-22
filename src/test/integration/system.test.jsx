import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from '../../App'
import { mealdbAPI } from '../../api/mealdb'

// Mock the actual App component to use the real app instead of test component
vi.mock('../../App', () => {
  const actual = vi.importActual('../../pages/Home')
  return {
    default: () => (
      <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <actual.default />
        </BrowserRouter>
      </QueryClientProvider>
    )
  }
})

describe('FlavorWorld System Integration Tests', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    
    // Clear all mocks
    vi.clearAllMocks()
    
    // Mock successful API responses
    global.fetch.mockImplementation((url) => {
      if (url.includes('random.php')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            meals: [{
              idMeal: '52772',
              strMeal: 'Teriyaki Chicken Casserole',
              strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg',
              strCategory: 'Chicken'
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
                strMealThumb: 'https://www.themealdb.com/images/media/meals/sutxsu1468245430.jpg'
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
                strMealThumb: 'https://www.themealdb.com/images/media/meals/qtyswx1468253022.jpg'
              }
            ]
          })
        })
      }
      
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: [] })
      })
    })
  })

  describe('API Integration', () => {
    it('should fetch and display trending meals', async () => {
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

    it('should handle API errors gracefully', async () => {
      global.fetch.mockImplementationOnce(() => 
        Promise.reject(new Error('Network error'))
      )

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

      // Should not crash and still show UI
      expect(screen.getByText(/What are you craving today?/i)).toBeInTheDocument()
    })

    it('should fetch featured cuisines', async () => {
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
  })

  describe('Component Integration', () => {
    it('should render search functionality', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search recipes/i)).toBeInTheDocument()
      })

      const searchInput = screen.getByPlaceholderText(/Search recipes/i)
      fireEvent.change(searchInput, { target: { value: 'chicken' } })

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          expect.stringContaining('search.php?s=chicken')
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
  })

  describe('State Management Integration', () => {
    it('should integrate with planner store for recently viewed', async () => {
      // Mock localStorage for recently viewed
      const mockRecentlyViewed = [
        {
          id: '52772',
          strMeal: 'Teriyaki Chicken Casserole',
          strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg'
        }
      ]
      
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockRecentlyViewed))

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </QueryClientProvider>
      )

      await waitFor(() => {
        expect(screen.getByText(/Recently Viewed/i)).toBeInTheDocument()
      })

      expect(screen.getByText('Teriyaki Chicken Casserole')).toBeInTheDocument()
    })
  })

  describe('Responsive Design Integration', () => {
    it('should render mobile-friendly layout', async () => {
      // Mock mobile viewport
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

      // Should still be functional on mobile
      expect(screen.getByPlaceholderText(/Search recipes/i)).toBeInTheDocument()
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle network failures gracefully', async () => {
      global.fetch.mockImplementation(() => 
        Promise.resolve({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error'
        })
      )

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

      // UI should still render despite API failures
      expect(screen.getByText(/Discover delicious recipes/i)).toBeInTheDocument()
    })

    it('should handle malformed API responses', async () => {
      global.fetch.mockImplementation(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ invalid: 'response' })
        })
      )

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

      // Should not crash with malformed data
      expect(screen.getByText(/Trending Today/i)).toBeInTheDocument()
    })
  })
})

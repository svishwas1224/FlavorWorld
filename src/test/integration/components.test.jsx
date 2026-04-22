import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import SearchBar from '../../components/search/SearchBar'
import RecipeCard from '../../components/recipe/RecipeCard'

describe('Component Integration Tests', () => {
  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    })
    
    vi.clearAllMocks()
    
    // Mock fetch for search functionality
    global.fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        meals: [
          {
            id: '52772',
            strMeal: 'Teriyaki Chicken Casserole',
            strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg',
            strArea: 'Japanese',
            strCategory: 'Chicken'
          }
        ]
      })
    })
  })

  describe('SearchBar Component', () => {
    it('should render search input with placeholder', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </QueryClientProvider>
      )

      expect(screen.getByPlaceholderText('Search for recipes...')).toBeInTheDocument()
    })

    it('should show suggestions when typing', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText('Search for recipes...')
      fireEvent.change(searchInput, { target: { value: 'chicken' } })
      fireEvent.focus(searchInput)

      await waitFor(() => {
        expect(screen.getByText('Teriyaki Chicken Casserole')).toBeInTheDocument()
      })
    })

    it('should handle form submission', async () => {
      const mockNavigate = vi.fn()
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
          ...actual,
          useNavigate: () => mockNavigate
        }
      })

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText('Search for recipes...')
      const form = searchInput.closest('form')

      fireEvent.change(searchInput, { target: { value: 'chicken' } })
      fireEvent.submit(form)

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/meal/chicken')
      })
    })

    it('should clear search when clear button is clicked', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText('Search for recipes...')
      fireEvent.change(searchInput, { target: { value: 'chicken' } })

      const clearButton = screen.getByRole('button')
      fireEvent.click(clearButton)

      expect(searchInput.value).toBe('')
    })

    it('should handle suggestion click', async () => {
      const mockNavigate = vi.fn()
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom')
        return {
          ...actual,
          useNavigate: () => mockNavigate
        }
      })

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText('Search for recipes...')
      fireEvent.change(searchInput, { target: { value: 'chicken' } })
      fireEvent.focus(searchInput)

      await waitFor(() => {
        const suggestion = screen.getByText('Teriyaki Chicken Casserole')
        fireEvent.click(suggestion)
        expect(mockNavigate).toHaveBeenCalledWith('/recipe/52772')
      })
    })

    it('should show loading state during search', async () => {
      global.fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(resolve, 100)))

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText('Search for recipes...')
      fireEvent.change(searchInput, { target: { value: 'chicken' } })
      fireEvent.focus(searchInput)

      expect(screen.getByText('Loading...')).toBeInTheDocument()
    })

    it('should show no results message', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ meals: null })
      })

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <SearchBar />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText('Search for recipes...')
      fireEvent.change(searchInput, { target: { value: 'nonexistent' } })
      fireEvent.focus(searchInput)

      await waitFor(() => {
        expect(screen.getByText('No recipes found for "nonexistent"')).toBeInTheDocument()
      })
    })
  })

  describe('RecipeCard Component', () => {
    const mockMeal = {
      id: '52772',
      strMeal: 'Teriyaki Chicken Casserole',
      strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg',
      strArea: 'Japanese',
      strCategory: 'Chicken'
    }

    it('should render recipe information', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RecipeCard meal={mockMeal} />
          </BrowserRouter>
        </QueryClientProvider>
      )

      expect(screen.getByText('Teriyaki Chicken Casserole')).toBeInTheDocument()
      expect(screen.getByText('Japanese')).toBeInTheDocument()
      expect(screen.getByText('Chicken')).toBeInTheDocument()
      expect(screen.getByText('30 min')).toBeInTheDocument()
      expect(screen.getByText('4 servings')).toBeInTheDocument()
    })

    it('should handle missing image', () => {
      const mealWithoutImage = { ...mockMeal, strMealThumb: null }

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RecipeCard meal={mealWithoutImage} />
          </BrowserRouter>
        </QueryClientProvider>
      )

      expect(screen.getByText('No Image')).toBeInTheDocument()
    })

    it('should handle save functionality', () => {
      const mockSaveRecipe = vi.fn()
      vi.mock('../../store/usePlannerStore', () => ({
        usePlannerStore: () => ({
          saveRecipe: mockSaveRecipe,
          savedRecipes: []
        })
      }))

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RecipeCard meal={mockMeal} />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const saveButton = screen.getByRole('button')
      fireEvent.click(saveButton)

      expect(mockSaveRecipe).toHaveBeenCalledWith(mockMeal)
    })

    it('should show saved state', () => {
      vi.mock('../../store/usePlannerStore', () => ({
        usePlannerStore: () => ({
          saveRecipe: vi.fn(),
          savedRecipes: [mockMeal]
        })
      }))

      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RecipeCard meal={mockMeal} />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const saveButton = screen.getByRole('button')
      expect(saveButton).toHaveClass('bg-accent')
    })

    it('should hide save button when showSaveButton is false', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RecipeCard meal={mockMeal} showSaveButton={false} />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const saveButtons = screen.queryAllByRole('button')
      expect(saveButtons.length).toBe(1) // Only the add to plan button
    })

    it('should handle navigation on click', () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <RecipeCard meal={mockMeal} />
          </BrowserRouter>
        </QueryClientProvider>
      )

      const recipeLink = screen.getByRole('link')
      expect(recipeLink).toHaveAttribute('href', '/recipe/52772')
    })
  })

  describe('Component Interaction', () => {
    it('should handle search and recipe card integration', async () => {
      render(
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <div>
              <SearchBar />
              <RecipeCard meal={{
                id: '52772',
                strMeal: 'Teriyaki Chicken Casserole',
                strMealThumb: 'https://www.themealdb.com/images/media/meals/wvpspp1468256329.jpg',
                strArea: 'Japanese',
                strCategory: 'Chicken'
              }} />
            </div>
          </BrowserRouter>
        </QueryClientProvider>
      )

      const searchInput = screen.getByPlaceholderText('Search for recipes...')
      fireEvent.change(searchInput, { target: { value: 'chicken' } })

      await waitFor(() => {
        expect(screen.getByText('Teriyaki Chicken Casserole')).toBeInTheDocument()
      })

      // Both search suggestion and recipe card should show the same meal
      expect(screen.getAllByText('Teriyaki Chicken Casserole')).toHaveLength(2)
    })
  })
})

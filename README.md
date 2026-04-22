# FlavorWorld - Recipe Discovery Web Application

A modern, full-stack food recipe web application built with React + Vite that helps users discover, save, and plan delicious recipes from around the world.

## Features

### Core Functionality
- **Recipe Search**: Real-time search with autocomplete suggestions
- **Recipe Variants**: Browse multiple variants of popular dishes (pizza, pasta, etc.)
- **Recipe Details**: Complete recipes with ingredients, instructions, and YouTube video integration
- **Meal Planning**: Weekly meal planner with calorie tracking and nutrition goals
- **Recipe Collections**: Save favorite recipes and create custom meal plans

### Advanced Features
- **Dark/Light Mode**: Toggle between themes with persistent storage
- **PWA Support**: Install as a native app with offline capabilities
- **PDF Export**: Export meal plans and shopping lists as PDF documents
- **Responsive Design**: Mobile-first design with collapsible sidebar
- **Framer Motion Animations**: Smooth page transitions and micro-interactions
- **Indian Cuisine Support**: Extensive database of North and South Indian recipes

### Search & Filtering
- **World Cuisines**: Filter by 25+ cuisines including Italian, Indian, Mexican, Japanese, etc.
- **Meal Categories**: Breakfast, Lunch, Dinner, Dessert, Starter, Side, Snack
- **Dietary Filters**: Vegetarian, Vegan, Gluten-Free, High-Protein options
- **Ingredient-Based Search**: Find recipes based on available ingredients

## Technology Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** with custom design system
- **Framer Motion** for animations
- **React Router v6** for navigation
- **Zustand** for state management
- **React Query** for data fetching and caching

### APIs & Data
- **TheMealDB API** (free tier) for recipe data
- **YouTube Data API v3** for video integration (optional API key)
- **Custom calorie database** with 200+ recipes including Indian cuisine

### Development Tools
- **PostCSS** with Autoprefixer
- **Google Fonts** (Playfair Display + DM Sans)
- **Lucide React** for icons
- **jsPDF + html2canvas** for PDF export

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd flavorworld
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production
```bash
npm run build
npm run preview
```

## Configuration

### YouTube API (Optional)
For YouTube video integration, add your API key:
1. Create a `.env` file in the root directory
2. Add: `REACT_APP_YOUTUBE_API_KEY=your_api_key_here`
3. Get your API key from [Google Cloud Console](https://console.developers.google.com/)

### Environment Variables
- `REACT_APP_YOUTUBE_API_KEY`: YouTube Data API v3 key (optional)

## Project Structure

```
src/
  api/
    mealdb.js          # MealDB API integration
    youtube.js         # YouTube API integration
  components/
    layout/
      Navbar.jsx       # Navigation bar
      Sidebar.jsx      # Filter sidebar
    recipe/
      RecipeCard.jsx   # Recipe card component
      RecipeGrid.jsx   # Recipe grid layout
    search/
      SearchBar.jsx    # Search with autocomplete
  pages/
    Home.jsx           # Home page with hero
    Variants.jsx       # Recipe variants page
    RecipeDetail.jsx   # Detailed recipe view
    Planner.jsx        # Meal planner
  store/
    useFilterStore.js  # Filter state management
    usePlannerStore.js # Meal planner state
    useThemeStore.js   # Theme management
  utils/
    calorieUtils.js    # Nutrition calculations
    pdfExport.js       # PDF export functionality
  data/
    calorieMap.json    # Calorie database
  styles/
    globals.css        # Global styles and design system
```

## Design System

### Colors
- **Primary**: `#e8a045` (Amber/Saffron)
- **Background**: `#f8f9fa` (Light mode) / `#0f0d0a` (Dark mode)
- **Surface**: `#ffffff` (Light mode) / `#1a1612` (Dark mode)
- **Text**: `#212529` (Light mode) / `#f5efe6` (Dark mode)

### Typography
- **Display**: Playfair Display (headings)
- **Body**: DM Sans (content)
- **Weights**: 400, 500, 600, 700

### Responsive Breakpoints
- Mobile: `0px - 768px`
- Tablet: `768px - 1024px`
- Desktop: `1024px+`

## API Integration

### TheMealDB API
- **Base URL**: `https://www.themealdb.com/api/json/v1/1/`
- **Endpoints**: Search, filter by category/area/ingredient, random meals
- **Rate Limit**: No API key required for basic usage

### YouTube Data API
- **Purpose**: Recipe video integration
- **Optional**: Works without API key (shows search links instead)
- **Features**: Top 3 video results per recipe

## Features in Detail

### Meal Planner
- **Goal Setting**: Bulk (gain) or Cut (lose) weight modes
- **Calorie Calculation**: Based on Mifflin-St Jeor formula
- **Weekly Planning**: Drag-and-drop meal organization
- **Progress Tracking**: Visual progress bars and nutrition charts
- **Export Options**: PDF meal plans and shopping lists

### Recipe Database
- **200+ Recipes**: Including North and South Indian cuisine
- **Nutrition Data**: Calories, protein, carbs, fat per serving
- **Cooking Times**: Estimated based on meal category
- **Ingredient Images**: High-quality ingredient thumbnails

### User Experience
- **Skeleton Loading**: Smooth loading states
- **Stagger Animations**: Card entrance animations
- **Hover Effects**: Interactive UI feedback
- **Offline Support**: PWA with service worker
- **Print Styles**: Clean recipe printing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [TheMealDB](https://www.themealdb.com/) for recipe data
- [YouTube Data API](https://developers.google.com/youtube) for video integration
- [Tailwind CSS](https://tailwindcss.com/) for styling framework
- [Framer Motion](https://www.framer.com/motion/) for animations

## Support

For issues and feature requests, please open an issue on the GitHub repository.

---

**FlavorWorld** - Discover, Plan, and Enjoy Great Food!

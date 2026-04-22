import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/layout/Navbar'
import { Sidebar } from './components/layout/Sidebar'
import { Home } from './pages/Home'
import { Variants } from './pages/Variants'
import { RecipeDetail } from './pages/RecipeDetail'
import { Planner } from './pages/Planner'
import { useFilterStore } from './store/useFilterStore'

function App() {
  const { isSidebarOpen } = useFilterStore()

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/variants" element={<Variants />} />
            <Route path="/recipe/:id" element={<RecipeDetail />} />
            <Route path="/meal/:query" element={<Variants />} />
            <Route path="/planner" element={<Planner />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App

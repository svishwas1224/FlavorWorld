import { Link } from 'react-router-dom'
import { Search, Moon, Sun, Menu, X } from 'lucide-react'
import { useThemeStore } from '../../store/useThemeStore'
import { useFilterStore } from '../../store/useFilterStore'

const Navbar = () => {
  const { isDark, toggleTheme } = useThemeStore()
  const { isSidebarOpen, toggleSidebar } = useFilterStore()

  return (
    <nav className="bg-surface border-b border-border px-6 py-4 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="font-display text-xl font-bold">FlavorWorld</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/planner"
            className="text-text-muted hover:text-text transition-colors"
          >
            Meal Planner
          </Link>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar

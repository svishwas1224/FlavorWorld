import { useState } from 'react'
import { motion } from 'framer-motion'
import { Target, TrendingUp, Calendar, Plus, Download, ShoppingCart } from 'lucide-react'
import { usePlannerStore, DAYS_OF_WEEK, MEAL_TYPES } from '../store/usePlannerStore'
import { exportMealPlanAsPDF, exportShoppingListAsPDF } from '../utils/pdfExport'

const Planner = () => {
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  
  const {
    goal,
    currentWeight,
    targetWeight,
    weeksToGoal,
    dailyCalorieTarget,
    weeklyPlan,
    savedRecipes,
    setGoal,
    setWeightData,
    calculateDailyCalories,
    addMealToPlan,
    getDailyCalories,
    getWeeklyNutrition
  } = usePlannerStore()

  const handleGoalSetup = () => {
    calculateDailyCalories()
    setGoalModalOpen(false)
  }

  const handleExportMealPlan = async () => {
    try {
      await exportMealPlanAsPDF(weeklyPlan, weekNutrition)
    } catch (error) {
      console.error('Error exporting meal plan:', error)
    }
  }

  const handleExportShoppingList = async () => {
    try {
      // Collect all ingredients from planned meals
      const allIngredients = []
      Object.values(weeklyPlan).forEach(dayPlan => {
        Object.values(dayPlan).forEach(meals => {
          meals.forEach(meal => {
            // This would need to be implemented to extract ingredients from meals
            // For now, we'll create a sample shopping list
          })
        })
      })
      
      await exportShoppingListAsPDF(allIngredients)
    } catch (error) {
      console.error('Error exporting shopping list:', error)
    }
  }

  const todayCalories = getDailyCalories(selectedDay)
  const weekNutrition = getWeeklyNutrition()

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="font-display text-4xl font-bold mb-4">Meal Planner</h1>
        <p className="text-text-muted mb-6">
          Plan your meals for the week and track your nutrition goals
        </p>

        {/* Goal Setup */}
        <div className="bg-surface border border-border rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Target size={24} className={goal === 'bulk' ? 'text-green-500' : 'text-red-500'} />
              <div>
                <h3 className="font-semibold">
                  {goal === 'bulk' ? 'Bulk (Gain Weight)' : 'Cut (Lose Weight)'}
                </h3>
                <p className="text-sm text-text-muted">
                  Daily Target: {dailyCalorieTarget} kcal
                </p>
              </div>
            </div>
            <button
              onClick={() => setGoalModalOpen(true)}
              className="btn-secondary"
            >
              Setup Goals
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Today: {todayCalories} kcal</span>
              <span>{dailyCalorieTarget} kcal</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all ${
                  todayCalories > dailyCalorieTarget ? 'bg-red-500' : 
                  todayCalories > dailyCalorieTarget * 0.8 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${Math.min((todayCalories / dailyCalorieTarget) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Week Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                selectedDay === day
                  ? 'bg-accent text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar size={16} className="inline mr-2" />
              {day}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Meal Plan Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {MEAL_TYPES.map(mealType => (
            <div key={mealType} className="bg-surface border border-border rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center justify-between">
                {mealType}
                <button className="p-1 rounded hover:bg-gray-100">
                  <Plus size={16} />
                </button>
              </h3>
              
              <div className="space-y-2 min-h-[100px]">
                {weeklyPlan[selectedDay]?.[mealType]?.map((meal, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-2 text-sm">
                    <div className="font-medium">{meal.strMeal}</div>
                    <div className="text-text-muted">
                      {meal.calories || 350} kcal · {meal.servings || 1} serving
                    </div>
                  </div>
                ))}
                {(!weeklyPlan[selectedDay]?.[mealType] || weeklyPlan[selectedDay][mealType].length === 0) && (
                  <div className="text-center text-text-muted py-4 text-sm">
                    No meals planned
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Saved Recipes */}
      {savedRecipes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="font-display text-2xl font-bold mb-4">Saved Recipes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRecipes.slice(0, 6).map(recipe => (
              <div key={recipe.id} className="card p-4">
                <div className="flex items-center gap-3">
                  {recipe.strMealThumb && (
                    <img
                      src={recipe.strMealThumb}
                      alt={recipe.strMeal}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <h4 className="font-medium">{recipe.strMeal}</h4>
                    <p className="text-sm text-text-muted">
                      {recipe.strArea} · {recipe.strCategory}
                    </p>
                  </div>
                  <button
                    onClick={() => addMealToPlan(selectedDay, 'Breakfast', recipe)}
                    className="p-2 rounded-lg bg-accent text-white hover:bg-accent-muted"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weekly Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-2xl font-bold flex items-center gap-2">
            <TrendingUp size={24} />
            Weekly Summary
          </h3>
          <div className="flex gap-2">
            <button
              onClick={handleExportMealPlan}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <Download size={16} />
              Export PDF
            </button>
            <button
              onClick={handleExportShoppingList}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ShoppingCart size={16} />
              Shopping List
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="font-semibold mb-2">Avg Daily Calories</h4>
            <p className="text-2xl font-bold text-accent">{weekNutrition.avgDailyCalories}</p>
            <p className="text-sm text-text-muted">kcal per day</p>
          </div>
          
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="font-semibold mb-2">Total Calories</h4>
            <p className="text-2xl font-bold">{weekNutrition.totalCalories}</p>
            <p className="text-sm text-text-muted">this week</p>
          </div>
          
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="font-semibold mb-2">Goal Progress</h4>
            <p className="text-2xl font-bold text-green-500">85%</p>
            <p className="text-sm text-text-muted">on track</p>
          </div>
          
          <div className="bg-surface border border-border rounded-xl p-4">
            <h4 className="font-semibold mb-2">Weight Change</h4>
            <p className="text-2xl font-bold">+0.5 kg</p>
            <p className="text-sm text-text-muted">this week</p>
          </div>
        </div>
      </motion.div>

      {/* Goal Setup Modal */}
      {goalModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="font-display text-xl font-bold mb-4">Setup Your Goals</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Goal Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setGoal('bulk')}
                    className={`p-3 rounded-lg border transition-colors ${
                      goal === 'bulk' 
                        ? 'border-accent bg-accent/10 text-accent' 
                        : 'border-border hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">Bulk</div>
                    <div className="text-xs text-text-muted">Gain weight</div>
                  </button>
                  <button
                    onClick={() => setGoal('cut')}
                    className={`p-3 rounded-lg border transition-colors ${
                      goal === 'cut' 
                        ? 'border-accent bg-accent/10 text-accent' 
                        : 'border-border hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-medium">Cut</div>
                    <div className="text-xs text-text-muted">Lose weight</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Weight (kg)</label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setWeightData(parseInt(e.target.value), targetWeight, weeksToGoal)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Weight (kg)</label>
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setWeightData(currentWeight, parseInt(e.target.value), weeksToGoal)}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Weeks to Goal</label>
                <input
                  type="number"
                  value={weeksToGoal}
                  onChange={(e) => setWeightData(currentWeight, targetWeight, parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-border rounded-lg"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => setGoalModalOpen(false)}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleGoalSetup}
                className="flex-1 btn-primary"
              >
                Save Goals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Planner

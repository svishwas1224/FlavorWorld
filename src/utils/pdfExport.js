import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export const exportMealPlanAsPDF = async (weeklyPlan, nutritionData) => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  
  // Add title
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('FlavorWorld Meal Plan', pageWidth / 2, 30, { align: 'center' })
  
  // Add date
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 45, { align: 'center' })
  
  let yPosition = 70
  
  // Add weekly summary
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Weekly Summary', 20, yPosition)
  
  yPosition += 15
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Average Daily Calories: ${nutritionData.avgDailyCalories} kcal`, 20, yPosition)
  yPosition += 10
  pdf.text(`Total Weekly Calories: ${nutritionData.totalCalories} kcal`, 20, yPosition)
  yPosition += 10
  pdf.text(`Goal Progress: On track`, 20, yPosition)
  
  yPosition += 25
  
  // Add daily meal plans
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  
  days.forEach(day => {
    if (yPosition > pageHeight - 40) {
      pdf.addPage()
      yPosition = 30
    }
    
    pdf.setFontSize(14)
    pdf.setFont('helvetica', 'bold')
    pdf.text(day, 20, yPosition)
    
    yPosition += 10
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    
    const dayPlan = weeklyPlan[day] || {}
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack']
    
    mealTypes.forEach(mealType => {
      const meals = dayPlan[mealType] || []
      if (meals.length > 0) {
        pdf.text(`${mealType}:`, 25, yPosition)
        yPosition += 7
        
        meals.forEach(meal => {
          if (yPosition > pageHeight - 20) {
            pdf.addPage()
            yPosition = 30
          }
          pdf.text(`  - ${meal.strMeal} (${meal.calories || 350} kcal)`, 30, yPosition)
          yPosition += 5
        })
        
        yPosition += 3
      }
    })
    
    yPosition += 10
  })
  
  // Add shopping list
  if (yPosition > pageHeight - 60) {
    pdf.addPage()
    yPosition = 30
  }
  
  pdf.setFontSize(16)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Shopping List', 20, yPosition)
  yPosition += 15
  
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text('Note: This is a sample shopping list. Please adjust quantities based on your meal plan.', 20, yPosition)
  
  // Save the PDF
  pdf.save('flavorworld-meal-plan.pdf')
}

export const exportShoppingListAsPDF = async (ingredients) => {
  const pdf = new jsPDF()
  const pageWidth = pdf.internal.pageSize.getWidth()
  
  // Add title
  pdf.setFontSize(24)
  pdf.setFont('helvetica', 'bold')
  pdf.text('Shopping List', pageWidth / 2, 30, { align: 'center' })
  
  // Add date
  pdf.setFontSize(12)
  pdf.setFont('helvetica', 'normal')
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, 45, { align: 'center' })
  
  let yPosition = 70
  
  // Group ingredients by category
  const categories = {
    'Produce': [],
    'Protein': [],
    'Dairy': [],
    'Grains': [],
    'Spices': [],
    'Other': []
  }
  
  ingredients.forEach(ingredient => {
    const name = ingredient.name.toLowerCase()
    let category = 'Other'
    
    if (name.includes('tomato') || name.includes('onion') || name.includes('garlic') || 
        name.includes('lettuce') || name.includes('carrot') || name.includes('potato')) {
      category = 'Produce'
    } else if (name.includes('chicken') || name.includes('beef') || name.includes('pork') || 
               name.includes('fish') || name.includes('egg') || name.includes('tofu')) {
      category = 'Protein'
    } else if (name.includes('milk') || name.includes('cheese') || name.includes('butter') || 
               name.includes('yogurt') || name.includes('cream')) {
      category = 'Dairy'
    } else if (name.includes('rice') || name.includes('pasta') || name.includes('bread') || 
               name.includes('flour')) {
      category = 'Grains'
    } else if (name.includes('salt') || name.includes('pepper') || name.includes('cumin') || 
               name.includes('paprika') || name.includes('oregano')) {
      category = 'Spices'
    }
    
    categories[category].push(ingredient)
  })
  
  // Add ingredients by category
  Object.entries(categories).forEach(([category, items]) => {
    if (items.length > 0) {
      pdf.setFontSize(14)
      pdf.setFont('helvetica', 'bold')
      pdf.text(category, 20, yPosition)
      
      yPosition += 10
      pdf.setFontSize(12)
      pdf.setFont('helvetica', 'normal')
      
      items.forEach(item => {
        pdf.text(`- ${item.measure} ${item.name}`, 25, yPosition)
        yPosition += 7
      })
      
      yPosition += 5
    }
  })
  
  // Save the PDF
  pdf.save('shopping-list.pdf')
}

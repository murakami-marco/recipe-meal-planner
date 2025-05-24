const express = require('express');
const router = express.Router();
const Recipe = require('./models/recipe');
const MealPlan = require('./models/meal_plan');

router.use(express.json());

/*
GET @ /api/recipes
Returns all recipes with optional category filtering
Query Parameters:
- category: (optional) Filter recipes by category (e.g., breakfast, lunch, dinner)
Expected format:
  [
    {
        "id": 1,
        "name": "Pasta Carbonara",
        "category": "dinner",
        "instructions": "1. Cook pasta. 2. Mix eggs and cheese. 3. Combine with pasta.",
        "ingredients": "Pasta, Eggs, Cheese, Bacon",
        "prep_time": 30
    },
    .
    .
  ]
*/
router.get('/recipes', async (req, res) => {
  try {
    const { category } = req.query;
    const recipes = await Recipe.getAll(category);
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve recipes' });
  }
});

/*
GET @ /api/recipes/id
Returns single recipe
Expected Format:
    {
        "id": 1,
        "name": "Pasta Carbonara",
        "category": "dinner",
        "instructions": "1. Cook pasta. 2. Mix eggs and cheese. 3. Combine with pasta.",
        "ingredients": "Pasta, Eggs, Cheese, Bacon",
        "prep_time": 30
    }
NOTE: If the recipe with id is not found, return status 404 with message 'Recipe not found'
*/
router.get('/recipes/:id', async (req, res) => {
  try {
    const recipe = await Recipe.getById(req.params.id);
    res.json(recipe);
  } catch (err) {
    if (err.message === 'Recipe not found') {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.status(500).json({ error: 'Failed to retrieve recipe' });
  }
});

/*
POST @ /api/recipes
Add a new recipe
Req body Example:
{
    "name": "Avocado Toast",
    "category": "breakfast",
    "instructions": "1. Toast bread. 2. Mash avocado. 3. Spread on toast. 4. Season.",
    "ingredients": "Bread, Avocado, Salt, Pepper, Lemon juice",
    "prep_time": 10
}
Response:
{
    "message": "Recipe added successfully",
    "recipe": 
        {
            "id": 3,
            "name": "Avocado Toast",
            "category": "breakfast",
            "instructions": "1. Toast bread. 2. Mash avocado. 3. Spread on toast. 4. Season.",
            "ingredients": "Bread, Avocado, Salt, Pepper, Lemon juice",
            "prep_time": 10
        }
}
*/
router.post('/recipes', async (req, res) => {
  try {
    console.log('Received request to create recipe:', req.body);

    const { name, category, instructions, ingredients, prep_time } = req.body;
    if (!name || !category || !instructions || !ingredients || prep_time === undefined) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'category', 'instructions', 'ingredients', 'prep_time'],
      });
    }

    const recipe = await Recipe.create({
      name,
      category,
      instructions,
      ingredients,
      prep_time: parseInt(prep_time, 10),
    });

    res.status(201).json({
      message: 'Recipe added successfully',
      recipe,
    });
  } catch (err) {
    if (err.status === 400) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({
      error: 'Failed to create recipe',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
});

/*
POST @ /api/meal-plans
Create a new meal plan
Req body Example:
{
    "name": "Week of June 5",
    "date": "2023-06-05",
    "recipe_ids": [1, 2],
    "notes": "Focus on quick meals this week"
}
Response:
{
    "message": "Meal plan created successfully",
    "meal_plan": 
        {
            "id": 1,
            "name": "Week of June 5",
            "date": "2023-06-05",
            "recipe_ids": "[1,2]",
            "notes": "Focus on quick meals this week"
        }
}
*/
router.post('/meal-plans', async (req, res) => {
  try {
    const { name, date, recipe_ids, notes = '' } = req.body;

    if (!name || !date || !recipe_ids || !Array.isArray(recipe_ids)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const mealPlan = await MealPlan.create({ name, date, recipe_ids, notes });
    res.status(201).json({
      message: 'Meal plan created successfully',
      meal_plan: mealPlan,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create meal plan' });
  }
});

/*
GET @ /api/meal-plans
Returns all meal plans
Expected format:
  [
    {
        "id": 1,
        "name": "Week of June 5",
        "date": "2023-06-05",
        "recipe_ids": "[1,2]",
        "notes": "Focus on quick meals this week"
    },
    .
    .
  ]
*/
router.get('/meal-plans', async (req, res) => {
  try {
    const mealPlans = await MealPlan.getAll();
    res.json(mealPlans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve meal plans' });
  }
});

/*
DELETE @ api/meal-plans/id
Delete a meal plan
Response:
{
    "message": "Meal plan deleted successfully"
}
NOTE: If the meal plan with id is not found, return status 400 with error message.
*/
router.delete('/meal-plans/:id', async (req, res) => {
  try {
    const result = await MealPlan.delete(req.params.id);
    res.json(result);
  } catch (err) {
    if (err.message === 'Meal plan not found') {
      return res.status(400).json({ error: 'Meal plan not found' });
    }
    res.status(500).json({ error: 'Failed to delete meal plan' });
  }
});

module.exports = router;

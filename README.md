# Recipe and Meal Planner API


The server will start on `http://localhost:8000` by default.

## API Endpoints

### Recipes

#### Get All Recipes
- **URL**: `/api/recipes`
- **Method**: `GET`
- **Query Parameters**:
  - `category` (optional): Filter recipes by category (e.g., breakfast, lunch, dinner)
- **Response**: Array of recipe objects

#### Get Single Recipe
- **URL**: `/api/recipes/:id`
- **Method**: `GET`
- **URL Parameters**:
  - `id`: ID of the recipe to retrieve
- **Response**: Single recipe object

#### Create New Recipe
- **URL**: `/api/recipes`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Recipe Name",
    "category": "category",
    "instructions": "steps to prepare the dish",
    "ingredients": "list of ingredients",
    "prep_time": 30
  }
  ```
- **Response**: Created recipe object

### Meal-Plans

#### Get All Meal Plans
- **URL**: `/api/meal-plans`
- **Method**: `GET`
- **Response**: Array of meal plan objects

#### Create New Meal Plan
- **URL**: `/api/meal-plans`
- **Method**: `POST`
- **Request Body**:
  ```json
  {
    "name": "Week of June 5",
    "date": "2023-06-05",
    "recipe_ids": [1, 2, 3],
    "notes": "Optional notes about the meal plan"
  }
  ```
- **Response**: Created meal plan object

#### Delete Meal Plan
- **URL**: `/api/meal-plans/:id`
- **Method**: `DELETE`
- **URL Parameters**:
  - `id`: ID of the meal plan to delete
- **Response**: Success message
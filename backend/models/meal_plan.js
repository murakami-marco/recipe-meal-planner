const { db } = require('../database');

class MealPlan {
  static async getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM meal_plans', [], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
  
  static async create({ name, date, recipe_ids, notes = '' }) {
    return new Promise((resolve, reject) => {
      const sql = 'INSERT INTO meal_plans (name, date, recipe_ids, notes) VALUES (?, ?, ?, ?)';
      const recipeIdsString = JSON.stringify(recipe_ids);
      const params = [name, date, recipeIdsString, notes];
      
      db.run(sql, params, function(err) {
        if (err) return reject(err);
        
        db.get('SELECT * FROM meal_plans WHERE id = ?', [this.lastID], (err, row) => {
          if (err) reject(err);
          else resolve(row);
        });
      });
    });
  }
  
  static async delete(id) {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM meal_plans WHERE id = ?', [id], function(err) {
        if (err) return reject(err);
        if (this.changes === 0) {
          return reject(new Error('Meal plan not found'));
        }
        resolve({ message: 'Meal plan deleted successfully' });
      });
    });
  }
}

module.exports = MealPlan;

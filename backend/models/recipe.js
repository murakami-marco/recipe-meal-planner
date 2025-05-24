const { db } = require('../database');

class Recipe {
  static async getAll(category = null) {
    console.log('Getting all recipes' + (category ? ` in category: ${category}` : ''));
    return new Promise((resolve, reject) => {
      try {
        let sql = 'SELECT * FROM recipes';
        const params = [];
        
        if (category) {
          sql += ' WHERE category = ?';
          params.push(category);
        }
        
        db.all(sql, params, (err, rows) => {
          if (err) {
            console.error('Error in Recipe.getAll:', err);
            return reject(err);
          }
          console.log(`Found ${rows ? rows.length : 0} recipes`);
          resolve(rows || []);
        });
      } catch (error) {
        console.error('Unexpected error in Recipe.getAll:', error);
        reject(error);
      }
    });
  }
  
  static async getById(id) {
    console.log(`Getting recipe with id: ${id}`);
    return new Promise((resolve, reject) => {
      try {
        db.get('SELECT * FROM recipes WHERE id = ?', [id], (err, row) => {
          if (err) {
            console.error('Error in Recipe.getById:', err);
            return reject(err);
          }
          if (!row) {
            console.log(`Recipe with id ${id} not found`);
            return reject(new Error('Recipe not found'));
          }
          console.log(`Found recipe: ${row.name}`);
          resolve(row);
        });
      } catch (error) {
        console.error('Unexpected error in Recipe.getById:', error);
        reject(error);
      }
    });
  }
  
  static async create({ name, category, instructions, ingredients, prep_time }) {
    console.log('Creating new recipe:', { name, category, prep_time });
    return new Promise((resolve, reject) => {
      try {
        // Validate required fields
        if (!name || !category || !instructions || !ingredients || prep_time === undefined) {
          const error = new Error('Missing required fields');
          error.status = 400;
          throw error;
        }

        const sql = 'INSERT INTO recipes (name, category, instructions, ingredients, prep_time) VALUES (?, ?, ?, ?, ?)';
        const params = [name, category, instructions, ingredients, prep_time];
        
        console.log('Executing SQL:', sql, params);
        
        db.run(sql, params, function(err) {
          if (err) {
            console.error('Error in Recipe.create (run):', err);
            return reject(err);
          }
          
          const lastId = this.lastID;
          console.log('Insert successful, lastID:', lastId);
          
          db.get('SELECT * FROM recipes WHERE id = ?', [lastId], (err, row) => {
            if (err) {
              console.error('Error in Recipe.create (get):', err);
              return reject(err);
            }
            if (!row) {
              const error = new Error('Failed to retrieve created recipe');
              console.error(error.message);
              return reject(error);
            }
            console.log('Successfully created recipe:', row);
            resolve(row);
          });
        });
      } catch (error) {
        console.error('Unexpected error in Recipe.create:', error);
        reject(error);
      }
    });
  }
}

module.exports = Recipe;

import pool from '../db.js';

class Task {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id');
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);
    return rows[0] || null;
  }

  static async create(data) {
    const { title, description, difficulty, tags = [], examples = [], materials = [], createdBy } = data;
    const { rows } = await pool.query(
      `INSERT INTO tasks (title, description, difficulty, tags, examples, materials, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [title, description, difficulty, tags, examples, materials, createdBy]
    );
    return rows[0];
  }

  static async update(id, data) {
    // Пример простой реализации: только обновление title/description/difficulty/tags/examples/materials
    const fields = ['title', 'description', 'difficulty', 'tags', 'examples', 'materials'];
    const updates = [];
    const values = [];
    let idx = 1;
    for (const field of fields) {
      if (data[field] !== undefined) {
        updates.push(`${field} = $${idx}`);
        values.push(data[field]);
        idx++;
      }
    }
    if (!updates.length) return await Task.getById(id);
    values.push(id);
    const { rows } = await pool.query(
      `UPDATE tasks SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    return rows[0];
  }

  static async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return rowCount > 0;
  }
}

export default Task; 
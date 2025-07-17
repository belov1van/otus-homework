import pool from '../db.js';

class Submission {
  static async create({ userId, taskId, code, status = 'pending' }) {
    const { rows } = await pool.query(
      `INSERT INTO submissions (user_id, task_id, code, status)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, taskId, code, status]
    );
    return rows[0];
  }

  static async getByTask(taskId) {
    const { rows } = await pool.query(
      `SELECT * FROM submissions WHERE task_id = $1 ORDER BY created_at DESC`,
      [taskId]
    );
    return rows;
  }

  static async getByUser(userId) {
    const { rows } = await pool.query(
      `SELECT * FROM submissions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return rows;
  }

  static async getById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM submissions WHERE id = $1`,
      [id]
    );
    return rows[0] || null;
  }

  static async updateStatus(id, status) {
    const { rows } = await pool.query(
      `UPDATE submissions SET status = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id, status]
    );
    return rows[0];
  }
}

export default Submission; 
import pool from '../db.js';

class TaskRating {
  static async setOrUpdate(userId, taskId, value) {
    // upsert
    const { rows } = await pool.query(
      `INSERT INTO task_ratings (user_id, task_id, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, task_id)
       DO UPDATE SET value = $3, created_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [userId, taskId, value]
    );
    return rows[0];
  }

  static async getAvg(taskId) {
    const { rows } = await pool.query(
      `SELECT AVG(value)::float AS avg, COUNT(*) AS count
       FROM task_ratings WHERE task_id = $1`,
      [taskId]
    );
    return rows[0];
  }

  static async getUserRating(userId, taskId) {
    const { rows } = await pool.query(
      `SELECT value FROM task_ratings WHERE user_id = $1 AND task_id = $2`,
      [userId, taskId]
    );
    return rows[0]?.value || null;
  }
}

export default TaskRating; 
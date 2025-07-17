import pool from '../db.js';

class Comment {
  static async getByTask(taskId) {
    const { rows } = await pool.query(
      `SELECT c.id, c.text, c.created_at, c.user_id, u.username
       FROM comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.task_id = $1
       ORDER BY c.created_at`,
      [taskId]
    );
    return rows;
  }

  static async create({ userId, taskId, text }) {
    const { rows } = await pool.query(
      `INSERT INTO comments (user_id, task_id, text)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, taskId, text]
    );
    return rows[0];
  }

  static async delete(id, userId, isAdmin) {
    // Только автор или админ может удалить
    const { rows } = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
    const comment = rows[0];
    if (!comment) return false;
    if (!isAdmin && comment.user_id !== userId) return false;
    await pool.query('DELETE FROM comments WHERE id = $1', [id]);
    return true;
  }
}

export default Comment; 
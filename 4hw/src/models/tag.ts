import pool from '../db.js';

class Tag {
  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM tags ORDER BY name');
    return rows;
  }

  static async create(name) {
    const { rows } = await pool.query('INSERT INTO tags (name) VALUES ($1) RETURNING *', [name]);
    return rows[0];
  }

  static async delete(id) {
    const { rowCount } = await pool.query('DELETE FROM tags WHERE id = $1', [id]);
    return rowCount > 0;
  }

  static async addTagToTask(taskId, tagId) {
    await pool.query('INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING', [taskId, tagId]);
  }

  static async removeTagFromTask(taskId, tagId) {
    await pool.query('DELETE FROM task_tags WHERE task_id = $1 AND tag_id = $2', [taskId, tagId]);
  }

  static async getTagsForTask(taskId) {
    const { rows } = await pool.query(
      `SELECT t.id, t.name FROM tags t
       JOIN task_tags tt ON t.id = tt.tag_id
       WHERE tt.task_id = $1`,
      [taskId]
    );
    return rows;
  }
}

export default Tag; 
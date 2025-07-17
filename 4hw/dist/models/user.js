import pool from '../db.js';
class User {
    static async create({ username, email, passwordHash, role = 'user' }) {
        const { rows } = await pool.query(`INSERT INTO users (username, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       RETURNING *`, [username, email, passwordHash, role]);
        return rows[0];
    }
    static async findByEmail(email) {
        const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return rows[0] || null;
    }
    static async findById(id) {
        const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return rows[0] || null;
    }
    static async findAll() {
        const { rows } = await pool.query('SELECT id, username, email, role, rating, created_at, updated_at FROM users ORDER BY id');
        return rows;
    }
    static async update(id, data) {
        const fields = ['username', 'email', 'password_hash', 'role', 'rating'];
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
        if (!updates.length)
            return await User.findById(id);
        values.push(id);
        const { rows } = await pool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = $${idx} RETURNING *`, values);
        return rows[0];
    }
    static async delete(id) {
        const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return rowCount > 0;
    }
}
export default User;

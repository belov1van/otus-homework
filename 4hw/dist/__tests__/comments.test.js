import request from 'supertest';
import express from 'express';
import routes from '../routes/index.js';
import pool from '../db.js';
const app = express();
app.use(express.json());
app.use('/api', routes);
let adminToken, userToken, userId, taskId, commentId;
beforeAll(async () => {
    // Очистить таблицы
    await pool.query('DELETE FROM comments');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');
    // Создать админа
    await request(app)
        .post('/api/auth/register')
        .send({ username: 'admin', email: 'admin@example.com', password: 'adminpass' });
    await pool.query("UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'");
    const loginAdmin = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@example.com', password: 'adminpass' });
    adminToken = loginAdmin.body.token;
    // Создать пользователя
    const resUser = await request(app)
        .post('/api/auth/register')
        .send({ username: 'user1', email: 'user1@example.com', password: 'userpass' });
    userId = resUser.body.id;
    const loginUser = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user1@example.com', password: 'userpass' });
    userToken = loginUser.body.token;
    // Создать задачу
    const resTask = await pool.query(`INSERT INTO tasks (title, description, difficulty, tags, examples, materials, created_by)
     VALUES ('Test task', 'desc', 'easy', '{}', '[]', '{}', $1) RETURNING *`, [userId]);
    taskId = resTask.rows[0].id;
});
afterAll(async () => {
    await pool.end();
});
describe('Comments API', () => {
    test('User can create comment', async () => {
        const res = await request(app)
            .post(`/api/comments/${taskId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ text: 'Nice task!' });
        expect(res.statusCode).toBe(201);
        expect(res.body.text).toBe('Nice task!');
        commentId = res.body.id;
    });
    test('Anyone can get comments for a task', async () => {
        const res = await request(app)
            .get(`/api/comments/${taskId}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
    test('Author can delete own comment', async () => {
        const res = await request(app)
            .delete(`/api/comments/${commentId}`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(204);
    });
    test('Non-author cannot delete comment', async () => {
        // Создать новый комментарий от user1
        const resComment = await request(app)
            .post(`/api/comments/${taskId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ text: 'Another comment' });
        const newCommentId = resComment.body.id;
        // Попробовать удалить как админ (разрешено)
        const resAdmin = await request(app)
            .delete(`/api/comments/${newCommentId}`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(resAdmin.statusCode).toBe(204);
        // Попробовать удалить как другой пользователь (запрещено)
        // Создать второго пользователя
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'user2', email: 'user2@example.com', password: 'userpass2' });
        const loginUser2 = await request(app)
            .post('/api/auth/login')
            .send({ email: 'user2@example.com', password: 'userpass2' });
        const user2Token = loginUser2.body.token;
        // Новый комментарий от user1
        const resComment2 = await request(app)
            .post(`/api/comments/${taskId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ text: 'Third comment' });
        const comment2Id = resComment2.body.id;
        // user2 пытается удалить
        const resForbidden = await request(app)
            .delete(`/api/comments/${comment2Id}`)
            .set('Authorization', `Bearer ${user2Token}`);
        expect(resForbidden.statusCode).toBe(403);
    });
});

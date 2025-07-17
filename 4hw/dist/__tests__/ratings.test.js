import request from 'supertest';
import express from 'express';
import routes from '../routes/index.js';
import pool from '../db.js';
const app = express();
app.use(express.json());
app.use('/api', routes);
let userToken, userId, user2Token, taskId;
beforeAll(async () => {
    // Очистить таблицы
    await pool.query('DELETE FROM task_ratings');
    await pool.query('DELETE FROM tasks');
    await pool.query('DELETE FROM users');
    // Создать пользователя
    const resUser = await request(app)
        .post('/api/auth/register')
        .send({ username: 'user1', email: 'user1@example.com', password: 'userpass' });
    userId = resUser.body.id;
    const loginUser = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user1@example.com', password: 'userpass' });
    userToken = loginUser.body.token;
    // Создать второго пользователя
    await request(app)
        .post('/api/auth/register')
        .send({ username: 'user2', email: 'user2@example.com', password: 'userpass2' });
    const loginUser2 = await request(app)
        .post('/api/auth/login')
        .send({ email: 'user2@example.com', password: 'userpass2' });
    user2Token = loginUser2.body.token;
    // Создать задачу
    const resTask = await pool.query(`INSERT INTO tasks (title, description, difficulty, tags, examples, materials, created_by)
     VALUES ('Test task', 'desc', 'easy', '{}', '[]', '{}', $1) RETURNING *`, [userId]);
    taskId = resTask.rows[0].id;
});
afterAll(async () => {
    await pool.end();
});
describe('Ratings API', () => {
    test('User can set rating', async () => {
        const res = await request(app)
            .post(`/api/ratings/${taskId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ value: 4 });
        expect(res.statusCode).toBe(201);
        expect(res.body.value).toBe(4);
    });
    test('User can update rating', async () => {
        const res = await request(app)
            .post(`/api/ratings/${taskId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ value: 2 });
        expect(res.statusCode).toBe(201);
        expect(res.body.value).toBe(2);
    });
    test('User2 can set rating', async () => {
        const res = await request(app)
            .post(`/api/ratings/${taskId}`)
            .set('Authorization', `Bearer ${user2Token}`)
            .send({ value: 5 });
        expect(res.statusCode).toBe(201);
        expect(res.body.value).toBe(5);
    });
    test('Anyone can get average rating', async () => {
        const res = await request(app)
            .get(`/api/ratings/${taskId}`);
        expect(res.statusCode).toBe(200);
        expect(Number(res.body.avg)).toBeGreaterThan(0);
        expect(Number(res.body.count)).toBeGreaterThanOrEqual(2);
    });
    test('User can get own rating', async () => {
        const res = await request(app)
            .get(`/api/ratings/${taskId}/self`)
            .set('Authorization', `Bearer ${userToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.value).toBe(2);
    });
    test('Cannot set rating without auth', async () => {
        const res = await request(app)
            .post(`/api/ratings/${taskId}`)
            .send({ value: 3 });
        expect(res.statusCode).toBe(401);
    });
    test('Cannot set invalid rating', async () => {
        const res = await request(app)
            .post(`/api/ratings/${taskId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send({ value: 10 });
        expect(res.statusCode).toBe(400);
    });
});

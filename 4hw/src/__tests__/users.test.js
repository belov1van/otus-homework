import request from 'supertest';
import express from 'express';
import routes from '../routes/index.js';
import pool from '../db.js';

const app = express();
app.use(express.json());
app.use('/api', routes);

let adminToken, userToken, userId;

beforeAll(async () => {
  // Очистить таблицы и создать тестовых пользователей
  await pool.query('DELETE FROM users');
  // Создать админа
  const resAdmin = await request(app)
    .post('/api/auth/register')
    .send({ username: 'admin', email: 'admin@example.com', password: 'adminpass' });
  await pool.query("UPDATE users SET role = 'admin' WHERE email = 'admin@example.com'");
  // Логин админа
  const loginAdmin = await request(app)
    .post('/api/auth/login')
    .send({ email: 'admin@example.com', password: 'adminpass' });
  adminToken = loginAdmin.body.token;
  // Создать обычного пользователя
  const resUser = await request(app)
    .post('/api/auth/register')
    .send({ username: 'user1', email: 'user1@example.com', password: 'userpass' });
  userId = resUser.body.id;
  // Логин пользователя
  const loginUser = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user1@example.com', password: 'userpass' });
  userToken = loginUser.body.token;
});

afterAll(async () => {
  await pool.end();
});

describe('User API', () => {
  test('Admin can get all users', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('User can get own profile', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe('user1@example.com');
  });

  test('User cannot get other user profile', async () => {
    const res = await request(app)
      .get(`/api/users/${userId + 1}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('User can update own profile', async () => {
    const res = await request(app)
      .patch(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ username: 'user1new' });
    expect(res.statusCode).toBe(200);
    expect(res.body.username).toBe('user1new');
  });

  test('User can delete own profile', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(204);
  });
}); 
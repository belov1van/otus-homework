import request from 'supertest';
import express from 'express';
import routes from '../routes/index.js';
import pool from '../db.js';

const app = express();
app.use(express.json());
app.use('/api', routes);

let adminToken, interviewerToken, userToken, userId, taskId, submissionId;

beforeAll(async () => {
  // Очистить таблицы
  await pool.query('DELETE FROM submissions');
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
  // Создать интервьюера
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'interv', email: 'interv@example.com', password: 'intervpass' });
  await pool.query("UPDATE users SET role = 'interviewer' WHERE email = 'interv@example.com'");
  const loginInterv = await request(app)
    .post('/api/auth/login')
    .send({ email: 'interv@example.com', password: 'intervpass' });
  interviewerToken = loginInterv.body.token;
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
  const resTask = await pool.query(
    `INSERT INTO tasks (title, description, difficulty, tags, examples, materials, created_by)
     VALUES ('Test task', 'desc', 'easy', '{}', '[]', '{}', $1) RETURNING *`,
    [userId]
  );
  taskId = resTask.rows[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('Submissions API', () => {
  test('User can submit solution', async () => {
    const res = await request(app)
      .post(`/api/submissions/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ code: 'print(42)' });
    expect(res.statusCode).toBe(201);
    expect(res.body.code).toBe('print(42)');
    submissionId = res.body.id;
  });

  test('User can get own submissions', async () => {
    const res = await request(app)
      .get('/api/submissions/user/all')
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('Admin can get all submissions for a task', async () => {
    const res = await request(app)
      .get(`/api/submissions/${taskId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  test('Interviewer can update submission status', async () => {
    const res = await request(app)
      .patch(`/api/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${interviewerToken}`)
      .send({ status: 'accepted' });
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('accepted');
  });

  test('User cannot update submission status', async () => {
    const res = await request(app)
      .patch(`/api/submissions/${submissionId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'rejected' });
    expect(res.statusCode).toBe(403);
  });

  test('Cannot submit without code', async () => {
    const res = await request(app)
      .post(`/api/submissions/${taskId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({});
    expect(res.statusCode).toBe(400);
  });
}); 
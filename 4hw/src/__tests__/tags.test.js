import request from 'supertest';
import express from 'express';
import routes from '../routes/index.js';
import pool from '../db.js';

const app = express();
app.use(express.json());
app.use('/api', routes);

let adminToken, interviewerToken, userToken, taskId, tagId;

beforeAll(async () => {
  // Очистить таблицы
  await pool.query('DELETE FROM task_tags');
  await pool.query('DELETE FROM tags');
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
  // Создать обычного пользователя
  await request(app)
    .post('/api/auth/register')
    .send({ username: 'user1', email: 'user1@example.com', password: 'userpass' });
  const loginUser = await request(app)
    .post('/api/auth/login')
    .send({ email: 'user1@example.com', password: 'userpass' });
  userToken = loginUser.body.token;
  // Создать задачу
  const resTask = await pool.query(
    `INSERT INTO tasks (title, description, difficulty, tags, examples, materials, created_by)
     VALUES ('Test task', 'desc', 'easy', '{}', '[]', '{}', 1) RETURNING *`
  );
  taskId = resTask.rows[0].id;
});

afterAll(async () => {
  await pool.end();
});

describe('Tags API', () => {
  test('Admin can create tag', async () => {
    const res = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'algorithms' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('algorithms');
    tagId = res.body.id;
  });

  test('Interviewer can create tag', async () => {
    const res = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${interviewerToken}`)
      .send({ name: 'dp' });
    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe('dp');
  });

  test('User cannot create tag', async () => {
    const res = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'forbidden' });
    expect(res.statusCode).toBe(403);
  });

  test('Anyone can get all tags', async () => {
    const res = await request(app)
      .get('/api/tags');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  test('Admin can delete tag', async () => {
    const res = await request(app)
      .delete(`/api/tags/${tagId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(204);
  });

  test('Interviewer can add and remove tag to task', async () => {
    // Создать новый тег
    const resTag = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${interviewerToken}`)
      .send({ name: 'graphs' });
    const newTagId = resTag.body.id;
    // Привязать тег к задаче
    const resAdd = await request(app)
      .post(`/api/tags/${taskId}/${newTagId}`)
      .set('Authorization', `Bearer ${interviewerToken}`);
    expect(resAdd.statusCode).toBe(204);
    // Отвязать тег от задачи
    const resRemove = await request(app)
      .delete(`/api/tags/${taskId}/${newTagId}`)
      .set('Authorization', `Bearer ${interviewerToken}`);
    expect(resRemove.statusCode).toBe(204);
  });

  test('User cannot add tag to task', async () => {
    // Создать новый тег
    const resTag = await request(app)
      .post('/api/tags')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'forbidden2' });
    const newTagId = resTag.body.id;
    // Попробовать привязать тег к задаче
    const resAdd = await request(app)
      .post(`/api/tags/${taskId}/${newTagId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(resAdd.statusCode).toBe(403);
  });
}); 
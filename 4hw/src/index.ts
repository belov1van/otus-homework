import express from 'express';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.json({ message: 'LeetCode Clone API' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
import express from 'express';
import cors from 'cors';
import { router } from './router';
import { Gender } from './types';

const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong');
});


app.use('/api', router);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
export const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map(v => v.toString())
    .includes(gender);
};

import express from 'express';
import { calculateBMI } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const [weight, height] = [Number(req.query.weight), Number(req.query.height)];
  if (isNaN(weight) || isNaN(height)) {
    res.status(400).send({ error: 'malformated parameters' });
    return;
  }

  res.json({ weight: weight, height: height, bmi: calculateBMI(height, weight) });
  return;
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (
    typeof target !== 'number' ||
    !Array.isArray(daily_exercises) ||
    daily_exercises.some(v => typeof v !== 'number')
  ) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  res.json(calculateExercises(daily_exercises as number[], target));
  return;
});

app.listen(3003, () => {
  console.log('server running');
});

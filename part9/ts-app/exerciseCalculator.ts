interface ExerciseStats {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const getArgs = (args: string[]): [exerciseHours: number[], target: number] => {
  if (args.length < 4) {
    throw new Error('Two or more arguments needed. Last number is target');
  }

  const exerciseHours = args.slice(2, -1).map(n => Number(n));
  const target = Number(args.at(-1));

  [target, ...exerciseHours].forEach(element => {
    if (isNaN(element)) {
      throw new Error('Arguments are not numbers');
    }
  });

  return [exerciseHours, target];
};

export const calculateExercises = (
  exercieHours: number[],
  target: number
): ExerciseStats => {
  const scheme: Array<[dailyHours: number, rating: number, ratingDescription: string]> = [
    [0.25, 0, 'you should move more'],
    [0.5, 1, 'you exercise sometimes, but you are no athlete'],
    [1, 2, 'you exercise alot, this is nice'],
    [2, 3, 'you do lots of sport']
  ];

  const stats: ExerciseStats = {
    periodLength: exercieHours.length,
    trainingDays: exercieHours.filter(n => n !== 0).length,
    success: exercieHours.find(hours => hours < target) ? false : true,
    average:
      exercieHours.reduce((acc, currentValue) => acc + currentValue, 0) /
      exercieHours.length,
    target: target,
    rating: 0,
    ratingDescription: ''
  };

  const wasRatingSet = scheme.some(s => {
    const [dailyHours, rating, message] = s;
    if (stats.average < dailyHours) {
      stats.rating = rating;
      stats.ratingDescription = message;
      return true;
    }
    return false;
  });

  if (!wasRatingSet) {
    stats.rating = 4;
    stats.ratingDescription = 'you do so much sports wow';
  }

  return stats;
};

if (require.main === module) {
  console.log(calculateExercises(...getArgs(process.argv)));
}

const getArgs = (args: string[]): [height: number, weight: number] => {
  if (args.length !== 4) {
    throw new Error('Two arguments needed');
  }

  const [height, weight] = [Number(args[2]), Number(args[3])];

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('Given arguments are not numbers');
  }

  return [height, weight];
};

export const calculateBMI = (height: number, weight: number): string => {
  const bmi = weight / (height / 100) ** 2;
  if (bmi < 18.5) {
    return 'Underweight';
  }
  if (bmi < 25) {
    return 'Normal weight';
  }
  if (bmi < 30) {
    return 'Overweight';
  }
  return 'Obese';
};

if (require.main === module) {
  console.log(calculateBMI(...getArgs(process.argv)));
}

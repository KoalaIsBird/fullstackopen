import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const zodErrorMiddleware = (
  err: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err);
  if (err instanceof ZodError) {
    res.status(400).send({ error: err.issues });
    return;
  } else {
    next(err);
  }
};

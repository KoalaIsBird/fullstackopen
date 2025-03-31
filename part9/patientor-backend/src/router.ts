import { Response, Router } from 'express';
import { getCensoredPatients } from './services';
import { getDiagnoses } from './data/diagnoses';
import { CensoredPatient, Diagnosis, Patient, patientSchema } from './types';
import { v1 as uuid } from 'uuid';
import { addPatient } from './data/patients';
import { zodErrorMiddleware } from './middleware';

export const router = Router();
router.get('/diagnoses', (_req, res: Response<Diagnosis[]>) => {
  res.send(getDiagnoses());
});

router.get('/patients', (_req, res: Response<CensoredPatient[]>) => {
  res.send(getCensoredPatients());
});

router.post('/patients', (req, res: Response<Patient>) => {
  const patient: Patient = patientSchema.parse({ ...req.body, id: uuid() });
  addPatient(patient);
  res.json(patient);
});

router.use(zodErrorMiddleware);

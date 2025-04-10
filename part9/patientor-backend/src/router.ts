import { Response, Router } from 'express';
import { getCensoredPatients } from './services';
import { getDiagnoses } from './data/diagnoses';
import {
  CensoredPatient,
  Diagnosis,
  Entry,
  newEntrySchema,
  Patient,
  patientSchema
} from './types';
import { v1 as uuid } from 'uuid';
import { addEntry, addPatient, getPatients } from './data/patients';
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

router.get('/patients/:id', (req, res: Response<Patient | { error: string }>) => {
  const foundPatient = getPatients().find(p => p.id === req.params.id);
  if (!foundPatient) {
    res.status(404).json({ error: 'patient was not found' });
    return;
  }
  res.json(foundPatient);
  return;
});

router.post('/patients/:id/entries', (req, res: Response<Entry>) => {
  const newEntry = newEntrySchema.parse(req.body);
  res.json(addEntry(req.params.id, newEntry));
});

router.use(zodErrorMiddleware);

import { Response, Router } from 'express';
import { getCensoredPatients, getDiagnoses } from './services';
import { CensoredPatient, Diagnosis, Gender, Patient } from './types';
import { v1 as uuid } from 'uuid';
import { addPatient } from './data/patients';

export const router = Router();
router.get('/diagnoses', (_req, res: Response<Diagnosis[]>) => {
  res.send(getDiagnoses());
});

router.get('/patients', (_req, res: Response<CensoredPatient[]>) => {
  res.send(getCensoredPatients());
});

const isGender = (gender: string): gender is Gender => {
  return Object.values(Gender)
    .map(v => v.toString())
    .includes(gender);
};

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parsePatient = (patient: unknown): Patient => {
  if (!patient || typeof patient !== 'object') {
    throw new Error('data is not a json object');
  }

  if (
    'name' in patient === false ||
    'dateOfBirth' in patient === false ||
    'ssn' in patient === false ||
    'gender' in patient === false ||
    'occupation' in patient === false
  ) {
    throw new Error('some fields in given patient are lacking');
  }

  const { name, dateOfBirth, ssn, gender, occupation } = patient;

  if (
    !isString(name) ||
    !isString(dateOfBirth) ||
    !isString(ssn) ||
    !isString(occupation) ||
    !isString(gender) ||
    !isGender(gender)
  ) {
    throw new Error('bad input');
  }

  const parsedPatient: Patient = {
    name,
    dateOfBirth,
    ssn,
    gender,
    occupation,
    id: uuid()
  };

  return parsedPatient;
};

router.post('/patients', (req, res: Response<Patient>) => {
  const patient: Patient = parsePatient(req.body);
  addPatient(patient);
  res.json(patient);
});

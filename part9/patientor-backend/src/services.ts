import diagnoses from './data/diagnoses';
import { getPatients } from './data/patients';
import { CensoredPatient, Diagnosis } from './types';

export const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

export const getCensoredPatients = (): CensoredPatient[] => {
  return getPatients().map(({ dateOfBirth, gender, id, name, occupation }) => {
    return { dateOfBirth, gender, id, name, occupation };
  });
};

import { getPatients } from './data/patients';
import { CensoredPatient } from './types';

export const getCensoredPatients = (): CensoredPatient[] => {
  return getPatients().map(({ dateOfBirth, gender, id, name, occupation }) => {
    return { dateOfBirth, gender, id, name, occupation };
  });
};

import z, { nativeEnum, object, string } from 'zod';

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female'
}

export const patientSchema = object({
  id: string().uuid(),
  name: string(),
  dateOfBirth: string().date(),
  ssn: string(),
  gender: nativeEnum(Gender),
  occupation: string()
});

export type Patient = z.infer<typeof patientSchema>;

export type CensoredPatient = Omit<Patient, 'ssn'>;

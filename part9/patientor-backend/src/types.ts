import { z } from 'zod';

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3
}

export enum Gender {
  Male = 'male',
  Female = 'female'
}

// Diagnosis
const diagnosisCodeSchema = z.string();

export const diagnosisSchema = z.object({
  code: diagnosisCodeSchema,
  name: z.string(),
  latin: z.string().optional()
});

export type Diagnosis = z.infer<typeof diagnosisSchema>;

// Schema for entry
const baseEntrySchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(1),
  date: z.string().date().min(1),
  specialist: z.string().min(1),
  diagnosisCodes: diagnosisCodeSchema.array().optional()
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal('HealthCheck'),
  healthCheckRating: z.nativeEnum(HealthCheckRating)
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal('OccupationalHealthcare'),
  employerName: z.string().min(1),
  sickLeave: z
    .object({ startDate: z.string().date(), endDate: z.string().date() })
    .optional()
});

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal('Hospital'),
  discharge: z.object({ date: z.string().date(), criteria: z.string().min(1) })
});

export const entrySchema = z.discriminatedUnion('type', [
  healthCheckEntrySchema,
  occupationalHealthcareEntrySchema,
  hospitalEntrySchema
]);
export type Entry = z.infer<typeof entrySchema>;

export const newEntrySchema = z.discriminatedUnion('type', [
  healthCheckEntrySchema.omit({ id: true }),
  occupationalHealthcareEntrySchema.omit({ id: true }),
  hospitalEntrySchema.omit({ id: true })
]);
export type NewEntry = z.infer<typeof newEntrySchema>;

// Patient
export const patientSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: entrySchema.array()
});

export type Patient = z.infer<typeof patientSchema>;
export type CensoredPatient = Omit<Patient, 'ssn' | 'entries'>;

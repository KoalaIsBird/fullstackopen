import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { createContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Entry, HealthCheckRating } from '../types';
import { Diagnosis, Patient } from '../types';
import {
  Favorite,
  Female,
  LocalHospital,
  Male,
  MedicalInformation,
  Work
} from '@mui/icons-material';
import { green, orange, red, yellow } from '@mui/material/colors';
import { assertNever } from '../utils';
import { getDiagnoses, getPatient } from '../services';
import { HealthForm } from './HealthForm';

const EntryDetails = ({ entry }: { entry: Entry }) => {
  switch (entry.type) {
    case 'HealthCheck':
      const heartColor = (() => {
        switch (entry.healthCheckRating) {
          case HealthCheckRating.Healthy:
            return green[500];
          case HealthCheckRating.LowRisk:
            return yellow[500];
          case HealthCheckRating.HighRisk:
            return orange[500];
          case HealthCheckRating.CriticalRisk:
            return red[500];
          default:
            assertNever(entry.healthCheckRating);
        }
      })();

      return (
        <>
          {<Favorite style={{ color: heartColor }} />} {<MedicalInformation />}
        </>
      );

    case 'Hospital':
      return (
        <>
          <LocalHospital />
          <Typography>
            Discharged on {entry.discharge.date}. Reason: {entry.discharge.criteria}
          </Typography>
        </>
      );
    case 'OccupationalHealthcare':
      return (
        <>
          <Work />
          <Typography>Employer's name: {entry.employerName}</Typography>
          {entry.sickLeave?.startDate && entry.sickLeave.endDate ? (
            <Typography>
              Left work on: {entry.sickLeave?.startDate} and got back on:{' '}
              {entry.sickLeave?.endDate}
            </Typography>
          ) : null}
        </>
      );
    default:
      assertNever(entry);
  }
};

export const PatientContext = createContext<{ codes: string[] }>({ codes: [] });
export const PatientPage = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [diagnoses, setDiagnosises] = useState<Diagnosis[] | null>(null);
  const [formOpen, setFormOpen] = useState(false);

  const toggleForm = () => {
    setFormOpen(!formOpen);
  };

  useEffect(() => {
    getDiagnoses().then(ds => setDiagnosises(ds));
  }, []);

  useEffect(() => {
    if (!id) {
      return;
    }
    getPatient(id).then(p => setPatient(p));
  }, [id]);

  if (!patient || !diagnoses || !id) {
    return <>loading...</>;
  }

  return (
    <>
      <Card sx={{ marginTop: 2 }} variant='outlined'>
        <CardContent>
          <Stack direction='row' alignItems='center' gap={1}>
            <Typography variant='h5'>{patient.name}</Typography>
            {patient.gender === 'male' ? <Male /> : <Female />}
          </Stack>

          <Typography variant='body2' color='text.secondary'>
            SSN: {patient.ssn}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Born: {patient.dateOfBirth}
          </Typography>
          <Typography variant='body2' color='text.secondary'>
            Occupation: {patient.occupation}
          </Typography>
        </CardContent>
      </Card>

      <Typography marginY={1} variant='h5'>
        Entries:
      </Typography>
      <Button onClick={toggleForm} variant='contained' sx={{ marginBottom: 4 }}>
        {formOpen ? 'Close Form' : 'Add Entry'}
      </Button>

      {formOpen ? (
        <PatientContext.Provider value={{ codes: diagnoses.map(d => d.code) }}>
          <HealthForm
            patientId={id}
            addPatientEntry={entry =>
              setPatient({ ...patient, entries: patient.entries.concat(entry) })
            }
          />
        </PatientContext.Provider>
      ) : null}

      {patient.entries.map(e => (
        <Card key={e.id} variant='outlined'>
          <CardContent>
            <Typography variant='body1'>
              {e.date} <i>{e.description}</i>
            </Typography>
            <EntryDetails entry={e} />
            <Typography>
              <i>Diagnosis by {e.specialist}</i>
            </Typography>
            <ul>
              {e.diagnosisCodes?.map(c => (
                <li key={c}>
                  {c} {diagnoses.find(d => d.code === c)?.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

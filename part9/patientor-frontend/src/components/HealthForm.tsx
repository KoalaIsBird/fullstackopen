import {
  Alert,
  AlertColor,
  Box,
  Button,
  Card,
  FormControlLabel,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  TextField
} from '@mui/material';
import { isAxiosError } from 'axios';
import { FormEvent, useState } from 'react';
import { Entry, HealthCheckRating, NewEntry } from '../types';
import MultipleSelect from './DiagnosisCodeSelector';
import { assertNever } from '../utils';
import { saveNewEntry } from '../services';

interface Props {
  patientId: string;
  addPatientEntry: (entry: Entry) => void;
  entryType: 'HealthCheck' | 'OccupationalHealthcare' | 'Hospital';
}
export const HealthForm = ({ patientId, addPatientEntry }: Omit<Props, 'entryType'>) => {
  const [chosenType, setChosenType] = useState<Props['entryType']>('HealthCheck');

  return (
    <>
      <Card variant='outlined'>
        <Stack spacing={2} margin={2}>
          <FormLabel>Type of entry</FormLabel>
          <RadioGroup row>
            <FormControlLabel
              onClick={() => setChosenType('HealthCheck')}
              checked={chosenType === 'HealthCheck'}
              control={<Radio />}
              label='Health Check'
            />
          </RadioGroup>
          <RadioGroup row>
            <FormControlLabel
              onClick={() => setChosenType('Hospital')}
              checked={chosenType === 'Hospital'}
              control={<Radio />}
              label='Hospital'
            />
          </RadioGroup>
          <RadioGroup row>
            <FormControlLabel
              onClick={() => setChosenType('OccupationalHealthcare')}
              checked={chosenType === 'OccupationalHealthcare'}
              control={<Radio />}
              label='Occupational Health Care'
            />
          </RadioGroup>
          <SpecificHealthForm
            patientId={patientId}
            addPatientEntry={addPatientEntry}
            entryType={chosenType}
          />
        </Stack>
      </Card>
    </>
  );
};
const SpecificHealthForm = ({ patientId, addPatientEntry, entryType }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [codes, setCodes] = useState<string[]>([]);

  const [alert, setAlert] = useState<{ severity: AlertColor; message: string }>({
    severity: 'success',
    message: ''
  });

  const [rating, setRating] = useState<HealthCheckRating>(0);
  const [leave, setLeave] = useState<{ startDate: string; endDate: string }>({
    startDate: '',
    endDate: ''
  });
  const [discharge, setDischarge] = useState<{ date: string; criteria: string }>({
    date: '',
    criteria: ''
  });
  const [employerName, setEmployerName] = useState('');

  const notificateAlert = (message: string, messageType: 'success' | 'error') => {
    setAlert({ severity: messageType, message: message });
    setTimeout(() => {
      setAlert({ severity: 'success', message: '' });
    }, 5000);
  };

  const getInputtedEntry = (): NewEntry => {
    switch (entryType) {
      case 'HealthCheck':
        return {
          type: 'HealthCheck',
          description,
          date,
          specialist,
          diagnosisCodes: codes,
          healthCheckRating: rating
        };

      case 'Hospital':
        return {
          type: 'Hospital',
          description,
          date,
          specialist,
          diagnosisCodes: codes,
          discharge: discharge
        };

      case 'OccupationalHealthcare':
        return {
          type: 'OccupationalHealthcare',
          description,
          date,
          specialist,
          diagnosisCodes: codes,
          sickLeave: leave,
          employerName: employerName
        };
      default:
        return assertNever(entryType);
    }
  };

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    saveNewEntry(getInputtedEntry(), patientId)
      .then(entry => {
        addPatientEntry(entry);
        notificateAlert('Entry successfully added', 'success');
        setDescription('');
        setDate('');
        setSpecialist('');
        setCodes([]);
        setRating(0);
        setDischarge({ criteria: '', date: '' });
        setEmployerName('');
        setLeave({ endDate: '', startDate: '' });
      })
      .catch(reason => {
        if (
          !isAxiosError(reason) ||
          reason?.response?.data?.error === undefined ||
          !reason.response.data.error[0] ||
          !reason.response.data.error[0].message ||
          !reason.response.data.error[0].path
        ) {
          console.error(reason);
          return;
        }
        notificateAlert(
          `${reason.response.data.error[0].path}: ${reason.response.data.error[0].message}`,
          'error'
        );
      });
  };

  const getTypeSpecificFormPart = () => {
    switch (entryType) {
      case 'HealthCheck':
        return (
          <>
            <FormLabel>Health Check Rating</FormLabel>
            <RadioGroup row>
              {[0, 1, 2, 3].map((n, index) => (
                <FormControlLabel
                  key={index}
                  onClick={() => setRating(n)}
                  checked={rating === n}
                  control={<Radio />}
                  label={n}
                />
              ))}
            </RadioGroup>
          </>
        );

      case 'Hospital':
        return (
          <>
            <FormLabel>Discharge Date</FormLabel>
            <Input
              type='date'
              value={discharge.date}
              onChange={e => setDischarge({ ...discharge, date: e.target.value })}
            />
            <TextField
              fullWidth
              label='Discharge Criteria'
              value={discharge.criteria}
              onChange={e => setDischarge({ ...discharge, criteria: e.target.value })}
            />
          </>
        );

      case 'OccupationalHealthcare':
        return (
          <>
            <TextField
              fullWidth
              label='Employer Name'
              value={employerName}
              onChange={e => setEmployerName(e.target.value)}
            />
            <FormLabel>Leave Start Date</FormLabel>
            <Input
              type='date'
              value={leave.startDate}
              onChange={e => setLeave({ ...leave, startDate: e.target.value })}
            />
            <FormLabel>Leave End Date</FormLabel>
            <Input
              type='date'
              value={leave.endDate}
              onChange={e => setLeave({ ...leave, endDate: e.target.value })}
            />
          </>
        );
      default:
        return assertNever(entryType);
    }
  };

  return (
    <Box component='form' onSubmit={handleFormSubmit}>
      <Stack spacing={2} margin={2}>
        {alert.message ? <Alert severity={alert.severity}>{alert.message}</Alert> : null}

        <TextField
          fullWidth
          label='Description'
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <FormLabel>Date</FormLabel>
        <Input type='date' value={date} onChange={e => setDate(e.target.value)} />

        <TextField
          fullWidth
          label='Specialist'
          value={specialist}
          onChange={e => setSpecialist(e.target.value)}
        />

        <MultipleSelect setSelectedCodes={setCodes} selectedCodes={codes} />

        {getTypeSpecificFormPart()}

        <Button variant='contained' type='submit'>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

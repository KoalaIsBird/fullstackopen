import axios from 'axios';
import { apiBaseUrl } from './constants';
import { Diagnosis, Entry, NewEntry, Patient } from './types';

export const getPatient = (id: string) => {
  return axios.get<Patient>(`${apiBaseUrl}/patients/${id}`).then(v => v.data);
};
export const getDiagnoses = () => {
  return axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`).then(res => res.data);
};

export const saveNewEntry = (newEntry: NewEntry, patientId: string) => {
  return axios
    .post<Entry>(`${apiBaseUrl}/patients/${patientId}/entries`, newEntry)
    .then(data => data.data);
};

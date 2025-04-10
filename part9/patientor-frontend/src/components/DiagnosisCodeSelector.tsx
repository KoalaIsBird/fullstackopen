import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Dispatch, SetStateAction, useContext } from 'react';
import { PatientContext } from './PatientPage';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export default function MultipleSelect({
  selectedCodes,
  setSelectedCodes
}: {
  selectedCodes: string[];
  setSelectedCodes: Dispatch<SetStateAction<string[]>>;
}) {
  const {codes: availableCodes} = useContext(PatientContext);

  const handleChange = (event: SelectChangeEvent<typeof selectedCodes>) => {
    const {
      target: { value }
    } = event;
    setSelectedCodes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id='multiple-label'>Diagnosis Codes</InputLabel>
        <Select
          labelId='multiple-label'
          id='multiple'
          multiple
          value={selectedCodes}
          onChange={handleChange}
          input={<OutlinedInput label='Diagnosis Codes' />}
          MenuProps={MenuProps}
        >
          {availableCodes.map(c => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

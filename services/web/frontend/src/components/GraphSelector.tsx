import { FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText, TextField, Button } from "@mui/material";

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { SelectChangeEvent } from "@mui/material";

import { MeasurementType } from "../util/types";
import React, { useEffect } from "react";


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface Props {
    measurementTypes: MeasurementType[],
    selectedMT: string[],
    handleChange: (event: SelectChangeEvent<string[]>, child: React.ReactNode) => void,
    startDate: Date,
    setStartDate: React.Dispatch<React.SetStateAction<Date>>,
    endDate: Date,
    setEndDate: React.Dispatch<React.SetStateAction<Date>>,
    getData: () => void,
}

const GraphSelector = ({ measurementTypes, selectedMT, handleChange, startDate, setStartDate, endDate, setEndDate, getData }: Props) => {
    const _setStartDate = (date: Date | null, ignore: string | undefined) => {
        if (date == null) {
            date = new Date();
            date.setMonth(date.getMonth() - 3);
        }
        setStartDate(date);
    }

    const _setEndDate = (date: Date | null, ignore: string | undefined) => {
        if (date == null) {
            date = new Date();
        }
        setEndDate(date);
    }

    useEffect(() => {
        getData();
    }, [selectedMT, endDate, startDate]);

    return <FormControl style={{ display: "flex", flexDirection: "row" }}>
            <InputLabel id="demo-multiple-checkbox-label">Measurement Type</InputLabel>
            <Select
            labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                multiple
                value={selectedMT}
                onChange={handleChange}
                input={<OutlinedInput label="Type" />}
                MenuProps={MenuProps}
                renderValue={(selected) => selected.join(', ')}
                style={{ minWidth: "200px" }}
            >
                {measurementTypes.map((measurementType: MeasurementType) => {
                    return (
                        <MenuItem key={measurementType.type} value={measurementType.type}>
                            <Checkbox checked={selectedMT.indexOf(measurementType.type) > -1} />
                            <ListItemText primary={measurementType.type} />
                        </MenuItem>)
                })}
            </Select>
            <LocalizationProvider dateAdapter={AdapterDayjs} localText="nl-NL">
                <DateTimePicker
                label="Start date"
                inputFormat="DD/MM/YYYY H:mm"
                value={startDate}
                onChange={_setStartDate}
                renderInput={(params) => <TextField {...params} />}
                />
                <DateTimePicker
                label="End date"
                inputFormat="DD/MM/YYYY H:mm"
                value={endDate}
                onChange={_setEndDate}
                renderInput={(params) => <TextField {...params} />}
                />
        </LocalizationProvider>

        {/* <Button variant="contained" onClick={getData}>Get Data</Button> */}
        
        </FormControl>
};

export default GraphSelector;
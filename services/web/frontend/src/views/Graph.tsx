import { useState, useEffect } from "react";
import { Typography } from "@mui/material";

import dayjs from 'dayjs';

import GraphSelector from "../components/GraphSelector";
import GraphComponent from "../components/GraphComponent";

import { MeasurementType, Measurement } from "../util/types";


function padTo2Digits(num: number) {
  return num.toString().padStart(2, '0');
}

function formatDate(date: Date) {
  return (
    [
        padTo2Digits(date.getDate()),
        padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
    ].join('/') +
    ' ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds()),
    ].join(':')
  );
}


const Graph = () => {

    const [measurementTypes, setMeasurementTypes] = useState<MeasurementType[]>([]);

    const [selectedMT, setSelectedMT] = useState<string[]>([]);
    const [selectedMTIDs, setSelectedMTIDs] = useState<number[]>([]);

    const now = new Date();
    const prev = new Date().setMonth(now.getMonth() - 3)

    const [startDate, setStartDate] = useState<Date>(dayjs(prev).toDate());
    const [endDate, setEndDate] = useState<Date>(dayjs(now).toDate());

    const [data, setData] = useState<Measurement[][]>([]);

    const handleChange = (event: any) => {
        const {
        target: { value },
        } = event;
        let ids = [];
        for (let v in value) {
            for (let mt in measurementTypes) {
                if (measurementTypes[mt].type === value[v]) {
                    ids.push(measurementTypes[mt].id);
                }
            }
        }
        console.log(ids);
        setSelectedMTIDs(ids);
        setSelectedMT(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const getData = () => {
        setData([]);
        for (let mt of selectedMTIDs) {
            console.error(`http://localhost:5000/measurements?type=${mt}&start_date=${formatDate(new Date(startDate))}&end_date=${formatDate(new Date(endDate))}`);
            fetch(`http://localhost:5000/measurements?type=${mt}&start_date=${formatDate(new Date(startDate))}&end_date=${formatDate(new Date(endDate))}`)
                .then(response => response.json())
                .then(d => {
                    setData([...data, d]);
                    console.log(data);
                });
        }
    }
    
    useEffect(() => {
        fetch("http://localhost:5000/measurementtypes")
            .then(response => response.json())
            .then(data => setMeasurementTypes(data));
    }, []);

    return <>
        <Typography variant="h1">Grafiek</Typography>

        <GraphSelector measurementTypes={measurementTypes} selectedMT={selectedMT} handleChange={handleChange} startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} getData={getData} />

        <GraphComponent data={data} measurementTypes={measurementTypes} />

    </>
};

export default Graph;
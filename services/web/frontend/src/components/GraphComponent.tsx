import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";
import { add, format, differenceInCalendarDays, isFuture } from "date-fns";

import { MeasurementType, Measurement } from "../util/types";

import { timeDay } from "d3";

import "../styles/Graph.css";
import { TurnedIn } from '@mui/icons-material';

const getMeasurementType = (type_id: number, measurementTypes: MeasurementType[]): MeasurementType | null => {
    for (let type of measurementTypes) {
        if (type.id === type_id) {
            return type;
        }
    }
    return null;
}

interface Props {
    data: Measurement[][],
    measurementTypes: MeasurementType[],
    startDate: Date,
    endDate: Date
}

interface GraphData {
    [key: string]: number | Date;
    date: Date;
}

const GraphComponent = ({ data, measurementTypes, startDate, endDate }: Props) => {
    const [manData, setManData] = useState<GraphData[]>([]);

    const [dataIDs, setDataIDs] = useState<string[]>([]);

    const [dataStartDate, setDataStartDate] = useState<Date>(new Date());
    const [dataEndDate, setDataEndDate] = useState<Date>(new Date());

    const [ticks, setTicks] = useState<number[]>([]);

    useEffect(() => {
        setManData(manipulateData(data, measurementTypes));
    }, [data, measurementTypes]);

    const dateFormatter = (date: string) => {
        return format(new Date(date), "dd/MM");
    }

    const getTicks = (_startDate: Date, _endDate: Date, num: number): number[] => {
        try {
            const diffDays = differenceInCalendarDays(_startDate, _endDate);

            let current = _startDate;
            let velocity = Math.round(diffDays / (num - 1));

            const _ticks = [_startDate.getTime()];

            for (let i = 1; i < (num - 1); i++) {
                _ticks.push(add(current, { days: i * velocity }).getTime());
            }

            _ticks.push(_endDate.getTime());
            return _ticks;
        } catch (error) {
            if (error instanceof TypeError) return [];
            if (error instanceof Error) throw new Error(error.message);
            console.error(error);
            return [];
        }
    };

    const fillTicksData = (_ticks: any, data: any) => {
        const ticks = [..._ticks];
        const filled = [];

        let currentTick = ticks.shift();
        let lastData = null;
        for (const it of data) {
            if (ticks.length && it.date > currentTick && lastData) {
                filled.push({ ...lastData, ...{ date: currentTick } });
                currentTick = ticks.shift();
            } else if (ticks.length && it.date === currentTick) {
                currentTick = ticks.shift();
            }

            filled.push(it);
            lastData = it;
        }

        return filled;
    };

    const manipulateData = (data: Measurement[][], measurementTypes: MeasurementType[]): GraphData[] => {
        const newData: GraphData[] = [];

        for (let measurementTypeData of data) {
            for (let measurement of measurementTypeData) {
                const type_id = measurement.type_id;
                const type = getMeasurementType(type_id, measurementTypes);
                if (type == null) continue;
                const sensor_id = measurement.sensor_id;
                const value = measurement.value;

                const id = `${type.type}-${sensor_id}`;
                if (!dataIDs.includes(id)) setDataIDs([...dataIDs, id]);
                const obj: GraphData = {
                    date: new Date(measurement.timestamp)
                };
                obj[id] = value;

                newData.push(obj);

                if (obj.date > dataStartDate) setDataStartDate(obj.date);
                else if (obj.date < dataEndDate) setDataEndDate(obj.date);
            }
        }
        return newData;
    };

    let colours = ["#8884d8", "#82ca9d", "#ffc658", "#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#00ffff", "#ffff00", "#000000"];


    // const domain = [dataMin => dataMin, () => endDate.getTime()];
    const domain = [timeDay.floor(dataStartDate).getTime(), timeDay.ceil(dataEndDate).getTime()];
    // let ticks: void | number[] = [];
    if (ticks.length == 0) {
        setTicks(getTicks(dataStartDate, dataEndDate, 0));
    }
    // const filledData = fillTicksData(ticks, data);

    return (
        <ResponsiveContainer width="95%" height={1200}>
            <LineChart
                data={manData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" scale="time" tickFormatter={dateFormatter} type="number" domain={domain} tickSize={10} interval={20} />
                <Tooltip />
                <Legend />
                {dataIDs.map((id) => {
                    return (
                        <Line
                            type="monotone"
                            dataKey={id}
                            key={id}
                            stroke={colours[dataIDs.indexOf(id)]}
                            // stroke="#8884d8"
                            // activeDot={{ r: 8 }}
                        />
                    )
                })
                }
            </LineChart>
        </ResponsiveContainer>

    )
};

export default GraphComponent;
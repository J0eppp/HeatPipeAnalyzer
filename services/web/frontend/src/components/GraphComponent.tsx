import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from "react";

import { MeasurementType, Measurement } from "../util/types";

const getMeasurementType = (type_id: number, measurementTypes: MeasurementType[]): MeasurementType | null => {
    for (let type of measurementTypes) {
        if (type.id == type_id) {
            return type;
        }
    }
    return null;
}


const manipulateData = (data: Measurement[], measurementTypes: MeasurementType[]): Measurement[] => {
    const newData: Measurement[] = [];
    // data is an array of timestamps
    // Each timestamp contains an array of measurements, possibly of multiple measurementtypes
    for (let timestamp in data) {
        for (let measurement of data) {
            const type_id = measurement.type_id;
            const type = getMeasurementType(type_id, measurementTypes);
            if (type == null) continue;
            const sensor_id = measurement.sensor_id;
            const value = measurement.value;

            const id = `${type.type}-${sensor_id}`;
            const obj: any = {
                name: timestamp,
            };
            obj[id] = value;

            newData.push(obj);
        }
    }


    return newData;
};

interface Props {
    data: Measurement[],
    measurementTypes: MeasurementType[],
}

const GraphComponent = ({ data, measurementTypes }: Props) => {
    const [manData, setManData] = useState<Measurement[]>([]);

    useEffect(() => {
        setManData(manipulateData(data, measurementTypes));
    }, [data, measurementTypes]);

//     console.log(data);
//     const d = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];
    return (
        <LineChart
            width={500}
            height={300}
            data={manData}
            margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5
            }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <Tooltip />
            <Legend />
            <Line
                type="monotone"
                dataKey="temperature-1"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
            />
            {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>

    )
};

export default GraphComponent;
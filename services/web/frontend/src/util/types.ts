interface MeasurementType {
    id: number;
    description: string;
    type: string;
}

interface Measurement {
    id: number;
    sensor_id: number;
    timestamp: string;
    type_id: number;
    value: number;
}

export { MeasurementType, Measurement };
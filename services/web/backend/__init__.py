from flask import Flask, jsonify, request
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
from os import getenv
from datetime import datetime

from . import database

load_dotenv()
app = Flask(__name__)
engine = database.create_connection(getenv("DATABASE_URL"))

Session = sessionmaker(bind=engine)

# fill database with required data if necessary
session = Session()
sensors = database.get_sensors(session)
measurementtypes = database.get_measurementtypes(session)

if len(sensors) == 0:
    # Create all sensors
    sensor1 = database.Sensor(name="Sensor 1")
    database.insert(session, sensor1, commit=False)

if len(measurementtypes) == 0:
    # Create all measurement types
    mt1 = database.MeasurementType(
        type="temperature", description="Get the temperature of the heatpipes")
    database.insert(session, mt1, commit=False)

session.commit()
session.close()


@app.route("/")
def hello_world():
    return jsonify(hello="world")


@app.route("/sensors")
def get_sensors():
    session = Session()
    data = database.get_sensors(session)
    session.close()
    return jsonify([sensor.serialize for sensor in data])


@app.route("/sensors", methods=["POST"])
def post_sensors():
    data = request.get_json()
    name = data['name']
    sensor = database.Sensor(name=name)

    session = Session()
    database.insert(session, sensor)
    session.refresh(sensor)
    res = jsonify(sensor.serialize)
    session.close()
    return res, 201


@app.route("/measurementtypes")
def get_measurementtypes():
    session = Session()
    data = database.get_measurementtypes(session)
    session.close()
    return jsonify([mt.serialize for mt in data])


@app.route("/measurements")
def get_measurements():
    session = Session()
    data = database.get_measurements(session)
    session.close()
    return jsonify([measurement.serialize for measurement in data])


@app.route("/measurements", methods=["POST"])
def post_measurements():
    data = request.get_json()
    measurement_type: int = data['measurement_type']
    sensor: int = data['sensor']
    value: float = data['value']
    dt: datetime = datetime.now()

    if all(v is not None for v in [measurement_type, sensor, value, dt]) == None:
        return jsonify({"error": "Crucial information was missing."}), 400

    measurement = database.Measurement(
        type_id=measurement_type, sensor_id=sensor, value=value, timestamp=dt)

    session = Session()
    database.insert(session, measurement)
    session.refresh(measurement)

    res = jsonify(measurement.serialize)
    session.close()

    return res, 201

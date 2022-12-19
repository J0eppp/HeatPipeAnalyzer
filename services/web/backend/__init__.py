from flask import Flask, jsonify, request
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
from os import getenv
from datetime import datetime, timedelta

from . import database

from flask_cors import CORS


def monthdelta(date, delta):
    m, y = (date.month+delta) % 12, date.year + ((date.month)+delta-1) // 12
    if not m:
        m = 12
    d = min(date.day, [31,
                       29 if y % 4 == 0 and (
                           not y % 100 == 0 or y % 400 == 0) else 28,
                       31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m-1])
    return date.replace(day=d, month=m, year=y)


load_dotenv()
app = Flask(__name__)
CORS(app)
engine = database.create_connection(getenv("DATABASE_URL"))

Session = sessionmaker(bind=engine)

# fill database with required data if necessary
session = Session()
sensors = database.get_sensors(session)
measurementtypes = database.get_measurementtypes(session)
measurements = database.get_measurements(session)

if len(sensors) == 0:
    # Create all sensors
    sensor1 = database.Sensor(name="Sensor 1")
    database.insert(session, sensor1, commit=False)
    sensor2 = database.Sensor(name="Sensor 2")
    database.insert(session, sensor2, commit=False)


if len(measurementtypes) == 0:
    # Create all measurement types
    mt1 = database.MeasurementType(
        type="temperature", description="Get the temperature of the heatpipes")
    database.insert(session, mt1, commit=False)
    mt2 = database.MeasurementType(
        type="lux", description="Get the intensity of the sun"
    )
    database.insert(session, mt2, commit=False)

session.commit()

if len(measurements) == 0:
    import random
    # Create some sample measurements
    for i in range(1000):
        temp = random.randint(15, 80) + (random.randint(0, 9) / 10)
        timestamp = datetime.now() + timedelta(hours=-i)
        measurement = database.Measurement(
            type_id=1, sensor_id=1, value=temp, timestamp=timestamp)
        database.insert(session, measurement, commit=False)
    for i in range(1000):
        lux = random.randint(15, 80) + (random.randint(0, 9) / 10)
        timestamp = datetime.now() + timedelta(hours=-i)
        measurement = database.Measurement(
            type_id=2, sensor_id=2, value=lux, timestamp=timestamp)
        database.insert(session, measurement, commit=False)

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
    mt = request.args.get("type")
    sd = request.args.get("start_date")
    ed = request.args.get("end_date")

    if ed == None:
        ed = datetime.now()
    else:
        ed = datetime.strptime(ed, '%d/%m/%Y %H:%M:%S')

    if sd == None:
        sd = monthdelta(datetime.now(), -3)
    else:
        sd = datetime.strptime(sd, '%d/%m/%Y %H:%M:%S')
    session = Session()
    data = None
    if mt != None:
        data = session.query(database.Measurement).filter_by(type_id=mt).filter(
            database.Measurement.timestamp >= sd).filter(database.Measurement.timestamp <= ed)
    else:
        data = session.query(database.Measurement).filter(
            database.Measurement.timestamp >= sd).filter(database.Measurement.timestamp <= ed)

    if data == None:
        data = database.get_measurements(session)

    # Put data in a dictionary with the timestamp as key
    data = [measurement.serialize for measurement in data]
    session.close()
    # data_timestamp = dict((str(el['timestamp']), []) for el in data)
    # for el in data:
    #     data_timestamp[str(el['timestamp'])].append(el)
    # return jsonify(data_timestamp)
    return jsonify(data)


@app.route("/measurements", methods=["POST"])
def post_measurements():
    data = request.get_json()
    measurement_type: int = data['measurement_type']
    sensor: int = data['sensor']
    value: float = data['value']
    dt = None
    try:
        dt = datetime.strptime(data['timestamp'], '%d/%m/%Y %H:%M:%S')
    except KeyError:
        dt = datetime.now()

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


@app.route("/measurements/<id>", methods=["DELETE"])
def delete_measurements(id):
    session = Session()
    measurement = session.query(database.Measurement).filter_by(id=id).first()
    if measurement == None:
        return jsonify({"error": "Measurement not found."}), 404
    session.delete(measurement)
    session.commit()
    session.close()
    return jsonify({"success": "Measurement deleted."}), 200

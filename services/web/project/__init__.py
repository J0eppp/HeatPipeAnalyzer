from flask import Flask, jsonify
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
from os import getenv

from . import database

load_dotenv()
app = Flask(__name__)
engine = database.create_connection(getenv("DATABASE_URL"))

Session = sessionmaker(bind=engine)


@app.route("/")
def hello_world():
    return jsonify(hello="world")


@app.route("/stations")
def get_stations():
    session = Session()
    data = database.get_stations(session)
    session.close()
    return jsonify(data)


@app.route("/measurementtypes")
def get_measurementtypes():
    session = Session()
    data = database.get_measurementtypes(session)
    session.close()
    return jsonify(data)


@app.route("/measurements")
def get_measurements():
    session = Session()
    data = database.get_measurements(session)
    session.close()
    return jsonify(data)

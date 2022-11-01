from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import relationship


app = Flask(__name__)
app.config.from_object("project.config.Config")
db = SQLAlchemy(app)

class Station(db.Model):
    __tablename__ = "stations"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), unique=True, nullable=False)

class MeasurementType(db.Model):
    __tablename__ = "measurementtypes"

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(32), unique=True, nullable=False)
    description = db.Column(db.String(), nullable=False)

class Measurement(db.Model):
    __tablename__ = "measurements"

    id = db.Column(db.Integer, primary_key=True)
    type_id = db.Column(db.Integer, db.ForeignKey("measurementtypes.id"), primary_key=True)
    type = relationship("MeasurementType")
    value = db.Column(db.Float, nullable=True)
    station_id = db.Column(db.Integer, db.ForeignKey("stations.id"), primary_key=True)
    station = relationship("Station")
    timestamp = db.Column(db.DateTime, nullable=False, primary_key=True)


@app.route("/")
def hello_world():
    return jsonify(hello="world")
from pkg_resources import declare_namespace
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, create_engine
from sqlalchemy.orm import relationship


Base = declarative_base()


class Station(Base):
    __tablename__ = "stations"

    id = Column(Integer, primary_key=True)
    name = Column(String(128), unique=True, nullable=False)


class MeasurementType(Base):
    __tablename__ = "measurementtypes"

    id = Column(Integer, primary_key=True)
    type = Column(String(32), unique=True, nullable=False)
    description = Column(String(), nullable=False)


class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True)
    type_id = Column(Integer, ForeignKey(
        "measurementtypes.id"), primary_key=True)
    type = relationship("MeasurementType")
    value = Column(Float, nullable=True)
    station_id = Column(Integer, ForeignKey("stations.id"), primary_key=True)
    station = relationship("Station")
    timestamp = Column(DateTime, nullable=False, primary_key=True)


def create_connection(uri):
    engine = create_engine(uri, echo=True)
    Base.metadata.create_all(engine)
    return engine


def get_stations(session):
    return session.query(Station).all()


def get_measurementtypes(session):
    return session.query(MeasurementType).all()


def get_measurements(session):
    return session.query(Measurement).order_by(Measurement.id.desc()).limit(500)[::-1]

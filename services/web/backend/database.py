from pkg_resources import declare_namespace
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, create_engine
from sqlalchemy.orm import relationship


Base = declarative_base()


class Sensor(Base):
    __tablename__ = "sensors"

    id = Column(Integer, primary_key=True)
    name = Column(String(128), unique=True, nullable=False)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name
        }


class MeasurementType(Base):
    __tablename__ = "measurementtypes"

    id = Column(Integer, primary_key=True)
    type = Column(String(32), unique=True, nullable=False)
    description = Column(String(), nullable=False)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "type": self.type,
            "description": self.description
        }


class Measurement(Base):
    __tablename__ = "measurements"

    id = Column(Integer, primary_key=True)
    type_id = Column(Integer, ForeignKey(
        "measurementtypes.id"), nullable=False)
    # type = relationship(MeasurementType)
    sensor_id = Column(Integer, ForeignKey("sensors.id"), nullable=False)
    # sensor = relationship(Sensor)
    value = Column(Float, nullable=True)
    timestamp = Column(DateTime)

    @property
    def serialize(self):
        return {
            "id": self.id,
            "type_id": self.type_id,
            # "type": self.type.serialize,
            # "sensor": self.sensor.serialize,
            "sensor_id": self.sensor_id,
            "value": self.value,
            "timestamp": self.timestamp
        }


def create_connection(uri):
    engine = create_engine(uri, echo=True)
    Base.metadata.create_all(engine)
    return engine


def get_sensors(session):
    return session.query(Sensor).all()


def get_measurementtypes(session):
    return session.query(MeasurementType).all()


def get_measurements(session):
    return session.query(Measurement).order_by(Measurement.id.desc())[::-1]


def insert(session, object, commit=True):
    if object:
        session.add(object)
    if commit == True:
        session.commit()

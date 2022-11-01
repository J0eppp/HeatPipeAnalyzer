CREATE TABLE Station (
    id INT NOT NULL,
    name VARCHAR(128) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE MeasurementTyppe (
    id INT NOT NULL,
    type VARCHAR(32) NOT NULL,
    description TEXT NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE Measurement (
    id INT NOT NULL,
    type INT NOT NULL,
    value FLOAT NOT NULL,
    station INT NOT NULL,
    datetime DATETIME NOT NULL,
    FOREIGN KEY station references Station(id),
    FOREIGN KEY type REFERENCES MeasurementType(id),
    PRIMARY KEY (id, station, datetime, type)
);

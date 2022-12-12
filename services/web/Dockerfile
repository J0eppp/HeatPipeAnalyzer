# pull official base image
FROM python:3.10.7-slim-buster

# set work directory
WORKDIR /usr/src/app

# install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt /usr/src/app/backend/requirements.txt
RUN pip install -r /usr/src/app/backend/requirements.txt

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# COPY ./scheduler/requirements.txt /usr/src/app/scheduler/requirements.txt
# RUN pip install -r /usr/src/app/scheduler/requirements.txt


# copy project
COPY . /usr/src/app/backend
# COPY . /usr/src/app/scheduler
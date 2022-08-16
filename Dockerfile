# syntax=docker/dockerfile:1
FROM python:3.8-slim-buster
WORKDIR /backend
ENV FLASK_APP=backend/flask_API/flask_routes.py


RUN python3 -m venv backend/venv

COPY backend/requirements.txt requirements.txt
RUN backend/venv/bin/pip install -r requirements.txt

COPY . .

CMD [ "backend/venv/bin/python", "-m" , "flask", "run", "--host=0.0.0.0"]

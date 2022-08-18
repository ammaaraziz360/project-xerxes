# syntax=docker/dockerfile:1
FROM python:3.8-alpine

WORKDIR /backend
ENV FLASK_APP=backend/flask_API/flask_routes.py


RUN python3 -m venv backend/venv

COPY backend/requirements.txt requirements.txt

RUN set -e; \
	apk add --no-cache --virtual .build-deps \
		gcc \
		libc-dev \
		linux-headers \
        libffi-dev \
        build-base \
        python3-dev \
	; \
	backend/venv/bin/pip install -r requirements.txt; \
	apk del .build-deps;

COPY . .

RUN source backend/venv/bin/activate 

CMD [ "backend/venv/bin/uwsgi", "--socket" , "0.0.0.0:5000", "--protocol=http", "--wsgi-file", "backend/flask_API/wsgi.py", "--callable", "app"]

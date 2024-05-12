FROM python:3.9-alpine3.13

ENV PYTHONUNBUFFERED 1

COPY ./requirements.txt /requirements.txt
COPY ./backend /backend
COPY ./scripts /scripts
COPY ./backend/manage.py /backend/manage.py

ENV XDG_RUNTIME_DIR /run/user/app

WORKDIR /backend
EXPOSE 8000

RUN apk add --update --no-cache libffi-dev \
    build-base \
    postgresql-dev \
    postgresql-client

RUN python -m venv /py && \
    /py/bin/pip install --upgrade pip && \
    /py/bin/pip install -r /requirements.txt && \
    adduser --disabled-password --no-create-home app && \
    mkdir -p /vol/web/static && \
    chown -R app:app /vol && \
    chmod -R 755 /vol && \
    chmod -R +x /scripts

ENV PATH="/scripts:/py/bin:$PATH"

VOLUME /backend

USER app

CMD ["run.sh"]

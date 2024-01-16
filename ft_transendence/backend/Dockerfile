FROM python:3.7.4

ENV PYTHONUNBUFFERED=1

WORKDIR /app/backend

COPY backend/requirements.txt ./

RUN python3 -m venv venv && \
    . venv/bin/activate && \
    python -m pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . .

CMD ["/bin/bash", "backend.sh"]

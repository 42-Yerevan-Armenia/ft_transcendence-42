#!/bin/bash
python3 -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
echo 'source /app/backend/venv/bin/activate' >> /root/.bashrc
echo "alias migrate='python manage.py makemigrations && python manage.py migrate'" >> /root/.bashrc
echo "Starting Django Server, Enjoy!"
python3 manage.py runserver 0.0.0.0:8000

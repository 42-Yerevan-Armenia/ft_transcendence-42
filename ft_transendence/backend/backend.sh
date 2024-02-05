#!/bin/bash
python -m venv venv
source venv/bin/activate
python -m pip install --upgrade pip
pip install -r requirements.txt
echo 'source /app/backend/venv/bin/activate' >> /root/.bashrc
echo "alias migrate='python manage.py makemigrations && python manage.py migrate'" >> /root/.bashrc
python manage.py makemigrations --no-input
python manage.py migrate --no-input
echo "Starting Django Server, Enjoy!"
python manage.py runserver 0.0.0.0:8000

# c2r11s2% source venv/bin/activate
# (venv) c2r11s2% python3 -V
# Python 2.7.16
# (venv) c2r11s2% docker exec -it backend /bin/bash
# (venv) root@8c6e8c0300ab:/app/backend# source venv/bin/activate
# (venv) root@8c6e8c0300ab:/app/backend# python -V
# Python 3.10.13
# (venv) c2r11s2% deactivate
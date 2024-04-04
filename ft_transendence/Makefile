all: up

build:
	docker-compose build

up:
	docker-compose up -d
	docker-compose logs -f

down:
	docker-compose down

dbshell:
	docker-compose run --rm backend sh -c "python manage.py dbshell"

migrations:
	docker-compose run --rm backend sh -c "python manage.py makemigrations"

migrate:
	docker-compose run --rm backend sh -c "python manage.py migrate"

admin:
	docker-compose run --rm backend sh -c "python manage.py createsuperuser"

# app:
# 	docker-compose run --rm backend sh -c "python manage.py startapp user_api"

start:
	docker-compose start

stop:
	docker-compose stop

prune: down
	rm -rf database/data
	docker system prune -f -a

fclean: down
	docker volume prune -f
	rm -rf database/data
	docker system prune -f -a

re: prune all

.PHONY: all build up down start stop logs prune re fclean   
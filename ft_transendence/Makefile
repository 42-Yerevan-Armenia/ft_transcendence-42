all: up

build:
	docker compose build

up:
	docker compose up -d
	docker compose logs -f

down:
	docker compose down

ddown:
	docker compose -f docker-compose_deploy.yml down --volumes

dbuild:
	docker compose -f docker-compose_deploy.yml build

dup:
	docker compose -f docker-compose_deploy.yml up -d
	docker compose logs -f

start:
	docker compose start

stop:
	docker compose stop

logs:
	docker compose logs
	
prune: down
	rm -rf database/data
	docker system prune -f -a

fclean: down
	docker system prune -f -a

re: prune all 

.PHONY: all build up down start stop logs prune re fclean   
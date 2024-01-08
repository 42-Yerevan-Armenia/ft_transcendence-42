all: up

build:
	docker compose build

up:
	@docker compose up -d

down:
	docker compose down

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
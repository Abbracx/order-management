build:
	docker compose -f docker-compose.yml up --build -d --remove-orphans

up:
	docker compose -f docker-compose.yml up -d --remove-orphans	

down:
	docker compose -f docker-compose.yml down

exec:
	docker compose -f docker-compose.yml exec -it web /bin/bash

# To check if the env variables has been loaded correctly!
config:
	docker compose -f docker-compose.yml config 

logs:
	docker compose -f docker-compose.yml logs

logs-api:
	docker compose -f docker-compose.yml logs web

logs-mongo:
	docker compose -f docker-compose.yml logs web

logs-redis:
	docker compose -f docker-compose.yml logs web

	
	


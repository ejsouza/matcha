build:
	docker compose up -d

stop_services:
	docker compose down

remove_containers:
	docker rmi -f matcha_api
	rm ./api/data
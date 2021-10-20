build:
	docker compose up -d

build_log:
	docker compose up

seed:
	docker exec api npm run seed

stop:
	docker compose down

clean:
	docker rmi -f matcha_api
	# rm -rf ./api/data
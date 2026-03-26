.PHONY: install build start build-prod up-prod down-prod

install:
	$(MAKE) -C backend install
	$(MAKE) -C frontend install

build:
	$(MAKE) -C frontend build
	cd backend && python3 manage.py migrate

start: build
	$(MAKE) -j 2 start-backend start-frontend

start-backend:
	cd backend && python3 manage.py runserver

start-frontend:
	$(MAKE) -C frontend start

build-prod:
	docker-compose build

up-prod: build-prod
	docker-compose up -d

down-prod:
	docker-compose down

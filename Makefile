ifneq (,$(wildcard ./deploy/.env))
    include deploy/.env
    export
endif

.PHONY: dev build up down logs ps

dev:
	npm run dev

build:
	npm run build

# Staging/production: build the image (with deploy/.env's build args) and start the "web" container.
up:
	cd deploy && docker compose up -d --build

down:
	cd deploy && docker compose down

logs:
	cd deploy && docker compose logs -f web

ps:
	cd deploy && docker compose ps

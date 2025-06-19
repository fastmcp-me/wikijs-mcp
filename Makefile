.PHONY: up build run clean

up:
	@docker compose up -d

down:
	@docker compose down

build: 
	@npm run build

run: build
	@node build/index.js

clean:
	@rm -rf build/



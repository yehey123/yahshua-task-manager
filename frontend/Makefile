NPM = npm

.PHONY: help install build test start

help:
	@echo "Available commands:"
	@echo "  install - Install frontend dependencies"
	@echo "  build   - Build frontend for production"
	@echo "  test    - Run tests"
	@echo "  start   - Start development server"

install:
	$(NPM) install

build:
	$(NPM) run build

test:
	$(NPM) test

start:
	$(NPM) run dev

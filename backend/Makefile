PYTHON = python3
PIP = pip
PIP_COMPILE = pip-compile

.PHONY: help install compile lint format build

help:
	@echo "Available commands:"
	@echo "  install  - Install backend dependencies and set up the project"
	@echo "  compile  - Compile requirements.in to requirements.txt"
	@echo "  lint     - Run linter (ruff) on backend"
	@echo "  format   - Run formatter (ruff) on backend"
	@echo "  build    - Build backend Docker image"

install:
	$(PIP_COMPILE) requirements.in --output-file=requirements.txt
	$(PIP) install -r requirements.txt
	$(PYTHON) manage.py migrate


lint:
	ruff check .

format:
	ruff format .

build:
	docker build -t backend .

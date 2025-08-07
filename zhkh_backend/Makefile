#!make
# Setup the shell and python version.
# It's necessary to set this because some environments don't link sh -> bash.
SHELL := /bin/bash
PYTHON := python3.11
SERVICES := app
PY_CONFIG := app.config  # Путь до файла настроек сервиса
MESSAGE ?="auto"

.PHONY: help venv sort lint black

help:
	@echo "Использование: make <command>"
	@echo
	@echo "Доступные команды:"
	@echo "  venv                             Создание виртуального окружения"
	@echo "  sort                     		  Сортировка импортов"
	@echo "  lint                     		  Запуск линтеров"
	@echo "  black                    		  Запуск форматтера black"

venv:
	@$(PYTHON) -m venv .venv
	@echo "Для активации venv используйте 'source .venv/bin/activate'"

sort:
	@isort .

lint:
	@flake8 --max-line-length 120 $(SERVICES)
	@pylint $(SERVICES)

black:
	@black .

migrations:
	@alembic revision --autogenerate -m "$(shell date +' ')-${MESSAGE}"
	@git add app/migrations/versions/.

format:
	@$(foreach dir,$(TARGET_DIRS),poetry run black $(dir);)
	@$(foreach dir,$(TARGET_DIRS),poetry run isort $(dir);)

migrate:
	@alembic upgrade head
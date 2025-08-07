FROM python:3.11-slim

# Установка зависимостей для Poetry и сборки
RUN apt-get update && apt-get install -y \
    curl build-essential libpq-dev \
    && pip install --upgrade pip

# Установка Poetry
RUN curl -sSL https://install.python-poetry.org | python3 -

# Обновление PATH
ENV PATH="/root/.local/bin:$PATH"

# Установка рабочей директории
WORKDIR /app

# Копирование pyproject.toml и poetry.lock для установки зависимостей
COPY pyproject.toml poetry.lock* /app/

# Установка зависимостей без виртуального окружения
RUN poetry config virtualenvs.create false && poetry install --no-root

# Копирование остального кода
COPY ../../../../../Library/Containers/ru.keepcoder.Telegram/Data/tmp /app

# Запуск uvicorn
CMD ["uvicorn", "app.app:start_app", "--factory", "--host", "0.0.0.0", "--port", "8000"]
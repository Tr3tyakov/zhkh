FROM python:3.11-slim

# Установка системных зависимостей
RUN apt-get update && apt-get install -y \
    curl build-essential libpq-dev \
    postgresql-client \
    libpangoft2-1.0-0 libpango-1.0-0 libcairo2 libgdk-pixbuf2.0-0 libffi-dev \
    libglib2.0-0 shared-mime-info fonts-dejavu-core \
    && rm -rf /var/lib/apt/lists/* \
    && pip install --upgrade pip --no-cache-dir

# Установка Poetry
RUN pip install poetry

# Обновление PATH (не нужно для глобально установленного Poetry)
# ENV PATH="/root/.local/bin:$PATH"

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY pyproject.toml poetry.lock* /app/

# Установка Python-зависимостей
RUN poetry config virtualenvs.create false && poetry install --no-root --no-interaction

# Копирование остального кода
COPY . /app

RUN #alembic upgrade head

# Открытие порта
EXPOSE 8000

# Команда запуска
CMD ["uvicorn", "app.app:start_app", "--factory", "--host", "0.0.0.0", "--port", "8000"]
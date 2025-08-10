# Stage 1: Build
FROM node:20-alpine as builder

WORKDIR /app

# 1. Копируем только package.json для лучшего кэширования
COPY package*.json ./

# 2. Устанавливаем ВСЕ зависимости (включая devDependencies)
RUN npm install

# 3. Копируем остальные файлы
COPY . .

# 4. Собираем проект
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Копируем собранные файлы
COPY --from=builder /app/dist /usr/share/nginx/html

# Копируем конфиг nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]
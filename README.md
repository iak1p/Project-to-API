# Как запустить проект

Проект состоит из Docker-окружения, backend (`api`) и frontend (`client`).

---

## Docker (корень проекта)

Запуск контейнеров в фоновом режиме:

```bash
docker compose up -d
```

Остановка контейнеров:

```bash
docker compose stop
```

Полная остановка и удаление контейнеров вместе с volumes:

```bash
docker compose down -v
```

## Backend (папка api)

```bash
cd api
npm install
npm run start
```

## Frontend (папка client)

```bash
cd client
npm install
npm run dev
```

# Docker Cheatsheet

Quick reference for Docker commands used in UBIS development and operations.

## Starting Services

```bash
# Development (all services)
cd docker && docker compose up -d

# Production
cd docker && docker compose -f docker-compose.prod.yml up -d --build

# Monitoring (Prometheus + Grafana)
cd docker && docker compose -f docker-compose.monitoring.yml up -d

# Development with Nginx gateway
cd docker && docker compose --profile gateway up -d

# Only specific services
docker compose up -d mongo redis server
```

## Stopping Services

```bash
# Stop all services (keep data)
docker compose down

# Stop and DELETE all data volumes
docker compose down -v

# Stop production
docker compose -f docker-compose.prod.yml down

# Stop single service
docker compose stop server
```

## Viewing Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs server
docker compose logs mongo

# Follow live (stream)
docker compose logs -f server

# Last 100 lines
docker compose logs --tail=100 server

# With timestamps
docker compose logs -t server
```

## Service Health

```bash
# Service status overview
docker compose ps

# Detailed health info
docker inspect --format='{{json .State.Health}}' ubis_server | jq

# Check resource usage
docker stats

# Check a specific container
docker inspect ubis_server
```

## Executing Commands

```bash
# Run command in running container
docker exec -it ubis_server node seed.js
docker exec -it ubis_server node import-students-simple.js

# Open shell in container
docker exec -it ubis_server sh
docker exec -it ubis_mongo mongosh

# MongoDB shell (production with auth)
docker exec -it ubis_mongo_prod mongosh -u admin -p <password>

# Redis CLI
docker exec -it ubis_redis redis-cli
docker exec -it ubis_redis_prod redis-cli -a <password>

# RabbitMQ management
docker exec -it ubis_rabbitmq rabbitmqctl list_queues
```

## Building Images

```bash
# Rebuild a specific service
docker compose build server
docker compose build client

# Rebuild all and start
docker compose up -d --build

# Build with no cache
docker compose build --no-cache server

# Build production images
docker compose -f docker-compose.prod.yml build
```

## Database Operations

```bash
# MongoDB — Export collection
docker exec ubis_mongo mongoexport \
  --db=ubis --collection=users --out=/tmp/users.json

# MongoDB — Import collection
docker exec ubis_mongo mongoimport \
  --db=ubis --collection=students --file=/tmp/students.json

# MongoDB — Dump entire database
docker exec ubis_mongo mongodump --db=ubis --out=/tmp/backup

# MongoDB — Restore database
docker exec ubis_mongo mongorestore --db=ubis /tmp/backup/ubis

# Copy file from container to host
docker cp ubis_mongo:/tmp/backup ./backup

# Copy file from host to container
docker cp ./data.json ubis_server:/app/data.json
```

## Redis Operations

```bash
# Check Redis connectivity
docker exec ubis_redis redis-cli ping
# → PONG

# View all cache keys
docker exec ubis_redis redis-cli KEYS "api-cache:*"

# Get a specific cached value
docker exec ubis_redis redis-cli GET "api-cache:664a:GET:/api/faculties"

# Flush all cache
docker exec ubis_redis redis-cli FLUSHALL

# View Redis memory usage
docker exec ubis_redis redis-cli INFO memory
```

## Networking

```bash
# List networks
docker network ls

# Inspect a network
docker network inspect ubis_backend

# Check which containers are on a network
docker network inspect ubis_backend --format='{{range .Containers}}{{.Name}} {{end}}'
```

## Volume Management

```bash
# List volumes
docker volume ls

# Inspect a volume
docker volume inspect docker_mongo_data

# Remove unused volumes
docker volume prune

# Remove specific volume (WARNING: data loss!)
docker volume rm docker_mongo_data
```

## Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove everything unused (containers, images, networks, volumes)
docker system prune -a --volumes

# Check disk usage
docker system df
```

## Troubleshooting

```bash
# Why did a container exit?
docker logs ubis_server --tail=50

# Container inspect (full details)
docker inspect ubis_server

# Check port bindings
docker port ubis_server

# Check if port is in use (PowerShell)
netstat -ano | findstr :5000

# Restart a stuck service
docker compose restart server

# Force recreate containers
docker compose up -d --force-recreate

# Reset everything from scratch
docker compose down -v && docker compose up -d --build
```

## Environment Variables

```bash
# Check env vars inside container
docker exec ubis_server env

# Check specific var
docker exec ubis_server printenv MONGO_URL

# Override env var for single run
docker exec -e NODE_ENV=production ubis_server node seed.js
```

## Useful Aliases

Add to your shell profile (`.bashrc`, `.zshrc`, PowerShell `$PROFILE`):

```bash
# Bash/Zsh
alias dcu="docker compose up -d"
alias dcd="docker compose down"
alias dcl="docker compose logs -f"
alias dcp="docker compose ps"
alias dcr="docker compose restart"
alias dce="docker exec -it"

# PowerShell
Set-Alias dcu { docker compose up -d }
Set-Alias dcd { docker compose down }
```

## Port Reference

| Service | Dev Port | Prod Port | Internal Port |
|---------|----------|-----------|---------------|
| MongoDB | 27017 | — (internal) | 27017 |
| Redis | — (internal) | — (internal) | 6379 |
| RabbitMQ (AMQP) | 5672 | — (internal) | 5672 |
| RabbitMQ (UI) | 15672 | — (closed) | 15672 |
| MeiliSearch | 7700 | — (internal) | 7700 |
| Server | 5000 | 5001 | 5000 |
| Client | 5173 | 80 | 5173/80 |
| Nginx Gateway | 80 | — | 80 |
| Prometheus | — | 9090 | 9090 |
| Grafana | — | 3001 | 3000 |

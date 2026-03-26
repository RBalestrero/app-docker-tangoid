# inventory-platform

Plataforma de inventario con arquitectura modular y despliegue con Docker.

---

## 📦 Estructura

- frontend
- gateway
- services
- shared
- infra
- docs
- scripts

---

## 🧠 Backend actual

- gateway
- auth-service
- inventory-service

---

## 🧪 Servicios placeholder

- auth-service
- inventory-service
- stock-service
- warehouse-service
- report-service

---

## ⚙️ Stack

- Node.js
- Express
- PostgreSQL
- Docker Compose
- ES Modules

---

# 🚀 Ejecución del proyecto

El proyecto puede ejecutarse en dos modos:

- **Desarrollo (dev)** → con hot reload
- **Producción (prod)** → estable y optimizado

---

# 🧪 Modo Desarrollo (DEV)

Este modo está pensado para trabajar localmente sin reconstruir la imagen en cada cambio.

---

## Levantar entorno de desarrollo

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build
```

## Ejecutar en segundo plano

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## Detener entorno

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml down
```

## Reconstruir todo

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --buil
```

## Ver logs

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f
```

## Ver estado de contenedores

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml ps
```

## Entrar a un contenedor

```bash
docker exec -it auth_service sh
```

---

# Modo Producción (PROD)

---

## Primer arranque

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
```

## Ejecutar viendo logs

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

## Detener entorno

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml down
```

## Reconstruir todo desde cero

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml build --no-cache
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Reconstruir solo un servicio

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build auth-service -d
```

## Ver logs

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f
```

## Ver estado de contenedores

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml ps
```

## Entrar a un contenedor

```bash
docker exec -it auth_service sh
```

---

# Flujo Recomendado

---

## Desarrollo diario

```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up
```

Editar código -> guardar -> cambios automáticos.

## Validación / producción local

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build
```

---

# Comandos útiles

---

## Eliminar contenedores, redes y volúmenes

```bash
docker compose down -v
```

## Limpiar imágenes no utilizadas

```bash
docker system prune -a
```

## Ver uso de recursos

```bash
docker stats
```

---

# Base de datos PostgreSQL

---

## Recrear la base de datos eliminando el volumen con init

```bash
docker compose down -v
docker compose up --build
```


# ==========================================
# UBIS Client — Multi-Stage Dockerfile
# ==========================================

# ---------- Development ----------
FROM node:20-alpine AS development

WORKDIR /app
ENV NODE_ENV=development

COPY client/package*.json ./
RUN npm install

COPY client/ ./

EXPOSE 5173

CMD ["npm", "run", "dev"]

# ---------- Build ----------
FROM node:20-alpine AS build

WORKDIR /app
ENV NODE_ENV=production

COPY client/package*.json ./
RUN npm ci --include=optional && \
    npm install @rollup/rollup-linux-x64-musl --no-save

COPY client/ ./
RUN npm run build

# ---------- Production ----------
FROM nginx:1.27-alpine AS production

LABEL maintainer="UBIS Team" \
      description="UBIS Client — University Information System" \
      version="1.0"

# Custom nginx config (includes gzip, cache, security headers, API proxy)
COPY docker/client.nginx.conf /etc/nginx/conf.d/default.conf

# Static assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]

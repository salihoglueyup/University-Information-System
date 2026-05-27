# ==========================================
# UBIS Server — Multi-Stage Dockerfile
# ==========================================

# ---------- Development ----------
FROM node:20-alpine AS development

WORKDIR /app
ENV NODE_ENV=development

COPY server/package*.json ./
RUN npm install

COPY server/ ./

EXPOSE 5000

CMD ["npm", "run", "dev"]

# ---------- Production ----------
FROM node:20-alpine AS production

LABEL maintainer="UBIS Team" \
      description="UBIS Server — University Information System API" \
      version="1.0"

WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server/ ./

# Create runtime directories with correct ownership
RUN mkdir -p /app/uploads /app/logs && \
    chown -R node:node /app

# Run as non-root (node user is built into node:alpine)
USER node

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

CMD ["npm", "start"]

FROM node:20-alpine AS development

WORKDIR /app
ENV NODE_ENV=development

COPY server/package*.json ./
RUN npm install

COPY server/ ./

EXPOSE 5000

CMD ["npm", "run", "dev"]

FROM node:20-alpine AS production

WORKDIR /app
ENV NODE_ENV=production

COPY server/package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY server/ ./

EXPOSE 5000

CMD ["npm", "start"]

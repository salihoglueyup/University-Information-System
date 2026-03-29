FROM node:20-alpine AS development

WORKDIR /app
ENV NODE_ENV=development

COPY client/package*.json ./
RUN npm install

COPY client/ ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

FROM node:20-alpine AS build

WORKDIR /app
ENV NODE_ENV=development

COPY client/package*.json ./
RUN npm ci --include=optional
RUN npm install @rollup/rollup-linux-x64-musl --no-save

COPY client/ ./
RUN npm run build

FROM nginx:1.27-alpine AS production

COPY docker/client.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

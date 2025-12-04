FROM node:24-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
EXPOSE 40400
CMD sh -c 'npx drizzle-kit generate \
        && npx drizzle-kit migrate \
        && node server.js'

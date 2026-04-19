# Dockerfile da API
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
# Instalando apenas o necessário, de forma silenciosa e leve
RUN npm install --omit=dev --no-audit --no-fund
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]
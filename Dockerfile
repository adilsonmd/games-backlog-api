# Dockerfile da API
# Alterando a versão de 22 para 20 pois utiliza menos memória. Meu ambiente tem apenas 1gb
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
# Instalando apenas o necessário, de forma silenciosa e leve

# npm ci em vez de npm install
#   Usa menos memória
#   Mais rápido
#   Evita resolver dependências (usa lockfile direto)
#RUN npm install --omit=dev --no-audit --no-fund
RUN npm ci --omit=dev --no-audit --no-fund

COPY . .

# 4. Limpa cache do npm (reduz imagem)
RUN npm cache clean --force

ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]
# Etapa 1: Construção da aplicação Angular
FROM node:22.14 AS build

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e package-lock.json (se existir) para instalar dependências
COPY package*.json ./

RUN npm install

RUN npm install -g @angular/cli@19.2.1

# Copie os arquivos da aplicação para o contêiner
COPY . .

RUN node scripts/generate-mf-manifest.js

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]


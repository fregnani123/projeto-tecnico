# Use a imagem base do Node.js
FROM node:18

# Instalar dependências do sistema, incluindo xdg-utils
RUN apt-get update && apt-get install -y xdg-utils

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar os arquivos de dependências e instalar as dependências do Node.js
COPY package*.json ./
RUN npm install

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor a porta
EXPOSE 80

# Comando para rodar a aplicação
CMD ["npm", "run", "dev"]

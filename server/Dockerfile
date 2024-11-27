# Usar a imagem base do Node.js
FROM node:18

# Instalar ferramentas de compilação e dependências necessárias
RUN apt-get update && apt-get install -y \
    build-essential \
    python3 \
    libsqlite3-dev

# Definir o diretório de trabalho
WORKDIR /usr/src/server

# Copiar os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Remover o diretório node_modules para garantir uma instalação limpa
RUN rm -rf node_modules

# Instalar as dependências
RUN npm install

# Recompilar módulos nativos para garantir compatibilidade
RUN npm rebuild sqlite3 --build-from-source

# Copiar todos os arquivos do projeto
COPY . .

# Remover o node_modules novamente antes de rodar o servidor para garantir uma instalação limpa
RUN rm -rf node_modules

# Instalar as dependências novamente para garantir compatibilidade
RUN npm install

# Expor a porta que o servidor vai rodar
EXPOSE 8080

# Comando para rodar o servidor
CMD ["npm", "run", "start"]

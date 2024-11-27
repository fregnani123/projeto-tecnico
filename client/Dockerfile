# Usar a imagem base do Node.js
FROM node:18

# Definir o diretório de trabalho
WORKDIR /usr/src/app

# Copiar os arquivos de dependências primeiro para aproveitar o cache do Docker
COPY package*.json ./

# Instalar as dependências
RUN npm install

# Copiar todos os arquivos do projeto
COPY . .

# Construir o aplicativo para produção
RUN npm run build

# Instalar o http-server
RUN npm install -g http-server

# Expor a porta que o cliente vai rodar
EXPOSE 80

# Comando para rodar o http-server
CMD ["http-server", "dist", "-p", "80"]

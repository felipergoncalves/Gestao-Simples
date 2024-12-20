# Imagem base do Node.js para build
FROM node:18 AS build

# Diretório de trabalho no contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o código fonte do projeto para o diretório de trabalho
COPY . .

# Faz o build da aplicação Angular
RUN npm run build --prod

# Imagem base do Nginx para servir a aplicação
FROM nginx:alpine

# Copia os arquivos gerados no build para o diretório padrão do Nginx
COPY --from=build /app/dist/ /usr/share/nginx/html

# Expõe a porta 80 do contêiner
EXPOSE 80

# Comando para rodar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]

# Use a imagem oficial do Node.js como base
FROM node:latest

# Configure o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie os arquivos de código-fonte para o contêiner
COPY . .

# Instale as dependências do npm
RUN npm install

# Construa a aplicação Next.js
RUN npm run build

# Exponha a porta que sua aplicação Next.js está ouvindo
EXPOSE 3001

# Comando para iniciar sua aplicação quando o contêiner for iniciado
CMD ["npm", "start"]

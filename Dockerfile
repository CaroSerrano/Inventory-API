# Start your image with a node base image
FROM node:18-alpine

# The /app directory should act as the main application directory
WORKDIR /Inventory-API

# Copy the app package and package-lock.json file
COPY package*.json ./

# Instalar dependencias con un usuario no root y eliminar archivos innecesarios
RUN npm install && \
    npm cache clean --force

# Copiar solo el código de la aplicación (optimización del contexto)
# Copy local directories to the current local directory of our docker image (/app)
COPY src/ ./src
#COPY ./public ./public

# Exponer el puerto que usa tu aplicación
EXPOSE 3001

# Definir la variable de entorno para producción
ENV NODE_ENV=production

# Comando para iniciar la aplicación
CMD npm start

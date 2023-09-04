# # ###################
# # # BUILD FOR LOCAL DEVELOPMENT
# # ###################

# # FROM node:16.20.0 As development

# # # Create app directory
# # WORKDIR /usr/src/app

# # # Copy application dependency manifests to the container image.
# # # A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# # # Copying this first prevents re-running npm install on every code change.
# # COPY --chown=node:node package*.json ./

# # # Install app dependencies using the `npm ci` command instead of `npm install`
# # RUN npm ci

# # # Bundle app source
# # COPY --chown=node:node . .

# # # Use the node user from the image (instead of the root user)
# # USER node

# # ###################
# # # BUILD FOR PRODUCTION
# # ###################

# # FROM node:16.20.0 As build

# # WORKDIR /usr/src/app

# # COPY --chown=node:node package*.json ./

# # # In order to run `npm run build` we need access to the Nest CLI which is a dev dependency. In the previous development stage we ran `npm ci` which installed all dependencies, so we can copy over the node_modules directory from the development image
# # COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

# # COPY --chown=node:node . .

# # # Run the build command which creates the production bundle
# # RUN npm run build

# # # Set NODE_ENV environment variable
# # ENV NODE_ENV production

# # # Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
# # RUN npm ci --only=production && npm cache clean --force

# # USER node

# # ###################
# # # PRODUCTION
# # ###################

# # FROM node:16.20.0 As production

# # # Copy the bundled code from the build stage to the production image
# # COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
# # COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# # # Start the server using the production build
# # CMD [ "node", "dist/main.js" ]


# FROM node:16

# WORKDIR /app

# COPY package*.json ./

# RUN npm install --legacy-peer-deps --force

# COPY . .

# RUN npm run build

# CMD [ "node", "run", "start:dev" ]

# Base image
# FROM node:16

# # Create app directory
# WORKDIR /usr/src/app

# # A wildcard is used to ensure both package.json AND package-lock.json are copied
# COPY package*.json ./

# # Install app dependencies
# RUN npm install --legacy-peer-deps --force

# # Bundle app source
# COPY . .

# # Creates a "dist" folder with the production build
# RUN npm run build

# # Start the server using the production build
# CMD [ "node", "dist/main.js" ]

ARG NODE_VERSION=16.20.0
ARG NODE_ENV=build
ARG APP_PORT=3000
ARG IMAGE_NAME=tabur-be-docker

# Utiliza una versión ligera de Node.js como imagen base
FROM node:${NODE_VERSION}-alpine as builder
# Establece la variable de entorno NODE_ENV a partir del ARG
ENV NODE_ENV=${NODE_ENV}

# Define el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos package.json y yarn.lock al contenedor
COPY package*.json ./

# Instala las dependencias del proyecto utilizando Yarn
RUN npm install --legacy-peer-deps --force

# Copia el resto del código del proyecto al contenedor
COPY . .

# Construye la aplicación
RUN npm run build

# ---

# Comienza una nueva etapa para reducir el tamaño de la imagen final
FROM node:${NODE_VERSION}-alpine
# Información sobre la imagen, con el valor de la etiqueta name parametrizado
LABEL name=${IMAGE_NAME}

# Define un usuario sin privilegios para ejecutar la aplicación
USER node
# Define el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos y directorios desde la etapa de construcción
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules/ ./node_modules/
COPY --from=builder /usr/src/app/dist ./dist

# Expone el puerto que usa la aplicación
EXPOSE ${APP_PORT}
# Define el comando para iniciar la aplicación
CMD ["npm","run", "start"]

# Define un healthcheck para verificar la salud de la aplicación
# Dependiendo de la configuración de tu aplicación, necesitarás ajustar este comando
# Aquí se asume que tu aplicación tiene un endpoint GET /v1/health/liveness que devuelve un código de estado 200 si está en funcionamiento
# HEALTHCHECK CMD curl --fail http://localhost:${APP_PORT}/v1/health/liveness || exit 1
# Utiliser la dernière version stable de Node.js
FROM node:current-bullseye

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    watchman \
    openjdk-11-jdk \
    && apt-get clean

# Définir le répertoire de travail
WORKDIR /app

# Copier uniquement les fichiers nécessaires pour npm install
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier les autres fichiers du projet
COPY . .

# Supprimer les caches inutiles
RUN rm -rf node_modules/.cache

# Utiliser la CLI locale d'Expo
CMD ["npx", "expo", "start"]
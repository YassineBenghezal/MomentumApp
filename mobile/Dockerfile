# Utiliser une image de base Node.js
FROM node:18

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de configuration (package.json, etc.)
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Exposer le port pour Expo
EXPOSE 19000 19001 19002

# Démarrer Expo
CMD ["npx", "expo", "start"]

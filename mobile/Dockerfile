FROM node:18-alpine

# Installer Expo CLI et ngrok une seule fois
RUN npm install -g expo-cli @expo/ngrok

# Copier les fichiers package.json pour installer uniquement les dépendances nécessaires
WORKDIR /app
COPY package*.json ./

# Installer les dépendances locales
RUN npm install

# Copier le reste du code source
COPY . .

# Commande par défaut pour Expo
CMD ["npm", "start", "--", "--tunnel"]

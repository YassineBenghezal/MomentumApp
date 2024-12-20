# Étape 1 : Utiliser une image Node.js
FROM node:18

# Étape 2 : Définir le répertoire de travail
WORKDIR /app

# Étape 3 : Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Étape 4 : Installer les dépendances
RUN npm install

# Étape 5 : Copier tout le code source
COPY . .

# Étape 6 : Compiler TypeScript
RUN npm run build

# Étape 7 : Exécuter l'application
CMD ["npm", "start"]

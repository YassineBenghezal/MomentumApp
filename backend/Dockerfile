# Utiliser la dernière version stable de Node.js
FROM node:current-bullseye

# Installer les dépendances nécessaires (si applicables)
RUN apt-get update && apt-get install -y \
    && apt-get clean

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers nécessaires
COPY package.json package-lock.json ./
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Exposer le port du backend (par exemple, 3000)
EXPOSE 3000

# Commande par défaut pour démarrer le backend
CMD ["npm", "start"]

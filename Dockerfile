# Utiliser l'image officielle Node.js
FROM node:18-alpine

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier package.json et package-lock.json depuis backend
COPY backend/package*.json ./

# Installer les dépendances dans le conteneur
RUN npm install

# Copier le reste du code du dossier backend
COPY backend/ .

# Exposer le port 3000
EXPOSE 3000

# Lancer l'application (index.js)
CMD ["node", "index.js"]

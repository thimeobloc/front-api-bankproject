# Étape de build (Node compatible avec Vite)
FROM node:20 AS build

# Dossier de travail
WORKDIR /app

# Copie uniquement des fichiers de dépendances
COPY package.json package-lock.json ./

# Installation propre et reproductible des dépendances
RUN npm ci

# Copie du reste du projet
COPY . .

# Build de l'application Vite
RUN npm run build

# Étape de production (Nginx)
FROM nginx:alpine

# Suppression de la config Nginx par défaut
RUN rm /etc/nginx/conf.d/default.conf

# Copie des fichiers buildés vers Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exposition du port
EXPOSE 80

# Lancement de Nginx
CMD ["nginx", "-g", "daemon off;"]

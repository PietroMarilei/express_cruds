# Usa un'immagine base di Node.js
FROM node:latest AS build-env

ENV FACEBOOK_ID="${FACEBOOK_ID}"
ENV PORT="${PORT}"

VOLUME [ "/app" ]

# Imposta il working directory all'interno del contenitore
WORKDIR /app

# Copia il file package.json e package-lock.json nella directory di lavoro# 
COPY package*.json ./

# Installa le dipendenze
RUN npm install 

# Copia tutti i file nell'attuale directory di lavoro del tuo host nel contenitore
COPY . ./

# Compila il tuo progetto TypeScript (se necessario)
RUN npm run build

# FROM node:latest AS run-env
# WORKDIR /app
# COPY --from=build-env ./dist /app

WORKDIR /app/dist

# Esponi la porta su cui il server Express.js sta ascoltando
EXPOSE "${PORT}"

# Comando per eseguire l'applicazione quando il contenitore è avviato
CMD ["node", "index.js"]

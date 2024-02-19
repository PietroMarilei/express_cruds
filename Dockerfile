# Usa un'immagine base di Node.js
FROM node:latest

# Imposta il working directory all'interno del contenitore
WORKDIR /usr/src/app

# Copia il file package.json e package-lock.json nella directory di lavoro
COPY package*.json ./

# Installa le dipendenze
RUN npm install 

# Copia tutti i file nell'attuale directory di lavoro del tuo host nel contenitore
COPY . .

# Compila il tuo progetto TypeScript (se necessario)
RUN npm run build

# Esponi la porta su cui il server Express.js sta ascoltando
EXPOSE 3000

# Comando per eseguire l'applicazione quando il contenitore è avviato
CMD ["npm", "run", "dev"]

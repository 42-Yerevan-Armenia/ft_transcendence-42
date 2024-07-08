FROM node:21.6.0

WORKDIR /app/frontend

RUN npm install -g npm@latest

COPY frontend/package*.json ./

COPY . .

CMD ["npm", "run", "dev"]

FROM node:21.6.0

WORKDIR /app/Front-End

RUN npm install -g npm@latest

COPY Front-End/package*.json ./

COPY . .

CMD ["npm", "run", "dev"]

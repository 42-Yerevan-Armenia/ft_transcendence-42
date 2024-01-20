FROM node:21.6.0

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install -g npm@latest

RUN npm install

# RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# RUN npm install node

# RUN export NVM_DIR="$HOME/.nvm"
#     [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# RUN nvm install node

# RUN nvm install node --reinstall-packages-from=node

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]

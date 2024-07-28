FROM node:20.16.0-alpine3.20

WORKDIR /app

COPY package.json /app/

RUN npm install

COPY . /app/

RUN npm run build --quite

COPY ./env/deploy.env /etc/deploy.env

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
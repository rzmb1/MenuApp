FROM node:18-alpine

WORKDIR /work

#COPY package.json and package_lock.json
COPY package*.json ./

#No dev dependencies
RUN npm ci --only=production

#COPY everything else from project
COPY . .

ENV NODE_ENV production

USER node

EXPOSE 8080

CMD ["node", "server.js"]
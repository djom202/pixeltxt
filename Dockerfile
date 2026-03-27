FROM node:22-bookworm-slim
WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

ENV NODE_ENV=production
ENTRYPOINT ["node", "dist/cli.js"]
CMD ["run", "--help"]

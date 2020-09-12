FROM node:12-alpine
WORKDIR /
COPY . .
WORKDIR /app
RUN yarn install --production
EXPOSE 3000
CMD ["node", "src/index.js"]
ENV NODE dev

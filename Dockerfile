FROM node:20-alpine AS runtime
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]

# Dockerfile para FE-CRM (Next.js)
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
COPY src/assets/ src/assets/
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]


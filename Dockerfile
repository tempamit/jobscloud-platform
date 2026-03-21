# File: Dockerfile
FROM node:22.17.1-alpine

WORKDIR /app

# Install OpenSSL (Required by Prisma on Alpine Linux)
RUN apk add --no-cache openssl

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your project code
COPY . .

# Pull in the Database URL from Coolify's Environment Variables
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL

# Generate the Prisma Client and Build the 80 Matrix Pages
RUN npx prisma generate
RUN npm run build

# Expose the port Next.js uses
EXPOSE 3000

# Start the application!
CMD ["npm", "start"]
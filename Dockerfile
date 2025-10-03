# Use the official Node.js 18 runtime as the base image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port that the app runs on (Cloud Run will set PORT)
EXPOSE 8080

# Start the application, using PORT env var if set, otherwise 3000
CMD ["sh", "-c", "npx next start -p ${PORT:-3000}"]
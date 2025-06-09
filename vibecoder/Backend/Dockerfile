# Multi-stage build for optimized production image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Install dependencies for building native modules
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    libc6-compat

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM base AS development

# Install all dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start development server
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build

# Install all dependencies including dev dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vibecoder -u 1001

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && \
    npm cache clean --force && \
    rm -rf /tmp/*

# Copy built application from build stage
COPY --from=build --chown=vibecoder:nodejs /app/dist ./dist
COPY --from=build --chown=vibecoder:nodejs /app/prisma ./prisma

# Create uploads directory
RUN mkdir -p uploads && chown vibecoder:nodejs uploads

# Switch to non-root user
USER vibecoder

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/server.js"]

# Production with PM2 stage (alternative)
FROM production AS production-pm2

# Install PM2 globally
RUN npm install -g pm2

# Copy PM2 configuration
COPY ecosystem.config.js ./

# Start with PM2
CMD ["pm2-runtime", "start", "ecosystem.config.js"]

# Labels for better container management
LABEL maintainer="VibeCoder Team"
LABEL version="1.0.0"
LABEL description="VibeCoder Backend API"
LABEL org.opencontainers.image.source="https://github.com/vibecoder/backend"

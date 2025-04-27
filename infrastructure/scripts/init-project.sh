#!/bin/bash

# Exit on error
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Initializing Freiplatzfinder project...${NC}"

# Create necessary directories
echo -e "${GREEN}Creating necessary directories...${NC}"
mkdir -p uploads logs

# Install dependencies
echo -e "${GREEN}Installing dependencies...${NC}"
npm install

# Create .env files if they don't exist
echo -e "${GREEN}Creating environment files...${NC}"
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo -e "${YELLOW}Created .env file from template. Please update with your settings.${NC}"
fi

if [ ! -f "backend/.env" ]; then
  cp backend/.env.example backend/.env
  echo -e "${YELLOW}Created backend/.env file from template. Please update with your settings.${NC}"
fi

# Start Docker containers
echo -e "${GREEN}Starting Docker containers...${NC}"
docker-compose up -d postgres redis

# Wait for database to be ready
echo -e "${GREEN}Waiting for database to be ready...${NC}"
sleep 5

# Run database migrations
echo -e "${GREEN}Running database migrations...${NC}"
cd backend && npm run db:migrate

# Seed database with initial data
echo -e "${GREEN}Seeding database with initial data...${NC}"
cd backend && npm run db:seed

echo -e "${GREEN}Project initialization complete!${NC}"
echo -e "${YELLOW}You can now start the development servers with:${NC}"
echo -e "${YELLOW}npm run dev${NC}"

#!/bin/bash

# Development setup script
set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting development environment setup${NC}"

# Start PostgreSQL container
echo -e "${YELLOW}📦 Starting PostgreSQL container...${NC}"
docker compose -f docker-compose.dev.yml up -d postgres

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
sleep 5

# Check if PostgreSQL is ready
until docker compose -f docker-compose.dev.yml exec postgres pg_isready -U postgres; do
  echo -e "${YELLOW}⏳ PostgreSQL is not ready yet, waiting...${NC}"
  sleep 2
done

echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"
echo -e "${GREEN}🌐 PostgreSQL available at localhost:5432${NC}"
echo -e "${GREEN}📋 Database: nestjs_db${NC}"
echo -e "${GREEN}👤 Username: postgres${NC}"
echo -e "${GREEN}🔑 Password: password123${NC}"

echo -e "${YELLOW}💡 To start your NestJS app:${NC}"
echo -e "  npm run start:dev"

echo -e "${YELLOW}💡 To stop PostgreSQL:${NC}"
echo -e "  docker compose -f docker-compose.dev.yml down"
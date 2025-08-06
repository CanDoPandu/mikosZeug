#!/bin/bash

# Deployment script for NestJS Backend
# This script handles both rootless Docker and system-wide deployment

set -e

# Configuration
CONTAINER_NAME="nestjs-backend-prod"
IMAGE_NAME="ghcr.io/candopandu/mikoszeug:latest"
HOST_PORT="3000"
CONTAINER_PORT="3000"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting deployment of NestJS Backend${NC}"

# Check if running as rootless Docker
if docker info >/dev/null 2>&1; then
    echo -e "${GREEN}✅ Docker is available${NC}"
    
    # Pull latest image
    echo -e "${YELLOW}📥 Pulling latest image...${NC}"
    docker pull $IMAGE_NAME
    
    # Stop and remove existing container if it exists
    if docker ps -a --format 'table {{.Names}}' | grep -q $CONTAINER_NAME; then
        echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
        docker stop $CONTAINER_NAME || true
        docker rm $CONTAINER_NAME || true
    fi
    
    # Run new container
    echo -e "${YELLOW}🏃 Starting new container...${NC}"
    docker run -d \
        --name $CONTAINER_NAME \
        --restart unless-stopped \
        -p $HOST_PORT:$CONTAINER_PORT \
        -e NODE_ENV=production \
        --health-cmd="wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1" \
        --health-interval=30s \
        --health-timeout=10s \
        --health-retries=5 \
        --health-start-period=30s \
        $IMAGE_NAME
    
    echo -e "${GREEN}✅ Container started successfully!${NC}"
    echo -e "${GREEN}🌐 Application available at: http://localhost:$HOST_PORT${NC}"
    
    # Show container status
    echo -e "${YELLOW}📊 Container status:${NC}"
    docker ps -f name=$CONTAINER_NAME
    
else
    echo -e "${RED}❌ Docker is not available or not running${NC}"
    echo -e "${YELLOW}Please ensure Docker is installed and running${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
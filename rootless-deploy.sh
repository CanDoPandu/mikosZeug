#!/bin/bash

# Rootless Docker deployment script for NestJS Backend
# This script sets up persistent rootless Docker deployment

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
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Setting up rootless Docker deployment${NC}"

# Check if rootless Docker is set up
if ! command -v dockerd-rootless-setuptool.sh &> /dev/null; then
    echo -e "${RED}❌ dockerd-rootless-setuptool.sh not found${NC}"
    echo -e "${YELLOW}Please install Docker with rootless support first${NC}"
    exit 1
fi

# Set up rootless Docker if not already done
echo -e "${YELLOW}🔧 Setting up rootless Docker...${NC}"
dockerd-rootless-setuptool.sh install || echo "Rootless Docker might already be installed"

# Enable lingering for the user (allows services to run without being logged in)
echo -e "${YELLOW}🔄 Enabling user lingering...${NC}"
sudo loginctl enable-linger $USER

# Create systemd user service directory
SERVICE_DIR="$HOME/.config/systemd/user"
mkdir -p "$SERVICE_DIR"

# Create user service file
echo -e "${YELLOW}📝 Creating systemd user service...${NC}"
cat > "$SERVICE_DIR/nestjs-backend.service" << EOF
[Unit]
Description=NestJS Backend Container (Rootless)
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
Environment="PATH=/usr/local/bin:/usr/bin:/bin:\$HOME/.local/bin"
Environment="XDG_RUNTIME_DIR=\$HOME/.docker/run"
Environment="DOCKER_HOST=unix://\$HOME/.docker/run/docker.sock"
ExecStartPre=-docker stop $CONTAINER_NAME
ExecStartPre=-docker rm $CONTAINER_NAME
ExecStartPre=docker pull $IMAGE_NAME
ExecStart=docker run -d \\
    --name $CONTAINER_NAME \\
    --restart unless-stopped \\
    -p $HOST_PORT:$CONTAINER_PORT \\
    -e NODE_ENV=production \\
    --health-cmd="wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1" \\
    --health-interval=30s \\
    --health-timeout=10s \\
    --health-retries=5 \\
    --health-start-period=30s \\
    $IMAGE_NAME
ExecStop=docker stop $CONTAINER_NAME
ExecStopPost=docker rm $CONTAINER_NAME
TimeoutStartSec=300
Restart=on-failure
RestartSec=10

[Install]
WantedBy=default.target
EOF

# Reload systemd and enable the service
echo -e "${YELLOW}🔄 Reloading systemd and enabling service...${NC}"
systemctl --user daemon-reload
systemctl --user enable nestjs-backend.service

# Start the service
echo -e "${YELLOW}🏃 Starting the service...${NC}"
systemctl --user start nestjs-backend.service

# Check service status
echo -e "${BLUE}📊 Service status:${NC}"
systemctl --user status nestjs-backend.service --no-pager

echo -e "${GREEN}✅ Rootless Docker deployment setup completed!${NC}"
echo -e "${GREEN}🌐 Application should be available at: http://localhost:$HOST_PORT${NC}"
echo -e "${BLUE}💡 Useful commands:${NC}"
echo -e "  ${YELLOW}Check status:${NC} systemctl --user status nestjs-backend.service"
echo -e "  ${YELLOW}Stop service:${NC} systemctl --user stop nestjs-backend.service"
echo -e "  ${YELLOW}Start service:${NC} systemctl --user start nestjs-backend.service"
echo -e "  ${YELLOW}View logs:${NC} journalctl --user -u nestjs-backend.service -f"
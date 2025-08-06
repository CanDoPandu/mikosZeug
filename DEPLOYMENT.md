# Docker Deployment Guide

This guide explains how to deploy your NestJS backend application using Docker with public availability.

## 🏗️ Architecture Overview

Your application uses:
- **NestJS** backend framework
- **Multi-stage Dockerfile** for optimized production builds
- **GitHub Container Registry (GHCR)** for image hosting
- **GitHub Actions** for automated CI/CD

## 📦 Container Registry Setup

Your Docker images are automatically built and published to GitHub Container Registry:
- Repository: `ghcr.io/candopandu/mikoszeug`
- Public access: Available without authentication
- Automated builds: Triggered by releases

### Access Your Published Image

```bash
# Pull the latest image
docker pull ghcr.io/candopandu/mikoszeug:latest

# Or specific version
docker pull ghcr.io/candopandu/mikoszeug:v1.0.0
```

## 🚀 Deployment Options

### Option 1: Simple Docker Run (Quick Start)

```bash
# Run the application directly
docker run -d \
  --name nestjs-backend-prod \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  ghcr.io/candopandu/mikoszeug:latest
```

### Option 2: Using Docker Compose (Recommended)

```bash
# Start with docker-compose
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop
docker-compose -f docker-compose.prod.yml down
```

### Option 3: Automated Deployment Script

```bash
# Make script executable and run
chmod +x deploy.sh
./deploy.sh
```

## 🔒 Rootless Docker Deployment

For secure server deployment without root privileges:

### Setup Rootless Docker

1. **SSH into your server:**
   ```bash
   ssh username@your-server.com
   # Or via tlvdevops_user and switch:
   sudo machinectl shell myuser@
   ```

2. **Install rootless Docker (one-time setup):**
   ```bash
   dockerd-rootless-setuptool.sh install
   ```

3. **Deploy with persistence:**
   ```bash
   chmod +x rootless-deploy.sh
   ./rootless-deploy.sh
   ```

This script:
- Sets up rootless Docker if needed
- Enables user lingering (service runs without login)
- Creates a systemd user service
- Starts the application automatically

### Managing the Rootless Service

```bash
# Check status
systemctl --user status nestjs-backend.service

# Start/stop/restart
systemctl --user start nestjs-backend.service
systemctl --user stop nestjs-backend.service
systemctl --user restart nestjs-backend.service

# View logs
journalctl --user -u nestjs-backend.service -f

# Enable/disable auto-start
systemctl --user enable nestjs-backend.service
systemctl --user disable nestjs-backend.service
```

## 🌐 External Provider Deployment

### Railway.app
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link
railway up
```

### Render.com
1. Connect your GitHub repository
2. Set service type to "Web Service"
3. Use Docker runtime
4. Auto-deploy enabled

### DigitalOcean App Platform
1. Create new app from GitHub
2. Select Docker as build method
3. Configure environment variables

## 🔄 CI/CD Pipeline

Your setup includes automated workflows:

1. **Release Workflow** (`release.yml`):
   - Triggered manually with version bump
   - Creates git tag and release
   - Triggers build workflow

2. **Build & Deploy Workflow** (`build-and-deploy.yml`):
   - Builds multi-platform Docker image (amd64/arm64)
   - Publishes to GitHub Container Registry
   - Uses proper caching for faster builds

### Triggering a Deployment

1. Go to GitHub Actions tab
2. Run "Release and Dispatch" workflow
3. Choose version type (patch/minor/major)
4. Image will be built and published automatically

## 🔍 Health Checks & Monitoring

The deployment includes health checks:
- **Health endpoint**: `GET /`
- **Check interval**: 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 5 attempts

Monitor your application:
```bash
# Check container health
docker ps
docker inspect nestjs-backend-prod

# View application logs
docker logs -f nestjs-backend-prod

# Monitor resource usage
docker stats nestjs-backend-prod
```

## 🛠️ Troubleshooting

### Container Won't Start
```bash
# Check logs
docker logs nestjs-backend-prod

# Check if port is available
netstat -tlnp | grep :3000

# Remove and recreate
docker stop nestjs-backend-prod
docker rm nestjs-backend-prod
./deploy.sh
```

### Rootless Docker Issues
```bash
# Check Docker daemon status
systemctl --user status docker

# Restart Docker daemon
systemctl --user restart docker

# Check environment variables
echo $XDG_RUNTIME_DIR
echo $DOCKER_HOST
```

### Network Access Issues
```bash
# Test local access
curl http://localhost:3000

# Check firewall (if on server)
sudo ufw status
sudo ufw allow 3000
```

## 🔐 Security Considerations

- **Rootless deployment** reduces attack surface
- **Non-root container user** for additional security
- **Health checks** for automatic recovery
- **Restart policies** for high availability
- **Environment variables** for sensitive configuration

## 📈 Performance Tips

- **Multi-stage builds** reduce image size
- **Node.js production mode** optimizes performance
- **Health checks** enable automatic restarts
- **Docker BuildKit caching** speeds up builds

Your application is now ready for production deployment! 🎉
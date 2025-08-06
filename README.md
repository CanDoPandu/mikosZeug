# NestJS Backend Example

Example NestJS backend application with Docker support and automated CI/CD using GitHub Actions.

## Features

- **NestJS Framework**: Modern Node.js backend framework
- **Docker Support**: Containerized application with multi-stage build
- **Automated Versioning**: Using release-it for semantic versioning
- **GitHub Actions CI/CD**: Automated builds and deployments
- **Container Registry**: Automated Docker image publishing to GitHub Container Registry

## Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build the application
npm run build

# Run in production mode
npm run start:prod
```

The application will be available at `http://localhost:3000`

### Docker

```bash
# Build Docker image
docker build -t nestjs-backend-example .

# Run container
docker run -p 3000:3000 nestjs-backend-example
```

### Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## GitHub Actions Workflows

### Release Workflow (`release.yml`)
- Triggered manually via workflow_dispatch
- Creates a new version using release-it
- Triggers repository dispatch event for deployment

### Build and Deploy Workflow (`build-and-deploy.yml`)
- Triggered by repository dispatch event
- Builds Docker image with multi-platform support
- Pushes to GitHub Container Registry with version tags

## Usage

1. Create a public GitHub repository
2. Push this code to the repository
3. Use "Actions" → "Release and Dispatch" to create a new release
4. Choose version type (patch/minor/major)
5. The workflow will automatically build and push the Docker image

## API Endpoints

- `GET /` - Returns "Hello World!"

## Project Structure

```
src/
├── app.controller.ts    # Main controller
├── app.module.ts        # Root module
├── app.service.ts       # Application service
└── main.ts             # Application entry point
```
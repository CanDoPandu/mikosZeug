#!/bin/bash

# Test docker-compose configuration
echo "🧪 Testing Docker Compose configurations..."

echo "📋 Validating docker-compose.yml..."
if docker compose -f docker-compose.yml config > /dev/null 2>&1; then
  echo "✅ docker-compose.yml is valid"
else
  echo "❌ docker-compose.yml has errors"
  docker compose -f docker-compose.yml config
  exit 1
fi

echo "📋 Validating docker-compose.prod.yml..."
if docker compose -f docker-compose.prod.yml config > /dev/null 2>&1; then
  echo "✅ docker-compose.prod.yml is valid"
else
  echo "❌ docker-compose.prod.yml has errors"
  docker compose -f docker-compose.prod.yml config
  exit 1
fi

echo "📋 Validating docker-compose.dev.yml..."
if docker compose -f docker-compose.dev.yml config > /dev/null 2>&1; then
  echo "✅ docker-compose.dev.yml is valid"
else
  echo "❌ docker-compose.dev.yml has errors"
  docker compose -f docker-compose.dev.yml config
  exit 1
fi

echo "🎉 All Docker Compose files are valid!"
# Railway Deployment Guide

This guide explains how to deploy your NestJS backend with PostgreSQL on Railway.

## 🚂 Railway Setup

### 1. Add PostgreSQL Database

**Via Railway Dashboard:**
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Open your project: "luminous-laughter"
3. Click "+ New Service"
4. Select "Database" → "PostgreSQL"
5. Railway automatically creates the database and provides connection variables

**Via CLI (if available):**
```bash
railway add --database postgres
```

### 2. Verify Database Variables

Railway automatically provides these variables:
```bash
railway variables
```

You should see:
- `DATABASE_URL` - Complete connection string
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` - Individual parameters

## 🔧 Configuration

Your NestJS app automatically detects Railway's `DATABASE_URL` and configures accordingly:

- **Railway**: Uses `DATABASE_URL` with SSL
- **Local**: Uses individual DB parameters from `.env`

## 📊 Access Your Database

### 1. Railway Dashboard (Easiest)
- Go to your Railway project
- Click on the PostgreSQL service
- Use the built-in database browser

### 2. External Database Tools
Use the connection details from Railway variables:
```bash
railway variables | grep PG
```

Connect with tools like:
- **TablePlus**, **DBeaver**, **DataGrip**
- **pgAdmin**: Use the `PGHOST`, `PGPORT`, etc. values

### 3. Via Your API Endpoints

Test your deployed API:
```bash
# Get all users
curl https://mikoszeug-production.up.railway.app/users

# Get specific user
curl https://mikoszeug-production.up.railway.app/users/1

# Create new user
curl -X POST https://mikoszeug-production.up.railway.app/users \
  -H "Content-Type: application/json" \
  -d '{"email": "test@railway.com", "firstName": "Railway", "lastName": "User"}'
```

## 🚀 Deployment Process

1. **Push changes** (triggers automatic deployment):
   ```bash
   git add .
   git commit -m "Update database configuration for Railway"
   git push
   ```

2. **Railway auto-deploys** your updated image from GitHub Container Registry

3. **Database migration** happens automatically with `synchronize: true` in development

## 🔍 Debugging

### Check Application Logs
```bash
railway logs
```

### Verify Database Connection
```bash
railway shell
# Then inside the container:
node -e "console.log(process.env.DATABASE_URL)"
```

### Test Database Connection
Your app automatically seeds sample users on startup. Check:
```bash
curl https://mikoszeug-production.up.railway.app/users
```

## 🛡️ Production Considerations

For production, consider:
- Set `synchronize: false` and use proper migrations
- Add database backup strategy
- Monitor connection pooling
- Set up proper error handling for database failures

Your database is now ready! 🎉
# n8n Installation Alternatives

Since Docker is not installed on your system, here are alternative ways to install and run n8n:

## 🚀 Option 1: npm Installation (Recommended)

### Step 1: Install n8n globally
```bash
npm install n8n -g
```

### Step 2: Start n8n
```bash
n8n start
```

### Step 3: Access n8n
- Open your browser to: http://localhost:5678
- Create your first account
- Set up your API key in Settings > API Keys

## 🚀 Option 2: Install Docker Desktop

### Step 1: Download Docker Desktop
1. Go to https://www.docker.com/products/docker-desktop
2. Download Docker Desktop for Windows
3. Install and restart your computer

### Step 2: Start n8n with Docker
```bash
npm run n8n:start
```

## 🚀 Option 3: Manual Setup

### Step 1: Create n8n directory
```bash
mkdir n8n-app
cd n8n-app
```

### Step 2: Initialize npm project
```bash
npm init -y
```

### Step 3: Install n8n
```bash
npm install n8n
```

### Step 4: Create start script
Add this to your `package.json`:
```json
{
  "scripts": {
    "start": "n8n start"
  }
}
```

### Step 5: Start n8n
```bash
npm start
```

## 🔧 Environment Setup

### Add to your `.env` file:
```bash
# n8n Configuration
VITE_N8N_URL=http://localhost:5678
VITE_N8N_API_KEY=n8n_api_6209b969611232dbcf1350a6cf8b4258a82a2c43903cbe44c694c06a35032ecb16603d8c6e75f1e1
VITE_N8N_WEBHOOK_URL=http://localhost:5678/webhook
```

### Get your n8n API key:
1. Start n8n
2. Go to Settings > API Keys
3. Create a new API key
4. Copy the key to your `.env` file

## 📋 Quick Test

Once n8n is running, test the integration:

1. **Check n8n is running**: http://localhost:5678
2. **Test your app integration**: http://localhost:3000/workflow
3. **Use the Test Panel**: Import the `N8nTestPanel` component to test workflows

## 🎯 Recommended Approach

**For development**: Use npm installation (Option 1)
**For production**: Install Docker Desktop (Option 2)

## 🆘 Troubleshooting

### Port 5678 already in use
```bash
# Check what's using the port
netstat -ano | findstr :5678

# Kill the process or use a different port
n8n start --port 5679
```

### Permission issues
```bash
# Run as administrator or use npx
npx n8n start
```

### Node.js version issues
```bash
# Check Node.js version (n8n requires 16+)
node --version

# Update Node.js if needed from https://nodejs.org/
```

## 🎉 Next Steps

1. Choose an installation method above
2. Start n8n
3. Add environment variables to your `.env` file
4. Test the integration in your app
5. Create your first workflow!

---

**Need help?** Check the main `N8N_INTEGRATION_GUIDE.md` for detailed workflow examples. 
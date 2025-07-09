# WSL Setup Guide for Trade Ease

This guide helps you set up and troubleshoot the Trade Ease application in WSL (Windows Subsystem for Linux).

## Issues Fixed

### 1. Permission Issues
- **Problem**: `EACCES: permission denied` when installing dependencies
- **Solution**: Use yarn instead of npm, or move project to WSL filesystem

### 2. File System Watching
- **Problem**: Hot reload not working in WSL
- **Solution**: Enable polling in Vite configuration

### 3. Terminal Display Issues
- **Problem**: "bogus screen size" warnings
- **Solution**: Set proper terminal environment

### 4. Path Resolution
- **Problem**: Windows/WSL path incompatibilities
- **Solution**: Use proper path aliases and WSL-compatible settings

## Setup Steps

### 1. Install Dependencies
```bash
# Clean up any existing installations
rm -rf node_modules package-lock.json

# Install yarn globally if not available
npm install -g yarn

# Install dependencies with yarn (handles WSL permissions better)
yarn install
```

### 2. Environment Configuration
Create or update `.env.local` with WSL-specific settings:
```env
# WSL-specific environment configuration
VITE_APP_ENV=development
NODE_OPTIONS=--max-old-space-size=4096
FORCE_COLOR=1
TERM=xterm-256color
VITE_HOST=0.0.0.0
VITE_PORT=8080

# N8N Configuration (WSL-compatible paths)
N8N_DATABASE_SQLITE_DATABASE=$HOME/.n8n/database.sqlite
```

### 3. Start Development Server
```bash
# Start the development server
yarn dev
```

### 4. Access the Application
- **WSL**: Open browser and go to `http://localhost:8080`
- **Windows**: Access via `http://localhost:8080` from Windows browser

## Troubleshooting

### Permission Errors
If you encounter permission errors:
```bash
# Option 1: Use yarn instead of npm
yarn install

# Option 2: Copy project to WSL filesystem
cp -r /mnt/c/path/to/project ~/project-wsl
cd ~/project-wsl
yarn install
```

### File Watching Issues
If hot reload doesn't work:
1. Ensure polling is enabled in `vite.config.ts`
2. Check that `usePolling: true` is set in the watch options

### Terminal Display Issues
If you see screen size warnings:
```bash
export TERM=xterm-256color
```

### Build Issues
If build fails with module resolution errors:
```bash
# Clear cache and reinstall
yarn cache clean
rm -rf node_modules yarn.lock
yarn install
```

## WSL-Specific Optimizations

### Vite Configuration
The `vite.config.ts` has been updated with:
- Polling enabled for file watching
- Proper intervals for WSL performance
- Disabled auto-open (not needed in WSL)
- WSL-specific esbuild optimizations

### File Watching
```javascript
watch: {
  usePolling: true,
  interval: 1000,
  binaryInterval: 1000,
  ignored: ['**/node_modules/**', '**/.git/**']
}
```

### Performance Tips
1. Use yarn instead of npm for better WSL compatibility
2. Enable polling for file watching
3. Set proper Node.js memory limits
4. Use WSL2 for better performance

## Common Commands

### Development
```bash
# Start development server
yarn dev

# Build for production
yarn build

# Run tests
yarn test

# Lint code
yarn lint
```

### Debugging
```bash
# Check Node.js version
node --version

# Check installed packages
yarn list

# Clear cache
yarn cache clean

# Check development server status
ps aux | grep vite
```

## Additional Notes

### Windows Integration
- The project can be accessed from Windows browsers
- File changes are detected through WSL polling
- Git operations work normally in WSL

### Performance Considerations
- Use WSL2 for better performance
- Enable polling for file watching
- Set appropriate Node.js memory limits
- Consider using WSL filesystem for better I/O performance

## Support

If you encounter issues not covered in this guide:
1. Check the WSL documentation
2. Verify Node.js and yarn versions
3. Ensure Windows and WSL are properly configured
4. Check firewall settings if network issues occur 
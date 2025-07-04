# n8n Integration Setup Guide

## Overview

Your custom workflow builder components have been replaced with n8n integration. n8n is a powerful, open-source workflow automation tool that provides a visual interface for creating complex automation workflows.

## What Was Replaced

The following custom components have been replaced with n8n integration:
- Custom workflow builder (`src/pages/Workflow/index.new.tsx`)
- Custom workflow components (Flow, NodeSidebar, WorkflowAIModal, etc.)
- Custom node types and editors
- Custom workflow management system

## n8n Installation & Setup

### Option 1: Docker (Recommended)

1. **Install Docker** (if not already installed)
   ```bash
   # Windows: Download from https://www.docker.com/products/docker-desktop
   # macOS: Download from https://www.docker.com/products/docker-desktop
   # Linux: Follow your distribution's instructions
   ```

2. **Run n8n with Docker**
   ```bash
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8nio/n8n
   ```

3. **For persistent data (recommended for production)**
   ```bash
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -e GENERIC_TIMEZONE="America/New_York" \
     -e TZ="America/New_York" \
     -v n8n_data:/home/node/.n8n \
     n8nio/n8n
   ```

### Option 2: npm Installation

1. **Install n8n globally**
   ```bash
   npm install n8n -g
   ```

2. **Start n8n**
   ```bash
   n8n start
   ```

### Option 3: Docker Compose (Production)

Create a `docker-compose.yml` file:

```yaml
version: '3.8'

services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - GENERIC_TIMEZONE=America/New_York
      - TZ=America/New_York
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your-secure-password
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

Then run:
```bash
docker-compose up -d
```

## Configuration

<<<<<<< HEAD
### Environment VariablesVITE_N8N_URL=http://localhost:5678
=======
### Environment Variables
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7

Add the following to your `.env` file:
```env
# n8n Configuration
VITE_N8N_URL=http://localhost:5678
```

For production, update the URL to your n8n instance:
```env
VITE_N8N_URL=https://your-n8n-instance.com
```

### CORS Configuration (if needed)

If you encounter CORS issues, add these environment variables to your n8n setup:
```env
N8N_CORS_ORIGIN=http://localhost:3000,http://localhost:8080
```

## Features

### New n8n-based Workflow System

1. **Visual Workflow Editor**: Full n8n interface embedded in your application
2. **Workflow Management**: List, create, edit, and delete workflows
3. **Execution Control**: Run workflows manually or set up triggers
4. **Export/Import**: Export workflows as JSON and import them
5. **Templates**: Use n8n's extensive template library

### Available Routes

- `/workflow` - Workflow list and management
- `/workflow/new` - Create new workflow
- `/workflow/edit/:id` - Edit existing workflow
- `/workflow/list` - List all workflows

## Usage

### Creating Workflows

1. Navigate to `/workflow/new`
2. Use the n8n visual editor to build your workflow
3. Add nodes, configure connections, and set up triggers
4. Save and activate your workflow

### Managing Workflows

1. Go to `/workflow` or `/workflow/list`
2. View all your workflows with status indicators
3. Use the action menu to:
   - Edit workflows
   - Execute manually
   - Activate/deactivate
   - Export/duplicate
   - Delete

### Integration with Your App

The n8n workflows can integrate with your existing systems through:
- HTTP requests to your APIs
- Webhooks for real-time triggers
- Database connections
- Third-party service integrations

## Migration from Custom System

### Data Migration

If you have existing workflow data, you'll need to:

1. **Export existing workflow configurations** (if any)
2. **Recreate workflows in n8n** using the visual editor
3. **Set up equivalent triggers and actions**
4. **Test thoroughly** before removing old system

### Node Equivalents

Your custom nodes can be replaced with n8n equivalents:
- **Customer Node** → HTTP Request + Customer API calls
- **Job Node** → HTTP Request + Job management API
- **Task Node** → HTTP Request + Task API
- **Quote Node** → HTTP Request + Quote generation API
- **Messaging Node** → Email/SMS/Slack nodes
- **Automation Node** → Built-in n8n automation features

## Troubleshooting

### Common Issues

1. **n8n not accessible**
   - Ensure n8n is running on port 5678
   - Check firewall settings
   - Verify VITE_N8N_URL is correct

2. **CORS errors**
   - Add your app URL to N8N_CORS_ORIGIN
   - Check browser console for specific errors

3. **Authentication issues**
   - Configure n8n authentication if needed
   - Update iframe sandbox settings if required

### Support

- n8n Documentation: https://docs.n8n.io/
- n8n Community: https://community.n8n.io/
- GitHub Issues: https://github.com/n8n-io/n8n/issues

## Benefits of n8n Integration

1. **Professional Workflow Engine**: Enterprise-grade automation platform
2. **Extensive Node Library**: 400+ integrations out of the box
3. **Active Development**: Regular updates and new features
4. **Community Support**: Large community and extensive documentation
5. **Scalability**: Can handle complex, large-scale workflows
6. **Maintenance**: No need to maintain custom workflow engine

## Next Steps

1. Install and start n8n
2. Access your app and navigate to `/workflow`
3. Create your first workflow using the n8n editor
4. Test the integration thoroughly
5. Migrate any existing workflow logic to n8n
6. Remove old custom workflow files (optional cleanup)

Remember to update your production environment with the appropriate n8n instance URL and ensure proper security configurations. 
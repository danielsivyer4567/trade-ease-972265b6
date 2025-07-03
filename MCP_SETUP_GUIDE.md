# MCP (Model Context Protocol) Setup Guide for Cursor IDE

## What is MCP?

Model Context Protocol (MCP) is an open standard that enables AI applications like Cursor to connect with external data sources, tools, and services. Think of it as a "USB-C for AI" - a universal way to connect AI to various systems.

## Prerequisites

1. **Cursor IDE** - Make sure you have the latest version installed
2. **Node.js** - Required for running MCP servers
3. **npm/npx** - For installing MCP server packages

## Step 1: Install MCP Server Packages

First, install the MCP servers you want to use globally:

```bash
# Core MCP servers
npm install -g @modelcontextprotocol/server-filesystem
npm install -g @modelcontextprotocol/server-git
npm install -g @modelcontextprotocol/server-brave-search
npm install -g @modelcontextprotocol/server-github
npm install -g @modelcontextprotocol/server-postgres
npm install -g @modelcontextprotocol/server-slack

# Community MCP servers (examples)
npm install -g mcp-server-linear
npm install -g mcp-server-notion
```

## Step 2: Configure Cursor IDE

### Method 1: Using Cursor Settings UI

1. Open Cursor IDE
2. Go to **Settings** (Ctrl/Cmd + ,)
3. Navigate to **Features** → **Model Context Protocol**
4. Click **"Add MCP Server"**
5. Fill in the server details

### Method 2: Using Configuration File

1. Create or edit the MCP configuration file:
   - **Windows**: `%APPDATA%\Cursor\User\mcp.json`
   - **macOS**: `~/Library/Application Support/Cursor/User/mcp.json`
   - **Linux**: `~/.config/Cursor/User/mcp.json`

2. Use the provided `mcp.json` template in this repository

## Step 3: Popular MCP Server Configurations

### Filesystem Server
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\YourUsername\\Documents\\Projects"
      ]
    }
  }
}
```

### Git Server
```json
{
  "mcpServers": {
    "git": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-git",
        "--repository",
        "."
      ]
    }
  }
}
```

### GitHub Server
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-github"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-github-token-here"
      }
    }
  }
}
```

### Database Server (PostgreSQL)
```json
{
  "mcpServers": {
    "postgres": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-postgres",
        "postgresql://username:password@localhost:5432/database"
      ]
    }
  }
}
```

## Step 4: Setting Up "21st Dev" MCP Server

If you're specifically looking for a "21st dev" MCP server, here are some options:

### Option 1: Custom Development Server
```json
{
  "mcpServers": {
    "dev-tools": {
      "command": "node",
      "args": [
        "/path/to/your/custom-mcp-server.js"
      ],
      "env": {
        "API_KEY": "your-api-key"
      }
    }
  }
}
```

### Option 2: Web Development Tools
```json
{
  "mcpServers": {
    "web-dev": {
      "command": "npx",
      "args": [
        "mcp-server-web-tools"
      ]
    }
  }
}
```

## Step 5: Environment Variables

Create a `.env` file in your project root for sensitive configuration:

```env
# API Keys
GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token
BRAVE_API_KEY=your_brave_api_key
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# Database connections
DATABASE_URL=postgresql://user:pass@localhost:5432/db
MONGODB_URI=mongodb://localhost:27017/mydb

# Other services
SLACK_BOT_TOKEN=your_slack_token
LINEAR_API_KEY=your_linear_key
NOTION_API_KEY=your_notion_key
```

## Step 6: Testing Your MCP Setup

1. **Restart Cursor IDE** after making configuration changes
2. **Open a new chat** in Cursor
3. **Test MCP functionality** by asking questions like:
   - "List files in my project directory"
   - "Show me recent git commits"
   - "Search for information about React hooks"

## Step 7: Advanced Configuration

### Multiple Servers Example
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "."]
    },
    "git": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-git", "--repository", "."]
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your-token"
      }
    },
    "database": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-postgres"],
      "env": {
        "DATABASE_URL": "postgresql://localhost:5432/mydb"
      }
    }
  }
}
```

### Custom Server Development
If you want to create your own MCP server:

```javascript
// custom-mcp-server.js
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server({
  name: "my-custom-server",
  version: "1.0.0"
}, {
  capabilities: {
    tools: {},
    resources: {}
  }
});

// Add your tools and resources here
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: "my-tool",
      description: "Does something useful",
      inputSchema: {
        type: "object",
        properties: {
          input: { type: "string" }
        }
      }
    }]
  };
});

// Start the server
const transport = new StdioServerTransport();
await server.connect(transport);
```

## Troubleshooting

### Common Issues

1. **Server not starting**
   - Check if Node.js and npm are installed
   - Verify the server package is installed globally
   - Check file paths in configuration

2. **Permission errors**
   - Ensure Cursor has permission to execute the MCP servers
   - Check file system permissions for specified directories

3. **Environment variables not loading**
   - Verify `.env` file location
   - Check environment variable names match configuration

4. **MCP servers not appearing in Cursor**
   - Restart Cursor after configuration changes
   - Check the MCP configuration file syntax
   - Look for errors in Cursor's developer console

### Debug Commands

```bash
# Test if MCP server packages are installed
npx @modelcontextprotocol/server-filesystem --help

# Check Node.js version
node --version

# Verify npm global packages
npm list -g --depth=0
```

## Popular MCP Servers

| Server | Purpose | Installation |
|--------|---------|-------------|
| `@modelcontextprotocol/server-filesystem` | File operations | `npm i -g @modelcontextprotocol/server-filesystem` |
| `@modelcontextprotocol/server-git` | Git operations | `npm i -g @modelcontextprotocol/server-git` |
| `@modelcontextprotocol/server-github` | GitHub API | `npm i -g @modelcontextprotocol/server-github` |
| `@modelcontextprotocol/server-brave-search` | Web search | `npm i -g @modelcontextprotocol/server-brave-search` |
| `@modelcontextprotocol/server-postgres` | PostgreSQL | `npm i -g @modelcontextprotocol/server-postgres` |
| `@modelcontextprotocol/server-slack` | Slack integration | `npm i -g @modelcontextprotocol/server-slack` |

## Next Steps

1. **Start with basic servers** (filesystem, git) to get familiar
2. **Add more specialized servers** based on your workflow
3. **Create custom servers** for specific needs
4. **Explore community servers** on GitHub and npm

## Resources

- [Official MCP Documentation](https://modelcontextprotocol.io/)
- [MCP GitHub Repository](https://github.com/modelcontextprotocol)
- [Cursor MCP Documentation](https://docs.cursor.com/context/model-context-protocol)
- [Community MCP Servers](https://github.com/modelcontextprotocol/servers)

## Support

If you need help with specific MCP server configurations or have questions about setting up custom servers, please refer to the official documentation or community forums. 
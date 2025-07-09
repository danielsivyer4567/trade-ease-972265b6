# Connect Trade Ease MCP Server to Claude Desktop

## Overview
This guide shows you how to connect your existing Trade Ease MCP server to Claude Desktop instead of Cursor IDE.

## Prerequisites
- Claude Desktop installed on your system
- Node.js and npm installed (already done ✅)
- Trade Ease MCP server built and ready (in your `trade-ease-mcp` directory)

## Step 1: Locate Claude Desktop Configuration

Claude Desktop uses a different configuration file location than Cursor:

### Windows
```
%APPDATA%\Claude\claude_desktop_config.json
```

### macOS
```
~/Library/Application Support/Claude/claude_desktop_config.json
```

### Linux
```
~/.config/Claude/claude_desktop_config.json
```

## Step 2: Create/Edit Configuration File

Create or edit the `claude_desktop_config.json` file with your Trade Ease MCP server configuration:

```json
{
  "mcpServers": {
    "trade-ease-mcp": {
      "command": "node",
      "args": [
        "C:/Users/danie/Downloads/dansversion/trade-ease-972265b6/trade-ease-mcp/build/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/danie/Downloads/dansversion/trade-ease-972265b6"
      ]
    }
  }
}
```

## Step 3: WSL Path Adjustments (Important!)

Since you're using WSL, you may need to adjust the paths. Use the Windows path format in the configuration:

```json
{
  "mcpServers": {
    "trade-ease-mcp": {
      "command": "node",
      "args": [
        "C:\\Users\\danie\\Downloads\\dansversion\\trade-ease-972265b6\\trade-ease-mcp\\build\\index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "filesystem": {
      "command": "npx",
      "args": [
        "@modelcontextprotocol/server-filesystem",
        "C:\\Users\\danie\\Downloads\\dansversion\\trade-ease-972265b6"
      ]
    }
  }
}
```

## Step 4: Alternative WSL Configuration

If you want to run the MCP server from within WSL, use this configuration:

```json
{
  "mcpServers": {
    "trade-ease-mcp": {
      "command": "wsl",
      "args": [
        "-d", "Ubuntu",
        "node",
        "/mnt/c/Users/danie/Downloads/dansversion/trade-ease-972265b6/trade-ease-mcp/build/index.js"
      ],
      "env": {
        "NODE_ENV": "production"
      }
    },
    "filesystem": {
      "command": "wsl",
      "args": [
        "-d", "Ubuntu",
        "npx",
        "@modelcontextprotocol/server-filesystem",
        "/mnt/c/Users/danie/Downloads/dansversion/trade-ease-972265b6"
      ]
    }
  }
}
```

## Step 5: Build and Test MCP Server

Before connecting to Claude Desktop, ensure your MCP server is built:

```bash
cd trade-ease-mcp
npm install
npm run build
```

Test the server directly:
```bash
node build/index.js
```

## Step 6: Restart Claude Desktop

After configuring:
1. **Close Claude Desktop completely**
2. **Restart the application**
3. **Open a new conversation**

## Step 7: Test the Connection

In Claude Desktop, try these commands to test your MCP integration:

```
"List all available notes"
"Create a new note with title 'Test' and content 'This is a test note from Claude Desktop'"
"Show me the files in my Trade Ease project"
"What MCP tools do you have available?"
```

## Current MCP Server Features

Your Trade Ease MCP server provides:

### 📚 **Resources** (Data Access)
- **List Notes**: View all available notes
- **Read Notes**: Access individual note content

### 🛠 **Tools** (Actions)
- **create_note**: Create new notes with title and content
- **File operations**: Read and list project files

### 🤖 **Prompts** (AI Templates)
- **summarize_notes**: Generate summaries of all notes

## Troubleshooting

### MCP Server Not Detected
1. **Check file paths**: Ensure paths use correct Windows/WSL format
2. **Verify Node.js**: Ensure Node.js is accessible from Windows
3. **Check permissions**: Ensure Claude Desktop can execute Node.js
4. **Restart completely**: Close and reopen Claude Desktop

### WSL-Specific Issues
- **Path Format**: Use `/mnt/c/Users/...` for WSL paths
- **Node.js Access**: Ensure Node.js is installed in WSL
- **File Permissions**: Check that files are executable

### Testing Connection
```bash
# Test if the MCP server runs
cd trade-ease-mcp
node build/index.js

# Test with MCP inspector
npm run inspector
```

## Advanced Configuration

### Add Environment Variables
```json
{
  "mcpServers": {
    "trade-ease-mcp": {
      "command": "node",
      "args": ["C:\\...\\build\\index.js"],
      "env": {
        "NODE_ENV": "production",
        "SUPABASE_URL": "your_supabase_url",
        "SUPABASE_ANON_KEY": "your_supabase_key"
      }
    }
  }
}
```

### Multiple Servers
You can connect multiple MCP servers to Claude Desktop:

```json
{
  "mcpServers": {
    "trade-ease-mcp": {
      "command": "node",
      "args": ["C:\\...\\trade-ease-mcp\\build\\index.js"]
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "C:\\...\\trade-ease-972265b6"]
    },
    "github": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "your_token"
      }
    }
  }
}
```

## Quick Setup Commands

### For Windows (from Command Prompt)
```cmd
mkdir "%APPDATA%\Claude"
echo { > "%APPDATA%\Claude\claude_desktop_config.json"
echo   "mcpServers": { >> "%APPDATA%\Claude\claude_desktop_config.json"
echo     "trade-ease-mcp": { >> "%APPDATA%\Claude\claude_desktop_config.json"
echo       "command": "node", >> "%APPDATA%\Claude\claude_desktop_config.json"
echo       "args": ["C:\\Users\\danie\\Downloads\\dansversion\\trade-ease-972265b6\\trade-ease-mcp\\build\\index.js"] >> "%APPDATA%\Claude\claude_desktop_config.json"
echo     } >> "%APPDATA%\Claude\claude_desktop_config.json"
echo   } >> "%APPDATA%\Claude\claude_desktop_config.json"
echo } >> "%APPDATA%\Claude\claude_desktop_config.json"
```

### For PowerShell
```powershell
$configPath = "$env:APPDATA\Claude\claude_desktop_config.json"
$config = @{
  mcpServers = @{
    "trade-ease-mcp" = @{
      command = "node"
      args = @("C:\Users\danie\Downloads\dansversion\trade-ease-972265b6\trade-ease-mcp\build\index.js")
    }
  }
}
$config | ConvertTo-Json -Depth 3 | Out-File -FilePath $configPath -Encoding UTF8
```

## Next Steps

1. **Test the basic connection** with note-taking functionality
2. **Customize the MCP server** to access your Trade Ease project data
3. **Add Supabase integration** for real project data access
4. **Explore additional MCP servers** for enhanced functionality

Your Trade Ease MCP server is now ready to connect to Claude Desktop! 🎉

## Support

If you encounter issues:
1. Check the MCP server logs
2. Verify file paths and permissions
3. Ensure Claude Desktop is updated
4. Test the MCP server independently first 
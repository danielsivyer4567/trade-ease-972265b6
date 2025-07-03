# Cursor MCP Setup Guide for Trade-Ease Project

## ✅ What We've Accomplished

1. **Created a custom MCP server** specifically for your trade-ease project
2. **Built and configured** the server with note-taking capabilities (template)
3. **Generated configuration files** for easy Cursor integration

## 🚀 Quick Setup for Cursor IDE

### Step 1: Configure Cursor IDE Settings

There are two ways to add MCP to Cursor:

#### Method A: Using Cursor Settings UI (Recommended)
1. Open **Cursor IDE**
2. Press `Ctrl + ,` (or `Cmd + ,` on Mac) to open Settings
3. Navigate to **Features** → **Model Context Protocol**
4. Click **"Add MCP Server"**
5. Fill in the details:
   - **Name**: `trade-ease-mcp`
   - **Command**: `node`
   - **Args**: `C:/Users/danie/Downloads/dansversion/trade-ease-972265b6/trade-ease-mcp/build/index.js`

#### Method B: Configuration File
1. Locate your Cursor MCP config file:
   - **Windows**: `%APPDATA%\Cursor\User\mcp.json`
   - **macOS**: `~/Library/Application Support/Cursor/User/mcp.json`
   - **Linux**: `~/.config/Cursor/User/mcp.json`

2. Copy the contents from the `mcp.json` file in this repository

### Step 2: Restart Cursor
After configuration, **completely restart Cursor IDE** for changes to take effect.

### Step 3: Test the MCP Integration

1. Open a new chat in Cursor
2. Try these test commands:
   ```
   "List all available notes"
   "Create a new note with title 'Test' and content 'This is a test note'"
   "Show me the content of the first note"
   "Summarize all my notes"
   ```

## 🛠 Current MCP Server Capabilities

Your trade-ease MCP server currently provides:

### **Resources** (Data Access)
- **List Notes**: View all available notes as resources
- **Read Notes**: Access individual note content via `note:///` URIs

### **Tools** (Actions)
- **create_note**: Create new notes with title and content
  - Input: `title` (string), `content` (string)
  - Output: Confirmation message with note ID

### **Prompts** (AI Templates)
- **summarize_notes**: Generate summaries of all notes
  - Embeds all note contents for AI analysis

## 🔧 Customizing for Your Trade-Ease Project

The current server is a template. Here are ways to enhance it for your specific needs:

### Option 1: Database Integration
Add Supabase/PostgreSQL integration to access your actual project data:

```typescript
// Add to your MCP server
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

// Add tools for database operations
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "get_jobs":
      const { data } = await supabase.from('jobs').select('*')
      return { content: [{ type: "text", text: JSON.stringify(data) }] }
    
    case "get_customers":
      const { data: customers } = await supabase.from('customers').select('*')
      return { content: [{ type: "text", text: JSON.stringify(customers) }] }
  }
})
```

### Option 2: Add File System Access
Access your project files and documentation:

```typescript
// Add file system tools
case "read_project_file":
  const filePath = String(request.params.arguments?.path)
  const content = await fs.readFile(filePath, 'utf-8')
  return { content: [{ type: "text", text: content }] }

case "list_components":
  const components = await fs.readdir('./src/components', { recursive: true })
  return { content: [{ type: "text", text: JSON.stringify(components) }] }
```

### Option 3: API Integration
Connect to external APIs your project uses:

```typescript
// Add API integration tools
case "weather_data":
  const response = await fetch(`https://api.weather.com/...`)
  const data = await response.json()
  return { content: [{ type: "text", text: JSON.stringify(data) }] }
```

## 🐛 Troubleshooting

### MCP Server Not Appearing in Cursor
1. **Check file paths**: Ensure the path to `build/index.js` is correct
2. **Restart Cursor**: Completely close and reopen Cursor
3. **Check permissions**: Ensure Cursor can execute Node.js
4. **Verify build**: Run `npm run build` in the MCP server directory

### Testing the Server Directly
```bash
# Navigate to MCP server directory
cd trade-ease-mcp

# Test the server directly
node build/index.js

# Or use the inspector
npm run inspector
```

### Common Issues
- **Permission Errors**: Run Cursor as administrator (Windows) or check file permissions
- **Path Issues**: Use forward slashes `/` instead of backslashes `\` in paths
- **Node.js Issues**: Ensure Node.js is in your system PATH

## 📁 Project Structure

```
trade-ease-972265b6/
├── trade-ease-mcp/          # Your MCP server
│   ├── src/index.ts         # Server source code
│   ├── build/index.js       # Compiled server
│   └── package.json         # Server configuration
├── mcp.json                 # Cursor MCP configuration
├── MCP_SETUP_GUIDE.md       # General MCP guide
└── CURSOR_MCP_SETUP.md      # This file
```

## 🎯 Next Steps

1. **Test the basic setup** with the note-taking functionality
2. **Customize the server** to access your trade-ease project data
3. **Add more tools** specific to your workflow needs
4. **Explore community MCP servers** for additional functionality

## 🔗 Useful Links

- [MCP Inspector](http://localhost:6274) (when running `npm run inspector`)
- [Official MCP Documentation](https://modelcontextprotocol.io/)
- [MCP SDK TypeScript](https://github.com/modelcontextprotocol/typescript-sdk)

## 💡 Pro Tips

1. **Start Simple**: Test with the default note functionality first
2. **Use Inspector**: The MCP inspector is great for debugging
3. **Environment Variables**: Use `.env` files for sensitive configuration
4. **Version Control**: Don't commit API keys or sensitive data

Your MCP server is now ready to use with Cursor! 🎉 
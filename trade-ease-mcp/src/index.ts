#!/usr/bin/env node

/**
 * This is a template MCP server that implements a simple notes system.
 * It demonstrates core MCP concepts like resources and tools by allowing:
 * - Listing notes as resources
 * - Reading individual notes
 * - Creating new notes via a tool
 * - Summarizing all notes via a prompt
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

/**
 * Type alias for a trade-ease note object.
 */
type Note = { 
  title: string, 
  content: string,
  project_id?: string,
  customer_id?: string, 
  job_type?: string,
  priority?: 'low' | 'normal' | 'high' | 'urgent',
  status?: 'todo' | 'in-progress' | 'completed',
  tags?: string[],
  created_at: string,
  due_date?: string
};

/**
 * Simple in-memory storage for notes.
 * In a real implementation, this would likely be backed by a database.
 */
const notes: { [id: string]: Note } = {
  "1": { 
    title: "First Note", 
    content: "This is note 1",
    created_at: "2024-01-01T00:00:00Z",
    status: "completed"
  },
  "2": { 
    title: "Second Note", 
    content: "This is note 2",
    created_at: "2024-01-01T00:00:00Z",
    status: "todo"
  }
};

/**
 * Create an MCP server with capabilities for resources (to list/read notes),
 * tools (to create new notes), and prompts (to summarize notes).
 */
const server = new Server(
  {
    name: "Trade-ease-mcp",
    version: "0.1.0",
  },
  {
    capabilities: {
      resources: {},
      tools: {},
      prompts: {},
    },
  }
);

/**
 * Handler for listing available notes as resources.
 * Each note is exposed as a resource with:
 * - A note:// URI scheme
 * - Plain text MIME type
 * - Human readable name and description (now including the note title)
 */
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: Object.entries(notes).map(([id, note]) => ({
      uri: `note:///${id}`,
      mimeType: "text/plain",
      name: note.title,
      description: `A text note: ${note.title}`
    }))
  };
});

/**
 * Handler for reading the contents of a specific note.
 * Takes a note:// URI and returns the note content as plain text.
 */
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const url = new URL(request.params.uri);
  const id = url.pathname.replace(/^\//, '');
  const note = notes[id];

  if (!note) {
    throw new Error(`Note ${id} not found`);
  }

  return {
    contents: [{
      uri: request.params.uri,
      mimeType: "text/plain",
      text: note.content
    }]
  };
});

/**
 * Handler that lists available tools.
 * Exposes tools for creating, listing, and getting notes.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "create_note",
        description: "Create a new trade-ease note with project details",
        inputSchema: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Title of the note"
            },
            content: {
              type: "string",
              description: "Text content of the note"
            },
            project_id: {
              type: "string",
              description: "ID of the associated project"
            },
            customer_id: {
              type: "string", 
              description: "ID of the associated customer"
            },
            job_type: {
              type: "string",
              description: "Type of job (e.g., plumbing, electrical, roofing)"
            },
            priority: {
              type: "string",
              enum: ["low", "normal", "high", "urgent"],
              description: "Priority level of the note"
            },
            status: {
              type: "string",
              enum: ["todo", "in-progress", "completed"],
              description: "Status of the note"
            },
            tags: {
              type: "array",
              items: { type: "string" },
              description: "Tags for categorizing the note"
            },
            due_date: {
              type: "string",
              description: "Due date in ISO format (YYYY-MM-DD)"
            }
          },
          required: ["title", "content"]
        }
      },
      {
        name: "list_notes",
        description: "List all available notes with their IDs and titles",
        inputSchema: {
          type: "object",
          properties: {},
          required: []
        }
      },
      {
        name: "get_notes",
        description: "Get the content of a specific note by ID",
        inputSchema: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The ID of the note to retrieve"
            }
          },
          required: ["id"]
        }
      }
    ]
  };
});

/**
 * Handler for tool calls including create_note, list_notes, and get_notes.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "create_note": {
      const title = String(request.params.arguments?.title);
      const content = String(request.params.arguments?.content);
      if (!title || !content) {
        throw new Error("Title and content are required");
      }

      const id = String(Object.keys(notes).length + 1);
      const newNote: Note = {
        title,
        content,
        created_at: new Date().toISOString(),
        project_id: request.params.arguments?.project_id ? String(request.params.arguments.project_id) : undefined,
        customer_id: request.params.arguments?.customer_id ? String(request.params.arguments.customer_id) : undefined,
        job_type: request.params.arguments?.job_type ? String(request.params.arguments.job_type) : undefined,
        priority: request.params.arguments?.priority as 'low' | 'normal' | 'high' | 'urgent' || 'normal',
        status: request.params.arguments?.status as 'todo' | 'in-progress' | 'completed' || 'todo',
        tags: request.params.arguments?.tags as string[] || [],
        due_date: request.params.arguments?.due_date ? String(request.params.arguments.due_date) : undefined
      };
      
      notes[id] = newNote;

      return {
        content: [{
          type: "text",
          text: `Created note ${id}: ${title}${newNote.project_id ? ` (Project: ${newNote.project_id})` : ''}${newNote.priority !== 'normal' ? ` [${newNote.priority?.toUpperCase()}]` : ''}`
        }]
      };
    }

    case "list_notes": {
      const notesList = Object.entries(notes).map(([id, note]) => {
        let summary = `ID: ${id} - ${note.title}`;
        if (note.status) summary += ` [${note.status.toUpperCase()}]`;
        if (note.priority && note.priority !== 'normal') summary += ` ⚠️${note.priority.toUpperCase()}`;
        if (note.project_id) summary += ` (Project: ${note.project_id})`;
        if (note.job_type) summary += ` - ${note.job_type}`;
        return summary;
      }).join('\n');
      
      return {
        content: [{
          type: "text",
          text: notesList.length > 0 ? `Available notes:\n${notesList}` : "No notes available"
        }]
      };
    }

    case "get_notes": {
      const id = String(request.params.arguments?.id);
      if (!id) {
        throw new Error("Note ID is required");
      }

      const note = notes[id];
      if (!note) {
        throw new Error(`Note ${id} not found`);
      }

      let noteDetails = `Title: ${note.title}\nContent: ${note.content}\nCreated: ${note.created_at}\nStatus: ${note.status || 'N/A'}`;
      
      if (note.project_id) noteDetails += `\nProject ID: ${note.project_id}`;
      if (note.customer_id) noteDetails += `\nCustomer ID: ${note.customer_id}`;
      if (note.job_type) noteDetails += `\nJob Type: ${note.job_type}`;
      if (note.priority) noteDetails += `\nPriority: ${note.priority.toUpperCase()}`;
      if (note.due_date) noteDetails += `\nDue Date: ${note.due_date}`;
      if (note.tags && note.tags.length > 0) noteDetails += `\nTags: ${note.tags.join(', ')}`;

      return {
        content: [{
          type: "text",
          text: noteDetails
        }]
      };
    }

    default:
      throw new Error("Unknown tool");
  }
});

/**
 * Handler that lists available prompts.
 * Exposes a single "summarize_notes" prompt that summarizes all notes.
 */
server.setRequestHandler(ListPromptsRequestSchema, async () => {
  return {
    prompts: [
      {
        name: "summarize_notes",
        description: "Summarize all notes",
      }
    ]
  };
});

/**
 * Handler for the summarize_notes prompt.
 * Returns a prompt that requests summarization of all notes, with the notes' contents embedded as resources.
 */
server.setRequestHandler(GetPromptRequestSchema, async (request) => {
  if (request.params.name !== "summarize_notes") {
    throw new Error("Unknown prompt");
  }

  const embeddedNotes = Object.entries(notes).map(([id, note]) => ({
    type: "resource" as const,
    resource: {
      uri: `note:///${id}`,
      mimeType: "text/plain",
      text: note.content
    }
  }));

  return {
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: "Please summarize the following notes:"
        }
      },
      ...embeddedNotes.map(note => ({
        role: "user" as const,
        content: note
      })),
      {
        role: "user",
        content: {
          type: "text",
          text: "Provide a concise summary of all the notes above."
        }
      }
    ]
  };
});

/**
 * Start the server using stdio transport.
 * This allows the server to communicate via standard input/output streams.
 */
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});

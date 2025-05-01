import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { 
  WorkflowValidator, 
  workflowPermissionSchema, 
  workflowContentSchema, 
  sessionValidationSchema 
} from "../workflow/validation";

export const workflowRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      permissions: workflowPermissionSchema,
      content: workflowContentSchema,
      session: sessionValidationSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate user session and permissions
      if (ctx.session?.user?.id !== input.permissions.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID mismatch",
        });
      }

      // Validate the operation
      await WorkflowValidator.validateWorkflowOperation(
        input.permissions,
        input.content,
        input.session
      );

      // Store the workflow in the database
      const workflow = await ctx.prisma.workflow.create({
        data: {
          userId: input.permissions.userId,
          content: input.content.content,
          nodeType: input.content.nodeType,
          metadata: input.content.metadata,
          createdAt: new Date(input.permissions.timestamp),
        },
      });

      return workflow;
    }),

  edit: protectedProcedure
    .input(z.object({
      workflowId: z.string().uuid(),
      permissions: workflowPermissionSchema,
      content: workflowContentSchema,
      session: sessionValidationSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate user session and permissions
      if (ctx.session?.user?.id !== input.permissions.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID mismatch",
        });
      }

      // Check workflow ownership
      const existingWorkflow = await ctx.prisma.workflow.findUnique({
        where: { id: input.workflowId },
      });

      if (!existingWorkflow || existingWorkflow.userId !== input.permissions.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Workflow not found or access denied",
        });
      }

      // Validate the operation
      await WorkflowValidator.validateWorkflowOperation(
        input.permissions,
        input.content,
        input.session
      );

      // Update the workflow
      const workflow = await ctx.prisma.workflow.update({
        where: { id: input.workflowId },
        data: {
          content: input.content.content,
          nodeType: input.content.nodeType,
          metadata: input.content.metadata,
          updatedAt: new Date(input.permissions.timestamp),
        },
      });

      return workflow;
    }),

  delete: protectedProcedure
    .input(z.object({
      workflowId: z.string().uuid(),
      permissions: workflowPermissionSchema,
      session: sessionValidationSchema,
    }))
    .mutation(async ({ ctx, input }) => {
      // Validate user session and permissions
      if (ctx.session?.user?.id !== input.permissions.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID mismatch",
        });
      }

      // Check workflow ownership
      const existingWorkflow = await ctx.prisma.workflow.findUnique({
        where: { id: input.workflowId },
      });

      if (!existingWorkflow || existingWorkflow.userId !== input.permissions.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Workflow not found or access denied",
        });
      }

      // Delete the workflow
      await ctx.prisma.workflow.delete({
        where: { id: input.workflowId },
      });

      return { success: true };
    }),

  getUserWorkflows: protectedProcedure
    .input(z.object({
      permissions: workflowPermissionSchema,
      session: sessionValidationSchema,
      pagination: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive().max(50),
      }),
    }))
    .query(async ({ ctx, input }) => {
      // Validate user session and permissions
      if (ctx.session?.user?.id !== input.permissions.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID mismatch",
        });
      }

      const skip = (input.pagination.page - 1) * input.pagination.limit;

      // Get user's workflows with pagination
      const workflows = await ctx.prisma.workflow.findMany({
        where: { userId: input.permissions.userId },
        skip,
        take: input.pagination.limit,
        orderBy: { createdAt: 'desc' },
      });

      const total = await ctx.prisma.workflow.count({
        where: { userId: input.permissions.userId },
      });

      return {
        workflows,
        pagination: {
          page: input.pagination.page,
          limit: input.pagination.limit,
          total,
          pages: Math.ceil(total / input.pagination.limit),
        },
      };
    }),

  search: protectedProcedure
    .input(z.object({
      permissions: workflowPermissionSchema,
      session: sessionValidationSchema,
      query: z.string().min(1).max(100),
      pagination: z.object({
        page: z.number().int().positive(),
        limit: z.number().int().positive().max(50),
      }),
    }))
    .query(async ({ ctx, input }) => {
      // Validate user session and permissions
      if (ctx.session?.user?.id !== input.permissions.userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "User ID mismatch",
        });
      }

      const skip = (input.pagination.page - 1) * input.pagination.limit;

      // Search user's workflows
      const workflows = await ctx.prisma.workflow.findMany({
        where: {
          userId: input.permissions.userId,
          OR: [
            { content: { contains: input.query, mode: 'insensitive' } },
            { nodeType: { contains: input.query, mode: 'insensitive' } },
          ],
        },
        skip,
        take: input.pagination.limit,
        orderBy: { createdAt: 'desc' },
      });

      const total = await ctx.prisma.workflow.count({
        where: {
          userId: input.permissions.userId,
          OR: [
            { content: { contains: input.query, mode: 'insensitive' } },
            { nodeType: { contains: input.query, mode: 'insensitive' } },
          ],
        },
      });

      return {
        workflows,
        pagination: {
          page: input.pagination.page,
          limit: input.pagination.limit,
          total,
          pages: Math.ceil(total / input.pagination.limit),
        },
      };
    }),
}); 
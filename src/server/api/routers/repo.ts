import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

const normalizeRepositoryUrl = (url: string) => {
  const cleaned = url.trim();
  const parsed = new URL(cleaned);

  parsed.hash = "";
  parsed.search = "";

  return parsed.toString().replace(/\/+$/, "");
};

export const repoRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.repository.findMany({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });
  }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.db.repository.deleteMany({
        where: { id: input.id, createdById: ctx.session.user.id },
      });

      if (result.count === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Repository not found." });
      }

      return { success: true };
    }),

  add: protectedProcedure
    .input(
      z.object({
        url: z.string().url(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const normalizedUrl = normalizeRepositoryUrl(input.url);

      try {
        const repository = await ctx.db.repository.create({
          data: {
            url: normalizedUrl,
            createdBy: { connect: { id: ctx.session.user.id } },
          },
        });

        return repository;
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Repository already added.",
          });
        }

        throw error;
      }
    }),
});

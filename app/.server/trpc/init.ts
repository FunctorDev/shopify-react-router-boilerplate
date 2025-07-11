import { db } from "@/.server/db";
import { shopify } from "@/.server/shopify";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { z, ZodError } from "zod";

export const createTRPCContext = (opts: { headers: Headers }) => {
  const source = opts.headers.get("x-trpc-source") ?? "unknown";

  return {
    db,
  };
};

type Context = Awaited<ReturnType<typeof createTRPCContext>> &
  Partial<{
    request: Request;
    shopify: typeof shopify;
  }>;

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter: ({ shape, error }) => ({
    ...shape,
    data: {
      ...shape.data,
      zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
    },
  }),
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

export const shopifyAuthenticatedProcedure = t.procedure.use(
  ({ ctx, next }) => {
    if (!ctx.request) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Shopify procedure requires `request` object",
      });
    }

    return next({
      ctx: {
        ...ctx,
        request: ctx.request,
        shopify,
      },
    });
  },
);

export const shopifyUnauthenticatedProcedure = t.procedure
  .input(
    z.object({
      shop: z.string(),
    }),
  )
  .use(({ ctx, next }) => {
    return next({
      ctx: {
        ...ctx,
        shopify,
      },
    });
  });

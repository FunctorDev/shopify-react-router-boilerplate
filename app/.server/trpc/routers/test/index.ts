import { shopifyAuthenticatedProcedure, publicProcedure } from "../../init";
import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

export const testRouter = {
  hello: publicProcedure
    .input(
      z.object({
        text: z.string(),
      }),
    )
    .query(({ input }) => {
      return "hello world: " + input.text;
    }),

  user: shopifyAuthenticatedProcedure.query(async ({ input, ctx }) => {
    const { admin } = await ctx.shopify.authenticate.admin(ctx.request);

    return await Promise.all([
      ctx.db.session.findFirst(),

      admin
        .graphql(
          `#graphql
        query layout {
          shop {
            name
            description
          }
        }
        `,
        )
        .then((res) => res.json()),
    ]);
  }),
} satisfies TRPCRouterRecord;

import {
  index,
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  route("/api/trpc/*", "routes/api/trpc.ts"),

  index("routes/index.tsx"),

  ...prefix("auth", [route("login", "routes/auth/login.tsx")]),

  ...prefix("app", [
    layout("routes/app/layout.tsx", [
      index("routes/app/index.tsx"),

      route("/debug", "routes/app/debug/index.tsx"),
      route("/test", "routes/app/test/index.tsx"),
    ]),
  ]),
] satisfies RouteConfig;

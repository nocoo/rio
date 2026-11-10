import { Hono } from "hono";
import packageJson from "../package.json";
import { createLivePayload } from "../src/lib/live";

type Env = {
  ASSETS: Fetcher;
  DB: D1Database;
  VERSION: WorkerVersionMetadata;
  APP_ORIGIN: string;
  ACCESS_TEAM: string;
  ACCESS_AUD: string;
  APP_VERSION: string;
};

const app = new Hono<{ Bindings: Env }>();

app.get("/api/live", (c) => {
  const body = createLivePayload(packageJson.version);
  return c.json(body, 200, { "Cache-Control": "no-store" });
});

app.all("*", async (c) => {
  const asset = await c.env.ASSETS.fetch(c.req.raw);
  return asset;
});

export default {
  fetch(request: Request, env: Env, ctx: ExecutionContext) {
    return app.fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;

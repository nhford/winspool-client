import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import vercel from "vite-plugin-vercel";
import tailwindcss from "@tailwindcss/vite";
import type { IncomingMessage } from "node:http";

type VercelRes = {
  status: (code: number) => VercelRes;
  setHeader: (key: string, value: string) => VercelRes;
  json: (body: unknown) => void;
};

function vercelApiDev(): Plugin {
  return {
    name: "vercel-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== "/api/pool-data") {
          next();
          return;
        }

        try {
          const mod = await server.ssrLoadModule("/api/pool-data.js");
          const handler = mod.default as (
            request: IncomingMessage,
            response: VercelRes,
          ) => Promise<void>;

          let statusCode = 200;
          const apiRes: VercelRes = {
            status(code: number) {
              statusCode = code;
              return this;
            },
            setHeader(key: string, value: string) {
              res.setHeader(key, value);
              return this;
            },
            json(body: unknown) {
              res.statusCode = statusCode;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(body));
            },
          };

          await handler(req, apiRes);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              error:
                err instanceof Error ? err.message : "Internal Server Error",
            }),
          );
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [vercelApiDev(), react(), vercel(), tailwindcss()],
  vercel: {},
});

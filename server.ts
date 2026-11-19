import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

const root = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = Number(process.env.PORT || 3000);
const backendBaseUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8001";

app.use(express.json({ limit: "10mb" }));

app.use("/api", async (request, response) => {
  try {
    const upstreamUrl = new URL(request.originalUrl, backendBaseUrl);
    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const upstream = await fetch(upstreamUrl, {
      method: request.method,
      headers: request.headers["content-type"]
        ? { "content-type": request.headers["content-type"] }
        : undefined,
      body: hasBody ? JSON.stringify(request.body) : undefined,
    });

    response.status(upstream.status);
    const contentType = upstream.headers.get("content-type");
    if (contentType) response.setHeader("content-type", contentType);
    response.send(Buffer.from(await upstream.arrayBuffer()));
  } catch {
    response
      .status(503)
      .json({ detail: "The application backend is unavailable." });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      configFile: path.join(root, "vite.config.ts"),
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(root, "dist");
    app.use(express.static(distPath));
    app.get("*", (_request, response) => {
      response.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(port, "0.0.0.0", () => {
    console.log(`iKhedut app proxy running at http://localhost:${port}`);
  });
}

startServer();

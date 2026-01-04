// server.js
const http = require("http");
const express = require("express");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

const app = express();
const PORT = Number(process.env.PORT || 9000);

// Optional allowlist: comma-separated origins in Render env var CORS_ORIGINS
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors(
    CORS_ORIGINS.length
      ? { origin: CORS_ORIGINS, credentials: true }
      : { origin: true, credentials: true }
  )
);

app.get("/", (_req, res) => res.status(200).send("ok"));
app.get("/health", (_req, res) =>
  res.status(200).json({ ok: true, peerPath: "/peerjs" })
);

const server = http.createServer(app);

// ✅ Set the PeerJS base path HERE
const peerServer = ExpressPeerServer(server, {
  path: "/peerjs",
  proxied: true,
  debug: true
});

// ✅ Mount at root so we DON'T double-prefix
app.use(peerServer);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[peer] listening on ${PORT} path=/peerjs`);
});

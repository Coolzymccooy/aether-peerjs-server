// server.js
const http = require("http");
const express = require("express");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

const app = express();

// Render injects PORT
const PORT = Number(process.env.PORT || 9000);
const PEER_PATH = process.env.PEER_PATH || "/peerjs";

// Optional CORS allowlist (comma-separated)
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map(s => s.trim())
  .filter(Boolean);

app.use(
  cors(
    CORS_ORIGINS.length
      ? { origin: CORS_ORIGINS, credentials: true }
      : { origin: true, credentials: true }
  )
);

// Health routes (Express-only)
app.get("/", (_req, res) => res.send("ok"));
app.get("/health", (_req, res) =>
  res.json({ ok: true, peerPath: PEER_PATH })
);

// 🚨 IMPORTANT: single HTTP server
const server = http.createServer(app);

// ✅ THIS is the real PeerJS server
const peerServer = ExpressPeerServer(server, {
  path: "/",        // internal to PeerJS
  proxied: true,
  debug: true
});

// ✅ THIS line makes /peerjs/id work
app.use(PEER_PATH, peerServer);

// 🚀 Start ONE server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`[peer] listening on ${PORT}${PEER_PATH}`);
});

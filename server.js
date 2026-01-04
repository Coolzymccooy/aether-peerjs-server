// server.js
const http = require("http");
const express = require("express");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

const app = express();

const PORT = Number(process.env.PORT || 9000);
const PEER_PATH = process.env.PEER_PATH || "/peerjs";

// optional: set "CORS_ORIGINS" in Render env as comma-separated origins
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

app.get("/", (_req, res) => res.status(200).send("ok"));
app.get("/health", (_req, res) =>
  res.status(200).json({ ok: true, peerPath: PEER_PATH })
);

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  path: "/",
  proxied: true,
  debug: true
});

// THIS is what makes /peerjs/id work
app.use(PEER_PATH, peerServer);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[peer] listening on ${PORT} path=${PEER_PATH}`);
});

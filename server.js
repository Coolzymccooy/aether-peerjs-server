// server.js
const http = require("http");
const express = require("express");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

const app = express();
const PORT = Number(process.env.PORT || 9000);
const PEER_PATH = process.env.PEER_PATH || "/peerjs";

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
  res.status(200).json({ ok: true, peerPath: PEER_PATH })
);

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  path: "/",         // important
  proxied: true,
  debug: true,
});

// Mount BOTH to handle client variations (/peerjs/... AND /peerjs/peerjs/...)
app.use(PEER_PATH, peerServer);
app.use(`${PEER_PATH}/peerjs`, peerServer);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[peer] listening on ${PORT}${PEER_PATH}`);
});

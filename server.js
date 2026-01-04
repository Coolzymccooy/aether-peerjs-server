const express = require("express");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");

const app = express();

// Render sets PORT automatically
const PORT = process.env.PORT || 9000;

// If you want to lock CORS later, replace "*" with your Vercel domain(s)
app.use(cors({ origin: "*", methods: ["GET", "POST", "OPTIONS"] }));

// Basic health check so your root URL isn't "Not Found"
app.get("/", (_req, res) => {
  res.type("text").send("Aether PeerJS server is running. Peer endpoint: /peerjs");
});

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Create the PeerJS server mounted at /peerjs
const peerServer = ExpressPeerServer(app, {
  path: "/peerjs",
  // debug: true, // uncomment if needed
  allow_discovery: false
});

app.use("/peerjs", peerServer);

app.listen(PORT, () => {
  console.log(`PeerJS server listening on :${PORT}`);
  console.log(`Peer endpoint: /peerjs`);
});

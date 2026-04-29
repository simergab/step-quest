const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");

const root = __dirname;
const port = 8443;
const httpPort = Number(process.env.PORT || 3000);
const httpHost = process.env.PORT ? "0.0.0.0" : "127.0.0.1";
const maxPlayers = 2;
const roomTtlMs = 6 * 60 * 60 * 1000;
const rooms = new Map();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

function sendJson(res, status, data) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(data));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 100_000) {
        reject(new Error("Payload muito grande."));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("JSON invalido."));
      }
    });
    req.on("error", reject);
  });
}

function makeRoomCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 5; i += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

function makePlayerId() {
  return crypto.randomBytes(8).toString("hex");
}

function publicPlayers(room) {
  return Object.values(room.players).map((player) => ({
    id: player.id,
    name: player.name,
    totalSteps: player.totalSteps,
    score: player.score,
    coins: player.coins,
    calories: player.calories,
    levelName: player.levelName,
    levelIndex: player.levelIndex,
    levelSteps: player.levelSteps,
    levelGoal: player.levelGoal,
    updatedAt: player.updatedAt,
  }));
}

function normalizePlayer(playerId, name, payload = {}) {
  return {
    id: playerId,
    name: String(name || payload.name || "Jogador").slice(0, 14),
    totalSteps: Number(payload.totalSteps || 0),
    score: Number(payload.score || 0),
    coins: Number(payload.coins || 0),
    calories: Number(payload.calories || 0),
    levelName: String(payload.levelName || "Bosque Inicial").slice(0, 40),
    levelIndex: Number(payload.levelIndex || 0),
    levelSteps: Number(payload.levelSteps || 0),
    levelGoal: Number(payload.levelGoal || 20),
    updatedAt: Date.now(),
  };
}

function cleanRooms() {
  const now = Date.now();
  for (const [code, room] of rooms.entries()) {
    if (now - room.updatedAt > roomTtlMs) {
      rooms.delete(code);
    }
  }
}

async function handleApi(req, res, pathname) {
  cleanRooms();

  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Metodo nao permitido." });
    return;
  }

  try {
    const body = await readJson(req);

    if (pathname === "/api/room/create") {
      let roomCode = makeRoomCode();
      while (rooms.has(roomCode)) roomCode = makeRoomCode();

      const playerId = makePlayerId();
      const room = {
        roomCode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        players: {},
      };
      room.players[playerId] = normalizePlayer(playerId, body.name, body.payload);
      rooms.set(roomCode, room);
      sendJson(res, 200, { roomCode, playerId, players: publicPlayers(room) });
      return;
    }

    const roomCode = String(body.roomCode || "").trim().toUpperCase();
    const room = rooms.get(roomCode);
    if (!room) {
      sendJson(res, 404, { error: "Sala nao encontrada. Crie outra sala." });
      return;
    }

    if (pathname === "/api/room/join") {
      let playerId = body.playerId;
      const players = Object.keys(room.players);
      if (!playerId || !room.players[playerId]) {
        if (players.length >= maxPlayers) {
          sendJson(res, 409, { error: "Essa sala ja tem 2 jogadores." });
          return;
        }
        playerId = makePlayerId();
      }

      room.players[playerId] = normalizePlayer(playerId, body.name, body.payload);
      room.updatedAt = Date.now();
      sendJson(res, 200, { roomCode, playerId, players: publicPlayers(room) });
      return;
    }

    if (pathname === "/api/room/update") {
      const playerId = String(body.playerId || "");
      if (!playerId) {
        sendJson(res, 400, { error: "Jogador invalido." });
        return;
      }

      const players = Object.keys(room.players);
      if (!room.players[playerId] && players.length >= maxPlayers) {
        sendJson(res, 409, { error: "Essa sala ja tem 2 jogadores." });
        return;
      }

      room.players[playerId] = normalizePlayer(playerId, body.payload?.name, body.payload);
      room.updatedAt = Date.now();
      sendJson(res, 200, { roomCode, playerId, players: publicPlayers(room) });
      return;
    }

    if (pathname === "/api/room/leave") {
      const playerId = String(body.playerId || "");
      delete room.players[playerId];
      room.updatedAt = Date.now();
      if (Object.keys(room.players).length === 0) rooms.delete(roomCode);
      sendJson(res, 200, { ok: true });
      return;
    }

    sendJson(res, 404, { error: "Rota nao encontrada." });
  } catch (error) {
    sendJson(res, 400, { error: error.message || "Erro na sala online." });
  }
}

function serveFile(req, res, pathname) {
  const safePath = path
    .normalize(pathname === "/" ? "/index.html" : pathname)
    .replace(/^(\.\.[/\\])+/, "");
  const filePath = path.join(root, safePath);

  if (!filePath.startsWith(root)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mime[path.extname(filePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(content);
  });
}

function handleRequest(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  if (url.pathname.startsWith("/api/")) {
    handleApi(req, res, url.pathname);
    return;
  }

  serveFile(req, res, decodeURIComponent(url.pathname));
}

const httpServer = http.createServer(handleRequest);

const pfxPath = path.join(root, "step-quest-local.pfx");
if (fs.existsSync(pfxPath)) {
  const httpsServer = https.createServer(
    {
      pfx: fs.readFileSync(pfxPath),
      passphrase: "stepquest-local",
    },
    handleRequest
  );

  httpsServer.listen(port, "0.0.0.0", () => {
    console.log(`Step Quest HTTPS server: https://0.0.0.0:${port}`);
  });
}

httpServer.listen(httpPort, httpHost, () => {
  console.log(`Step Quest HTTP server: http://${httpHost}:${httpPort}`);
});

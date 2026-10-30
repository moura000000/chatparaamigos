const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Se definires CHAT_PASSWORD no Render, só entra quem souber a palavra-passe
const PASSWORD = process.env.CHAT_PASSWORD || "";
const MAX_HISTORY = 100;

const history = [];       // mensagens em memória (perdem-se ao reiniciar)
const users = new Map();  // socket.id -> nome

app.use(express.static("public"));

function pushMessage(msg) {
  history.push(msg);
  if (history.length > MAX_HISTORY) history.shift();
  io.emit("message", msg);
}

io.on("connection", (socket) => {
  socket.on("join", ({ name, password }, ack) => {
    name = String(name || "").trim().slice(0, 20);
    if (!name) return ack({ ok: false, error: "Escreve um nome." });
    if (PASSWORD && password !== PASSWORD)
      return ack({ ok: false, error: "Palavra-passe errada." });
    if ([...users.values()].some((n) => n.toLowerCase() === name.toLowerCase()))
      return ack({ ok: false, error: "Esse nome já está a ser usado." });

    users.set(socket.id, name);
    ack({ ok: true, history });
    io.emit("users", [...users.values()]);
    pushMessage({ system: true, text: `${name} entrou no chat`, time: Date.now() });
  });

  socket.on("message", (text) => {
    const name = users.get(socket.id);
    text = String(text || "").trim().slice(0, 500);
    if (!name || !text) return;
    pushMessage({ name, text, time: Date.now() });
  });

  socket.on("disconnect", () => {
    const name = users.get(socket.id);
    if (!name) return;
    users.delete(socket.id);
    io.emit("users", [...users.values()]);
    pushMessage({ system: true, text: `${name} saiu do chat`, time: Date.now() });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Chat a correr na porta ${PORT}`));

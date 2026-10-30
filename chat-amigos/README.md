# Chat dos amigos

Chat em tempo real com Node.js, Express e Socket.IO.

## Correr no teu computador
    npm install
    npm start
Abre http://localhost:3000

## Publicar no Render
1. Envia o projeto para o GitHub.
2. No Render: New + > Web Service > escolhe o repositório.
3. Build Command: `npm install`  |  Start Command: `npm start`
4. (Opcional) Em Environment, cria `CHAT_PASSWORD` para só entrarem amigos que saibam a palavra-passe.

Nota: as mensagens ficam em memória e apagam-se quando o servidor reinicia.

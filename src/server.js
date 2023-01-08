import http from "http";
import express from "express";
import WebSocket from "ws";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handleListen = () => console.log(`listening on http://localhost:3000`);

//http서버와 ws서버를 같이 구동하기 위해 하는 작업
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// function handleConnection(socket){
//     console.log(socket);
// }

// wss.on("connection",handleConnection);

const sockets = [];

wss.on("connection", (socket) => {
  sockets.push(socket);
  socket["nickname"] = "익명의 누군가";
  console.log("connected to Browser 😘");

  socket.on("close", () => {
    console.log("Disconnected from Browser 😴");
  });

  socket.on("message", (msg) => {
    const message = JSON.parse(msg.toString());

    switch (message.type) {
      case "new_Message":
        sockets.forEach((aSocket) => aSocket.send(`${socket.nickname}: ${message.payload}`));
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  });
});

server.listen(3000, handleListen);

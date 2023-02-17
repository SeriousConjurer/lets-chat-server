const express = require("express");
const router = require("./routes");
const app = express();
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server, {
  cors: {
    origin: "*",
  },
});

app.use(router);
const PORT = process.env.PORT || 4001;
let users = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  // **********************************************************
  socket.on("SendName", (data) => {
    console.log(users.indexOf(data));
    if (users.indexOf(data.name) > -1) {
      //Already Present
     // console.log("YE QU");
      io.to(socket.id).emit("SendtoUser", {
        username: "NoName",
        message: "User Name already present",
      });
    } else {
      io.to(socket.id).emit("SendtoUser", {
        id: new Date().toLocaleTimeString(),
        username: data,
        message: "Welcome !!!!",
      });
      socket.broadcast.emit("SendtoUser", {
        id: new Date().toLocaleTimeString(),
        username: data.name,
        message: `${data.name} Joined`,
      });
      // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      io.to(socket.id).emit("SendtoChat", {
        id: new Date().toLocaleTimeString(),
        username: "",
        message: "Welcome !!!!",
      });
      socket.broadcast.emit("SendtoChat", {
        id: new Date().toLocaleTimeString(),
        username: "",
        message: `${data.name} Joined`,
      });

      users.push(data.name);
    }
    // **********************************************************

    socket.on("giveName", (data) => {
      socket.emit("takeName", { name: users[users.length - 1] });
    });
    // ***********************************************************

    socket.on("SendtoServer", (data) => {
     // console.log(data);
      io.to(socket.id).emit("SendtoChat", {
        id:new Date().toLocaleTimeString(),
        username: "You",
        message: data.input,
      });
      socket.broadcast.emit("SendtoChat", {
        id: new Date().toLocaleTimeString(),
        username: data.name,
        message: data.input,
      });
    });
  });

  socket.on("disconnect", (data) => {
   // console.log("user left");
    socket.broadcast.emit("SendtoChat", {
      username: "",
      message: "A User Left",
    });
  });
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

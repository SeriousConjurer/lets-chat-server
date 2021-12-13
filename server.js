const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

let users = [];

io.on("connection", (socket) => {
  console.log("a user connected");
  // **********************************************************
  socket.on("SendName", (data) => {
    console.log(users.indexOf(data));
    if (users.indexOf(data.name) > -1) {
      //Already Present
      console.log("YE QU");
      io.to(socket.id).emit("SendtoUser", {
        username: "NoName",

        message: "User Name already present",
      });
    } else {
      io.to(socket.id).emit("SendtoUser", {
        username: data,
        message: "Welcome !!!!",
      });
      socket.broadcast.emit("SendtoUser", {
        username: data.name,
        message: `${data.name} Joined`,
      });
// %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
      io.to(socket.id).emit("SendtoChat", {
        username: "",
        message: "Welcome !!!!",
      });
      socket.broadcast.emit("SendtoChat", {
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
      console.log(data);
      io.to(socket.id).emit("SendtoChat", {
        username: "You",
        message: data.input,
      });
      socket.broadcast.emit("SendtoChat", {
        username: data.name,
        message: data.input,
      });
    });
  });

  socket.on("disconnect", (data) => {
    console.log("user left");
    socket.broadcast.emit("SendtoChat", {
      username: "",
      message: "A User Left",
    });
  });
});

http.listen(4001, () => console.log(`Listening on port 4001`));

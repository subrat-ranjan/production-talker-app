const { default: mongoose } = require("mongoose")


const express = require("express")
const cors = require("cors")
// const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes");
const messageRoute = require("./routes/messagesRoute");
const socket = require("socket.io");
const path = require('path');



const app = express();
require("dotenv").config();

//middlewares
app.use(cors());
app.use(express.json());

//routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

//static files
app.use(express.static(path.join(__dirname, "../client/build")));
app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, "../client/build/index.html"))
});

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(() => {
    console.log("DB Connection Successfull");
}).catch((err) => {
    console.log(err.message);
});


const server = app.listen(process.env.PORT, () => {
    console.log(`Server Started on port ${process.env.PORT}`);
});

const io = socket(server, {
    cors: {

        credentials: true,

    },
});
//node.js global object

global.onlineUsers = new Map();

io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("msg-recieve", data.message);
        }
    });
});

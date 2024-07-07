const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "http://localhost:3000", // React app address
		methods: ["GET", "POST"],
	},
});

const ROOM_SIZE = 500; // Room dimensions (500x500 pixels)
let players = {};

app.use(cors()); // Enable CORS

const getRandomColor = () => {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

const messages = [];

io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);
	players[socket.id] = {
		x: ROOM_SIZE / 2,
		y: ROOM_SIZE / 2,
		color: getRandomColor(),
	}; // Start in the center with a random color

	socket.emit("currentPlayers", players);
	socket.emit("currentMessages", messages);

	socket.broadcast.emit("newPlayer", {
		id: socket.id,
		x: ROOM_SIZE / 2,
		y: ROOM_SIZE / 2,
		color: players[socket.id].color,
	});

	socket.on("move", (direction) => {
		const player = players[socket.id];
		if (!player) return;

		const STEP = 5; // Number of pixels to move per key press
		switch (direction) {
			case "left":
				player.x = Math.max(player.x - STEP, 0);
				break;
			case "right":
				player.x = Math.min(player.x + STEP, ROOM_SIZE - 20); // Assuming player size is 20x20 pixels
				break;
			case "up":
				player.y = Math.max(player.y - STEP, 0);
				break;
			case "down":
				player.y = Math.min(player.y + STEP, ROOM_SIZE - 20);
				break;
		}
		io.emit("playerMoved", {
			id: socket.id,
			x: player.x,
			y: player.y,
			color: player.color,
		});
	});

	socket.on("disconnect", () => {
		delete players[socket.id];
		io.emit("playerDisconnected", socket.id);
		console.log("A user disconnected:", socket.id);
	});

	socket.on("sendMessage", (message) => {
		messages.push({ user: message.user, message: message.message });
		io.emit("newMessage", { user: message.user, message: message.message });
		console.log("new message : ", message);
	});
});

server.listen(3001, () => {
	console.log("Server is listening on port 3001");
});

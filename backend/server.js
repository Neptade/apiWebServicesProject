const { authRouter } = require('./auth/authRouter');
const { useGoogleStrategy } = require('./auth/passport.config.js');
const { jwtAuthRest, jwtAuthWebSocket } = require('./auth/jwtAuth');
const express = require("express");
const session = require('express-session');
const cors = require("cors");
const http = require("http");
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const socketIo = require("socket.io");
const passport = require("passport");

require('dotenv').config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
	cors: {
		origin: "http://localhost:3000", 
		methods: ["GET", "POST"],
	},
});
io.use((socket, next) => {
    jwtAuthWebSocket(socket, next);
	console.log("authenticated socket connected");
});


app.use(bodyParser.json());
app.use(cors()); 
app.use(session({
	secret : process.env.SESSION_SECRET,
	resave : false,
	saveUninitialized : true
}))
app.use(passport.initialize());
app.use(passport.session());
app.use('/auth', authRouter);
app.post('/profile',
	async (req, res) => {
		jwtAuthRest(req);
		const { token, key } = req.body;
		const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        email = decoded['user']['email'];
		await fetch (`http://localhost:8085/dbmanager/update-stats`, {
			method : 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, key }),
		}).then((res) => res.json()).then((data) => res.json(data));
	}
)
useGoogleStrategy();

const ROOM_SIZE = 500;
let players = {};
const messages = [];

const getRandomColor = () => {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
};

io.on("connection", async (socket) => {
	let username = socket.user.user.username;
	let email = socket.user.user.email;
	let speed = await fetch(`http://localhost:8085/dbmanager/getSpeed/${email}`).then((res) => res.json()).then((data) => data.speed);
	let size = await fetch(`http://localhost:8085/dbmanager/getSize/${email}`).then((res) => res.json()).then((data) => data.size)
	console.log("A user connected:", username);

	players[email] = {
		x: ROOM_SIZE / 2,
		y: ROOM_SIZE / 2,
		color: getRandomColor(),
	}; // Start in the center with a random color

	socket.emit("currentPlayers", players);
	socket.emit("currentMessages", messages);
	socket.emit("playerSize", size);

	socket.broadcast.emit("newPlayer", {
		id: email,
		x: ROOM_SIZE / 2,
		y: ROOM_SIZE / 2,
		color: players[email].color,
	});

	socket.on("reload", async () => {
		socket.emit("currentPlayers", players);
		socket.emit("currentMessages", messages);
		socket.emit("playerSize", size);

		socket.broadcast.emit("newPlayer", {
			id: email,
			x: ROOM_SIZE / 2,
			y: ROOM_SIZE / 2,
			color: players[email].color,
		});
	});

	socket.on("move", async (direction) => {
		const player = players[email];
		const pointsGained = size * speed;
		console.log("points gained: ", pointsGained);
		await fetch(`http://localhost:8085/dbmanager/incrementPoints`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, pointsGained }),
		});
		console.log("points updated");
		if (!player) return;
		const STEP = speed; // Number of pixels to move per key press
		switch (direction) {
			case "left":
				player.x = Math.max(player.x - STEP, 0);
				break;
			case "right":
				player.x = Math.min(player.x + STEP, ROOM_SIZE); 
				break;
			case "up":
				player.y = Math.max(player.y - STEP, 0);
				break;
			case "down":
				player.y = Math.min(player.y + STEP, ROOM_SIZE);
				break;
		}
		io.emit("playerMoved", {
			id: email,
			x: player.x,
			y: player.y,
			color: player.color,
		});
	});
	
	socket.on("disconnect", () => {
		delete players[email];
		io.emit("playerDisconnected", email);
		console.log("A user disconnected:", email);
	});

	socket.on("sendMessage", (message) => {
		messages.push({ user: email, message: message.message });
		io.emit("newMessage", { user:email, message: message.message });
		console.log("new message : ", message);
	});
});

server.listen(3001, () => {
	console.log("Server is listening on port 3001");
});

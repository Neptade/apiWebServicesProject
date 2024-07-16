import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import "./room.css";

const socket = io("http://localhost:3001"); 
//const socket = io("http://52.47.126.198:3001/"); //teacher's server

const ROOM_SIZE = 500;

function Room() {
	const [players, setPlayers] = useState({});
	const [playerId, setPlayerId] = useState(null);
	const [messages, setMessages] = useState([]);

	useEffect(() => {
		socket.on('newPlayer', (newPlayer) => {
			console.log('connected');
			setPlayers((players) => ({
				...players,
				[newPlayer.id]: newPlayer,
			}));
		});
		socket.on('currentPlayers', (currentPlayers) => {
			setPlayers(currentPlayers);
		});
		socket.on('playerMoved', (playerMoved) => {
			setPlayers((players) => ({
				...players,
				[playerMoved.id]: playerMoved,
			}));
		});
		socket.on("playerDisconnected", (id) => {
			setPlayers((players) => {
				const newPlayers = { ...players };
				delete newPlayers[id];
				return newPlayers;
			});
		});
		socket.on("currentMessages", (messages) => {
			setMessages(messages);
		});
		socket.on("newMessage", (message) => {
			setMessages((messages) => [...messages, message]);
		});
		// socket.on("sendMessage", (message) => {
		// 	socket.emit("newMessage", {user: socket.id, message : message});
		// });

		return () => {
			socket.off("currentPlayers");
			socket.off("newPlayer");
			socket.off("playerMoved");
			socket.off("playerDisconnected");
			socket.off("currentMessages");
			socket.off("newMessage");
		};
	}, []);

	useEffect(() => {
		setPlayerId(socket.id);

		const handleKeyDown = (e) => {
			switch (e.key) {
				case "ArrowLeft":
					socket.emit("move", "left");
					break;
				case "ArrowRight":
					socket.emit("move", "right");
					break;
				case "ArrowUp":
					socket.emit("move", "up");
					break;
				case "ArrowDown":
					socket.emit("move", "down");
					break;
				default:
					break;
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<div className="container">
			<div className="gameBox" style={{
				position: "relative",
				width: ROOM_SIZE,
				height: ROOM_SIZE,
				border: "2px solid black",
			}}>
				{Object.entries(players).map(([id, player]) => {
					return (
						<div
							key={id}
							style={{
								position: "absolute",
								width: 20,
								height: 20,
								backgroundColor: player.color,
								left: player.x,
								top: player.y,
								transform: "translate(-50%, -50%)",
							}}
						>
						</div>
					);
				})}
			</div>
			<div className="messageBox">
				<form input="text">
					<input type="text" id="message" name="message" />
					<button onClick={(event) => {
						event.preventDefault();
						socket.emit("sendMessage", {user : socket.id, message : document.getElementById("message").value});
					}}>Send</button>
				</form>
				{(
					Object.entries(messages).map(([id, message]) => (
						<div key={id} className="player">
							<h5>{message.user}</h5>
							<p>
								{message.message}
							</p>
						</div>
					))
				)}
			</div>
			<div className="playerList">
				{(
					Object.entries(players).map(([id, player]) => (
						<div key={id} className="player">
							<h3>{id}</h3>
							<p>
								X: {player.x}
								&nbsp;
								Y: {player.y}
							</p>
						</div>
					))
				)}
			</div>
		</div>
	);
}

export default Room;

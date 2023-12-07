const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT });

wss.on("connection", (socket) => {
    socket.on("message", (data) => {
        const message = JSON.parse(data);

        switch (message.type) {
            case "username": {
                console.log(`${message.text} connected`);
                socket.username = message.text;

                wss.clients.forEach((client) => {
                    if (client !== socket) {
                        client.send(`${message.text} connected`);
                    }
                });

                break;
            }

            case "message": {
                wss.clients.forEach((client) => {
                    if (client !== socket) {
                        const name = socket.username ?? "Unknown";
                        client.send(`${name}: ${message.text}`);
                    }
                });

                break;
            }

            default:
                break;
        }
    });

    socket.on("close", () => {
        const name = socket.username ?? "Unknown";
        console.log(`${name} disconnected`);

        wss.clients.forEach((client) => {
            if (client !== socket) {
                const name = socket.username ?? "Unknown";
                client.send(`${name} disconnected`);
            }
        });
    })
});

console.log("Server is running on ws://localhost:8080");

const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: process.env.PORT });


let totalUsers = 0;

wss.on("connection", (socket) => {
    totalUsers += 1;

    socket.on("message", (data) => {
        const message = JSON.parse(data);

        switch (message.type) {
            case "username": {
                console.log(`${message.text} connected`);
                socket.username = message.text;

                wss.clients.forEach((client) => {
                    if (client !== socket) {
                        client.send(JSON.stringify({ type: "system", text: `${message.text} connected` }));
                    }

                    client.send(JSON.stringify({ type: "totalUsers", text: totalUsers }));
                });

                break;
            }

            case "message": {
                wss.clients.forEach((client) => {
                    if (client !== socket) {
                        const name = socket.username ?? "Unknown";
                        client.send(JSON.stringify({ type: "message", text: `${name}: ${message.text}` }));
                    }
                });

                break;
            }

            default:
                break;
        }
    });

    socket.on("close", () => {
        totalUsers -= 1;

        const name = socket.username ?? "Unknown";
        console.log(`${name} disconnected`);

        wss.clients.forEach((client) => {
            if (client !== socket) {
                client.send(JSON.stringify({ type: "system", text: `${name} disconnected` }));
                client.send(JSON.stringify({ type: "totalUsers", text: totalUsers }));
            }
        });
    })
});

console.log("Server is running");

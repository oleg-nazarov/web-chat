function startWs(name) {
    function addChildMessage(container, text) {
        const message = document.createElement("div");
        message.classList.add("message");
        message.textContent = text;
    
        container.appendChild(message);
        container.scrollTop = container.scrollHeight;
    }
    
    const container = document.getElementById("message-container");
    const input = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    const sendMessage = () => {
        addChildMessage(container, `You: ${input.value}`);
        ws.send(JSON.stringify({ type: "message", text: input.value }));

        input.value = "";
    };

    const ws = new WebSocket("wss://easy-web-chat-601001dda003.herokuapp.com");
    
    ws.addEventListener("open", () => {
        ws.send(JSON.stringify({ type: "username", text: name }));
    });


    ws.addEventListener("message", (event) => {
        addChildMessage(container, event.data);
    });

    ws.addEventListener("close", () => {
        addChildMessage(container, "Chat is disconnected");
    });

    sendButton.addEventListener("click", () => {
        sendMessage();
    });

    input.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    document.getElementById("login").style.display = "none";
    document.getElementById("chat").style.display = "flex";

    input.focus();
}

document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username-input");
    const loginButton = document.getElementById("login-button");

    const tryToLogin = () => {
        const username = usernameInput.value.trim();

        if (username) {
            startWs(username);
        } else {
            alert("User name mustn't be empty");
        }
    };

    usernameInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            tryToLogin();
        }
    });

    loginButton.addEventListener("click", () => {
        tryToLogin();
    });
});

function startWs(name) {
    function addMessage({ container, text, tag = 'span', isYour = false }) {
        const message = getMessageChild({ text, tag, isYour });
        container.appendChild(message);

        container.scrollTop = container.scrollHeight;
    }

    function getMessageChild({ text, tag, isYour }) {
        const block = document.createElement(tag);
        block.textContent = text;
        block.classList.add("message-inner");

        const message = document.createElement("div");

        if (isYour) {
            message.classList.add("message_your");
            block.classList.add("message-inner_your");
        }

        message.appendChild(block);
        message.classList.add("message");

        return message;
    }

    const nameContainer = document.getElementById("your-name");
    const totalUsers = document.getElementById("total-users");

    const container = document.getElementById("message-container");
    const input = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    const sendMessage = () => {
        addMessage({
            container,
            text: input.value,
            isYour: true,
        });

        ws.send(JSON.stringify({ type: "message", text: input.value }));

        input.value = "";
    };

    nameContainer.textContent = name;

    const ws = new WebSocket("wss://oleg-nazarov-web-chat.glitch.me");

    ws.addEventListener("open", () => {
        ws.send(JSON.stringify({ type: "username", text: name }));
    });


    ws.addEventListener("message", (event) => {
        const data = JSON.parse(event.data);

        if (data.type === "message") {
            addMessage({
                container,
                text: data.text,
            });
        } else if (data.type === "system") {
            addMessage({
                container,
                text: data.text,
                tag: "em",
            });
        } else if (data.type === "totalUsers") {
            totalUsers.textContent = data.text;
        }

    });

    ws.addEventListener("close", () => {
        addMessage({
            container,
            text: "Chat is disconnected",
            tag: "em",
        });
        // for Glitch
        addMessage({
            container,
            text: "Note: when inactive, it might take up to 1 minute from the server to start up again",
            tag: "strong",
        });
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

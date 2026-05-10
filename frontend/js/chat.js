async function sendMessage() {
    const input = document.getElementById("user-input");
    const chatBox = document.getElementById("chat-box");

    if (!input || !chatBox) {
        console.error("Chat UI elements are missing.");
        return;
    }

    const message = input.value.trim();
    if (message === "") return;

    const role = window.userRole || "Guest";

    chatBox.innerHTML += `
        <div class="message-row user">
            <p>${message}</p>
        </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = "";

    const typingIndicator = document.createElement("div");
    typingIndicator.className = "message-row typing-indicator";
    typingIndicator.innerHTML = `
        <div class="typing-bubble">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatBox.appendChild(typingIndicator);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch("https://vvit-chabot.onrender.com/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message,
                role
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const reply = data.reply || "Sorry, I didn't get a response from the chatbot.";

        typingIndicator.remove();
        chatBox.innerHTML += `
            <div class="message-row bot">
                <p>${reply}</p>
            </div>
        `;

        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
        console.error(error);
        typingIndicator.remove();
        chatBox.innerHTML += `
            <div class="message-row error">
                <p><strong>Error:</strong> ${error.message}</p>
            </div>
        `;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
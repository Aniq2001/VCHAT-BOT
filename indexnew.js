const chatbox = document.getElementById("chat-log");
const chatInput = document.getElementById("user-input");
const sendChatBtn = document.getElementById("send-button");

let userMessage = null; // Variable to store user's message
const API_KEY = "";
const inputInitHeight = chatInput.scrollHeight;

// Function to create a chat list item
const createChatLi = (message, className) => {
    const chatLi = document.createElement("div");
    chatLi.classList.add("message", className);
    const content = className === "outgoing" ? message : `<span class="material-symbols-outlined">VChat Bot : </span>${message}`;
    chatLi.innerHTML = `<p>${content}</p>`;
    return chatLi;
}

// Function to generate response from the AI
const generateResponse = async (userMessage) => {
    const API_URL = "https://api.openai.com/v1/chat/completions";

    try {
        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: userMessage}],
            })
        };
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();
        const responseMessage = data.choices[0].message.content.trim();
        displayMessage(responseMessage, "incoming");
    } catch (error) {
        console.error("Error:", error);
        displayMessage("Oops! Something went wrong. Please try again.", "error");
    }
}

// Function to display a message in the chatbox
const displayMessage = (message, className) => {
    const chatLi = createChatLi(message, className);
    chatbox.appendChild(chatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
}

// Function to handle user input and initiate chat
const handleChat = () => {
    userMessage = chatInput.value.trim();
    if (!userMessage) return;

    // Append user's message to the chatbox
    displayMessage(userMessage, "outgoing");

    // Generate response after a short delay
    setTimeout(() => {
        generateResponse(userMessage);
    }, 600);

    // Clear input textarea and reset its height
    chatInput.value = "";
    chatInput.style.height = `${inputInitHeight}px`;
}

// Event listeners
chatInput.addEventListener("input", () => {
    chatInput.style.height = `${inputInitHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
        e.preventDefault();
        handleChat();
    }
});

sendChatBtn.addEventListener("click", handleChat);

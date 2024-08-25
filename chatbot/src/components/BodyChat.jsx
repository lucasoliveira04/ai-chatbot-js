import React, { useState } from "react";
import { ChatMessages } from "./ChatMessage.jsx";

export const BodyChat = () => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);

    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        const userMessage = { text: inputValue, isUser: true };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await fetch("http://localhost:3000/api/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: inputValue }),
            });

            const data = await response.json();

            const botMessage = { text: data.choices[0].message.content, isUser: false };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Erro ao enviar a mensagem:", error);
        }

        setInputValue("");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <ChatMessages messages={messages} />
            <div className="p-4 bg-blue-200 border-t border-none flex">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 p-2 rounded-lg border border-gray-300 h-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:opacity-90"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
};

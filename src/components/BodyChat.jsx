import React, {useEffect, useState} from "react";
import { ChatMessages } from "./ChatMessage.jsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {PaperAirplaneIcon} from "@heroicons/react/16/solid/index.js";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export const BodyChat = () => {
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [botTyping, setBotTyping] = useState(false);

    useEffect(() => {
        const now = new Date().toLocaleString()
        setStartTime(now)
    }, []);

    const handleSendMessage = async () => {
        if (inputValue.trim() === "") return;

        const sanitizedMessage = inputValue
            .replace(/'/g, ' ')
            .replace(/"/g, ' ')
            .replace(/[(){}[\]]/g, ' ')

        const now = new Date().toISOString();
        const userMessage = { text: inputValue, isUser: true, timestamp: now };
        setMessages((prevMessages) => [...prevMessages, userMessage]);

        setBotTyping(true);

        try {
            const response = await fetch("https://chatbot-api-fv3b.onrender.com/api/chat/message", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ message: sanitizedMessage }),
            });

            const data = await response.json();

            const botMessage = { text: data.choices[0].message.content, isUser: false, timestamp: now };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error("Erro ao enviar a mensagem:", error);
        } finally {
            setInputValue("");
            setBotTyping(false);
        }
    };


    const reloadPage = () => {
        window.location.reload()
    }

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="flex justify-between font-bold p-4 bg-white shadow-md cursor-default">
                <h3 className={"text-black-800 text-2xl"}>
                    Chat AI 🤖
                </h3>
                <div className="flex items-center">
                    <p className="text-xs mr-4">
                        {startTime}
                    </p>
                    <button className="p-1 hover:bg-gray-200 rounded-full" onClick={reloadPage} title={"Excluir chat"}>
                        <FontAwesomeIcon  icon={faTrash} className="ext-gray-500 hover:text-purple-800 transition-colors duration-300 ease-in-out"/>
                    </button>
                </div>
            </div>

            <ChatMessages messages={messages}/>

            <div className="p-4 bg-white border-t border-gray-200 flex items-center">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 p-3 rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none font-bold"
                    placeholder="Digite sua mensagem..."
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleSendMessage();
                        }
                    }}
                />
                <button
                    title={"Enviar"}
                    onClick={handleSendMessage}
                    style={{height: "50px"}}
                    className="ml-4 px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all duration-300"
                >
                    <PaperAirplaneIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

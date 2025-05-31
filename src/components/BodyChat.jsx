import React, { useEffect, useState } from "react";
import { ChatMessages } from "./ChatMessage.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PaperAirplaneIcon } from "@heroicons/react/16/solid/index.js";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export const BodyChat = () => {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [botTyping, setBotTyping] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const now = new Date().toLocaleString();
    setStartTime(now);

    // Carrega o tema salvo no localStorage
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const handleSendMessage = async () => {
    if (inputValue.trim() === "") return;

    const sanitizedMessage = inputValue
      .replace(/'/g, " ")
      .replace(/"/g, " ")
      .replace(/[(){}[\]]/g, " ");

    const now = new Date().toISOString();
    const userMessage = { text: inputValue, isUser: true, timestamp: now };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    setBotTyping(true);

    try {
      const apiKey = import.meta.env.VITE_API_KEY;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: sanitizedMessage }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      let botTextRaw = data?.candidates[0]?.content?.parts[0]?.text;

      if (typeof botTextRaw !== "string") {
        botTextRaw = JSON.stringify(botTextRaw);
      }

      const botText = botTextRaw || "Não consegui resposta da Gemini.";

      const botMessage = { text: botText, isUser: false, timestamp: now };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error("Erro ao enviar a mensagem:", error);
    } finally {
      setInputValue("");
      setBotTyping(false);
    }
  };

  const reloadPage = () => {
    // Restaura o tema do localStorage antes de recarregar a página
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    }
    window.location.reload();
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  return (
    <div
      className={`flex flex-col h-screen ${
        isDarkMode
          ? "bg-gray-900 text-white transition-colors duration-300"
          : "bg-gray-100 text-black transition-colors duration-300"
      }`}
    >
      <div
        className={`flex justify-between font-bold p-4 ${
          isDarkMode ? "bg-gray-800" : "bg-gray-100 shadow-md"
        } transition-colors duration-300 shadow-md`}
      >
        <h3 className="text-2xl">Chat AI 🤖</h3>
        <div className="flex items-center space-x-4">
          <p className="text-xs">{startTime}</p>

          {/* Botão para alternar tema */}
          <button
            className="p-2 transition-all duration-300 transform hover:scale-110 focus:outline-none"
            onClick={toggleTheme}
          >
            {isDarkMode ? "🌙" : "☀️"}
          </button>

          {/* Botão para excluir chat */}
          <button
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
            onClick={reloadPage}
            title="Excluir chat"
          >
            <FontAwesomeIcon
              icon={faTrash}
              className="text-gray-500 hover:text-purple-800 transition-all duration-300"
            />
          </button>
        </div>
      </div>

      <ChatMessages messages={messages} isDarkMode={isDarkMode} />

      <div
        className={`p-4 border-t flex items-center ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-200"
        } transition-colors duration-300`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className={`flex-1 p-3 rounded-lg border ${
            isDarkMode
              ? "border-gray-600 bg-gray-700 text-white focus:border-purple-400"
              : "border-gray-300 focus:border-purple-500"
          } focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none font-bold`}
          placeholder="Digite sua mensagem..."
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
              setInputValue(" ");
            }
          }}
        />
        <button
          title="Enviar"
          onClick={handleSendMessage}
          style={{ height: "50px" }}
          className={`ml-4 px-6 py-2 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-300 ${
            isDarkMode
              ? "bg-purple-700 text-white hover:bg-purple-800"
              : "bg-purple-500 text-white hover:bg-purple-600"
          }`}
        >
          <PaperAirplaneIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

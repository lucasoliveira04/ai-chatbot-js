import React, { useState } from "react";
import axios from 'axios';
import { marked } from 'marked';

const Message = ({ text, isUser, timestamp, isDarkMode }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showCopyButton, setShowCopyButton] = useState(false);
    const [translatedText, setTranslatedText] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isTranslated, setIsTranslated] = useState(false);
    const [sourceLang, setSourceLang] = useState('EN');
    const [targetLang, setTargetLang] = useState('PT');
    const apiKey = "43c3f2f4-5f60-4652-88d2-45cb2aa964af:fx"

    const MAX_LIMIT = 3;
    const lines = isTranslated ? translatedText.split('\n') : text.split('\n');
    const displayLines = isExpanded ? lines : lines.slice(0, MAX_LIMIT);

    const handleToggle = () => setIsExpanded(!isExpanded);

    const handleCopy = () => {
        navigator.clipboard.writeText(isTranslated ? translatedText : text)
            .then(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const handleTranslate = async () => {
        setLoading(true);
        try {
            const response = await axios.post('https://api-free.deepl.com/v2/translate', new URLSearchParams({
                auth_key: apiKey,
                text: text,
                source_lang: sourceLang,
                target_lang: targetLang
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const translated = response.data.translations[0].text;
            setTranslatedText(translated);
            setIsTranslated(true);
        } catch (err) {
            setError("Não foi possível traduzir o texto. Verifique a sua conexão ou a chave da API.");
            console.error(err.response ? err.response.data : err);
        } finally {
            setLoading(false);
        }
    };

    const markdownToHtml = (text) => marked.parse(text);

    return (
        <div
            className={`message p-2 mb-2 rounded-lg relative ${
                isUser
                    ? isDarkMode ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'
                    : isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-800'
            } max-w-[80%] py-3 px-4`}
            onMouseEnter={() => setShowCopyButton(true)}
            onMouseLeave={() => setShowCopyButton(false)}
        >
            {showAlert && (
                <div className="absolute top-1 right-1 bg-green-100 text-green-800 p-2 rounded-lg shadow-lg">
                    Mensagem copiada com sucesso
                </div>
            )}

            <div className={`top-1 right-1 flex space-x-2 transition-opacity duration-300 ${showCopyButton ? 'opacity-100' : 'opacity-0'}`}>
                {!isUser && (
                    <>
                        <button onClick={handleCopy} className="text-gray-400 hover:text-gray-200">Copiar</button>
                        <button onClick={handleTranslate} className="text-gray-400 hover:text-gray-200">Traduzir</button>
                    </>
                )}
            </div>

            <div className="flex flex-col mb-2">
                {displayLines.map((line, i) => (
                    <p key={i} className="m-0" dangerouslySetInnerHTML={{ __html: markdownToHtml(line) }} />
                ))}
                {lines.length > MAX_LIMIT && (
                    <button onClick={handleToggle} className="text-blue-400 mt-2">{isExpanded ? 'Ver menos' : 'Ver mais'}</button>
                )}
            </div>

            <div className={`bottom-1 text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-black'}`}>
                {new Date(timestamp).toLocaleTimeString()}
            </div>
        </div>
    );
};

export const ChatMessages = ({ messages, isDarkMode }) => {
    return (
        <div className={`flex-1 overflow-auto p-4 space-y-4 ${isDarkMode ? 'bg-black text-white' : 'bg-white text-black'}`}>
            {messages.map((message, i) => (
                <div key={i} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <Message text={message.text} isUser={message.isUser} timestamp={message.timestamp} isDarkMode={isDarkMode} />
                </div>
            ))}
        </div>
    );
};

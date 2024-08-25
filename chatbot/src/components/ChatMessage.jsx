import React, { useState } from "react";

const Message = ({ text, isUser, timestamp }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [showCopyButton, setShowCopyButton] = useState(false);

    const MAX_LIMIT = 3;
    const lines = text.split('\n');
    const displayLines = isExpanded ? lines : lines.slice(0, MAX_LIMIT);

    const handleToggle = () => setIsExpanded(!isExpanded);

    const handleCopy = () => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 2000);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div
            className={`message p-2 mb-2 rounded-lg relative ${
                isUser
                    ? 'bg-blue-500 text-white max-w-[80%] self-end py-3 px-4'
                    : 'bg-gray-200 text-gray-800 max-w-[60%] self-start py-2 px-3'
            }`}
            onMouseEnter={() => setShowCopyButton(true)}
            onMouseLeave={() => setShowCopyButton(false)}
        >
            {/* Exibe o alerta se showAlert for verdadeiro */}
            {showAlert && (
                <div className="absolute top-1 right-1 bg-green-100 text-green-800 p-2 rounded-lg shadow-lg transition-opacity duration-500 opacity-100">
                    Mensagem copiada com sucesso
                </div>
            )}

            {/* Botão de copiar */}
            <div
                className={`top-1 right-1 transition-opacity duration-300 ${
                    showCopyButton ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {!isUser && (
                    <button
                        onClick={handleCopy}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="Copiar mensagem"
                    >
                        Copiar
                    </button>
                )}
            </div>

            {/* Bloco principal da mensagem */}
            <div className="flex flex-col mb-2">
                {/* Contém o texto da mensagem */}
                {displayLines.map((line, i) => (
                    <p key={i} className="m-0">{line}</p>
                ))}
                {/* Botão para expandir ou retrair a mensagem */}
                {lines.length > MAX_LIMIT && (
                    <button onClick={handleToggle} className="text-blue-500 mt-2">
                        {isExpanded ? 'Ver menos' : 'Ver mais'}
                    </button>
                )}
            </div>

            {/* Exibição do horário */}
            <div
                className={`bottom-1 ${
                    isUser ? 'right-2 text-right text-white font-bold opacity-80 hover:opacity-100 cursor-default' : 'left-2 text-left text-black font-bold opacity-80 hover:opacity-100 cursor-default'
                } text-xs mt-2`}
            >
                {new Date(timestamp).toLocaleTimeString()}
            </div>
        </div>
    );
};

export const ChatMessages = ({ messages }) => {
    return (
        <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Mapeia e exibe todas as mensagens */}
            {messages.map((message, i) => (
                <div key={i} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <Message text={message.text} isUser={message.isUser} timestamp={message.timestamp} />
                </div>
            ))}
        </div>
    );
};

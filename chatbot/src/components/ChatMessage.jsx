import React, { useState } from "react";

const Message = ({ text, isUser }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const MAX_LIMIT = 3;
    const lines = text.split('\n');
    const displayLines = isExpanded ? lines : lines.slice(0, MAX_LIMIT);

    const handleToggle = () => setIsExpanded(!isExpanded);

    return (
        <div
            className={`message p-2 mb-2 rounded-lg ${
                isUser
                    ? 'bg-blue-500 text-white max-w-[80%] self-end'
                    : 'bg-gray-200 text-gray-800 max-w-[60%] self-start'
            }`}
        >
            {displayLines.map((line, i) => (
                <p key={i} className="m-0">{line}</p>
            ))}
            {lines.length > MAX_LIMIT && (
                <button onClick={handleToggle} className="text-blue-500 mt-2">
                    {isExpanded ? 'Ver menos' : 'Ver mais'}
                </button>
            )}
        </div>
    );
};

export const ChatMessages = ({ messages }) => {
    return (
        <div className="container-conversa flex-1 overflow-auto p-4 space-y-4">
            {messages.map((message, i) => (
                <div key={i} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
                    <Message text={message.text} isUser={message.isUser} />
                </div>
            ))}
        </div>
    );
};


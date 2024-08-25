document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('.barra-mensagem input[type="text"]');
    const sendButton = document.querySelector('.barra-mensagem button');
    const conversaContainer = document.querySelector('.container-conversa');

    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message-user' : 'message-bot';
        messageDiv.innerHTML = `<p>${text}</p>`;
        conversaContainer.insertBefore(messageDiv, document.querySelector('.barra-mensagem'));
        conversaContainer.scrollTop = conversaContainer.scrollHeight;
    }

    async function getBotResponse(userMessage) {
        try {
            const response = await fetch("http://localhost:3000/api/message", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Error fetching bot response:', error);
            return 'Desculpe, algo deu errado. Tente novamente mais tarde.';
        }
    }
    sendButton.addEventListener('click', async () => {
        const userMessage = inputField.value.trim();

        if (userMessage) {
            addMessage(userMessage, true);
            inputField.value = '';
            try {
                const botResponse = await getBotResponse(userMessage);
                addMessage(botResponse, false);
            } catch (error) {
                addMessage('Desculpe, algo deu errado. Tente novamente mais tarde.', false);
                console.error('Error fetching bot response:', error);
            }
        }
    });

    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendButton.click();
        }
    });
});

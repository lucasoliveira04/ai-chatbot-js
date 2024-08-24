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
        return `Sua mensagem: ${userMessage}`
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

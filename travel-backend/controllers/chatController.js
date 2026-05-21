

const { chatService } = require("../services/chatService");

const chat = async (req, res) => {
    try {
        const { messages, userContext } = req.body;
        console.log(messages, userContext)
        const reply = await chatService(messages, userContext);
        res.status(200).json({ reply });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { chat };
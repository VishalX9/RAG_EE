const Chat = require('../models/Chat');
exports.askAI = async (req, res) => {
    try {
        // 1. Grab BOTH the question and the image from React
        const { question, image } = req.body; 
        const userId = req.user.id; 

        // 2. Send both to Python
        const pythonResponse = awaitfetch(process.env.PYTHON_API_URL + "/ask-gate-bot", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, image }) // Added image here!
        });
        
        const pythonData = await pythonResponse.json();

        // 3. Save the chat to MongoDB (We won't save the image string to save database space, just the text)
        const newChat = new Chat({ 
            userId: userId, 
            question: image ? ` ${question}` : question, 
            answer: pythonData.answer 
        });
        await newChat.save();

        res.json({ status: "Success", answer: pythonData.answer });
    } catch (error) {
        res.status(500).json({ error: "The AI engine is currently resting." });
    }
};

exports.getHistory = async (req, res) => {
    try {

        const history = await Chat.find({ userId: req.user.id }).sort({ createdAt: 1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: "Could not fetch history" });
    }
};

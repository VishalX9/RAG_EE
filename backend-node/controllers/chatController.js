const Chat = require('../models/Chat');
exports.askAI = async (req, res) => {
    try {

        const { question, image } = req.body; 
        const userId = req.user.id; 


        const pythonResponse = await fetch(process.env.PYTHON_API_URL + "/ask-gate-bot", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, image }) 
        });
        

        if (!pythonResponse.ok) {

            const errorText = await pythonResponse.text(); 
            console.error(`PYTHON API FAILED - Status: ${pythonResponse.status}. Details:`, errorText);
        
            return res.status(500).json({ error: "The Python AI engine failed to respond correctly." });
        }

        const pythonData = await pythonResponse.json();


        const newChat = new Chat({ 
            userId: userId, 
            question: image ? `[Image Uploaded] ${question}` : question, 
            answer: pythonData.answer 
        });
        await newChat.save();

        res.json({ status: "Success", answer: pythonData.answer });
    } catch (error) {
        console.error("ACTUAL AI ERROR:", error);
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

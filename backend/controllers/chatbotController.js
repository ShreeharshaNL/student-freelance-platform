// controllers/chatbotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// @desc    Chat with Gemini AI assistant
// @route   POST /api/chatbot/message
// @access  Private
const sendChatMessage = async (req, res) => {
    try {
        const { message, conversationHistory, userRole } = req.body;

        console.log('Chatbot request received:', { message, userRole, historyLength: conversationHistory?.length });

        // Check if API key exists
        if (!process.env.GEMINI_API_KEY) {
            console.error('GEMINI_API_KEY not found in environment variables');
            return res.status(500).json({
                success: false,
                message: "Chatbot configuration error. Please contact support."
            });
        }

        // Initialize Gemini AI with Gemini 2.5 Flash
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Platform context
        const systemPrompt = `You are an AI assistant for a freelance platform that connects students with clients.

Platform Features:
- Students: Browse projects, apply with proposals, track applications, build portfolios, earn money
- Clients: Post projects, review applications, hire students, track progress, make payments
- 5% platform service fee on completed projects
- Categories: Web Development, Graphic Design, Content Writing, Data Entry, Digital Marketing, Mobile Apps, Video Editing, Translation
- Secure payments after project completion
- Rating and review system

Current user: ${userRole || 'guest'}

Be helpful, friendly, and concise. Answer both platform-specific and general questions.`;

        // Build the full prompt with context
        let fullPrompt = systemPrompt + "\n\n";
        
        // Add conversation history (last 5 messages only to save tokens)
        if (conversationHistory && conversationHistory.length > 0) {
            const recentHistory = conversationHistory.slice(-5);
            recentHistory.forEach(msg => {
                if (msg.role === 'user') {
                    fullPrompt += `User: ${msg.parts[0].text}\n`;
                } else if (msg.role === 'model') {
                    fullPrompt += `Assistant: ${msg.parts[0].text}\n`;
                }
            });
        }
        
        fullPrompt += `User: ${message}\nAssistant:`;

        console.log('Sending to Gemini 2.5...');

        // Generate response
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const aiResponse = response.text();

        console.log('Gemini response received successfully');

        res.json({
            success: true,
            message: aiResponse
        });
    } catch (error) {
        console.error('Chatbot error details:', {
            message: error.message,
            stack: error.stack,
            response: error.response?.data
        });
        
        res.status(500).json({
            success: false,
            error: error.message,
            message: "I'm having trouble connecting right now. Please try again in a moment! 😊"
        });
    }
};

module.exports = {
    sendChatMessage
};
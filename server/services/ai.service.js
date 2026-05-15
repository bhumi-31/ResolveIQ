const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey : process.env.OPENAI_API_KEY
});

const triageTicket = async(title , description) => {
    const response = await openai.chat.completions.create({
        model : 'gpt-4o',
        messages : [{
            role: 'system',
            content: `You are an IT helpdesk AI. Analyze the ticket and respond ONLY in JSON format:
            {
                "category": "hardware|software|network|hr|other",
                "ai_suggestion": "2-3 sentence actionable resolution suggestion"
            }`
        },
        {
            role: 'user',
            content: `Title: ${title}\nDescription: ${description}`
        }
        ],
        response_format: { type: 'json_object' }
    });
    return JSON.parse(response.choices[0].message.content);
};

module.exports = {triageTicket};


const chatService = async (messages, userContext = {}) => {

    const cleanMessages = messages.filter(
        m => m.content !== "Sorry, try again!"
            && m.content !== "Something went wrong. Try again!"
            && m.content !== ""
    );

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: `You are Voyager, a friendly travel assistant for a travel booking website.
${userContext.name ? `The user's name is ${userContext.name}. Greet them by first name.` : ""}
Only answer travel-related questions. Keep responses short (2-3 sentences) and friendly.`
                },
                ...cleanMessages
            ],
            max_tokens: 500
        }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, try again!";
};

module.exports = { chatService };
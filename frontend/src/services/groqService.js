const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

async function runChat(prompt) {
  try {
    if (!GROQ_API_KEY) {
      console.error('GROQ_API_KEY is not set!');
      return 'API key is not configured. Please add REACT_APP_GROQ_API_KEY to your .env file.';
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // Fast and free model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful Markdown expert assistant. Help users with Markdown syntax, formatting, and provide examples when asked. Keep responses concise and practical.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Groq API Error:', errorData);
      
      if (response.status === 429) {
        return 'Rate limit exceeded. Please wait a moment and try again.';
      }
      
      throw new Error(errorData.error?.message || 'API request failed');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'No response generated.';
    
  } catch (error) {
    console.error('Error during chat generation:', error);
    return `An error occurred: ${error.message}`;
  }
}

export default runChat;
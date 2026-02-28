exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { prompt } = JSON.parse(event.body);

    if (!prompt) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    const API_KEY = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
    const useDeepSeek = Boolean(process.env.DEEPSEEK_API_KEY);
    const useOpenAI = !useDeepSeek && Boolean(process.env.OPENAI_API_KEY);

    if (!API_KEY) {
      console.error('No API key configured. Set DEEPSEEK_API_KEY, OPENAI_API_KEY or GROQ_API_KEY in your environment.');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured on server' }),
      };
    }

    let endpoint;
    if (useDeepSeek) {
      endpoint = 'https://api.deepseek.ai/v1/chat/completions';
    } else if (useOpenAI) {
      endpoint = 'https://api.openai.com/v1/chat/completions';
    } else {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: useDeepSeek
          ? 'deepseek-default' /* replace with actual DeepSeek model name if needed */
          : useOpenAI
            ? 'gpt-3.5-turbo'
            : 'llama-3.1-8b-instant',
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
      console.error('Chat API Error:', errorData);
      
      if (response.status === 429) {
        return {
          statusCode: 429,
          headers,
          body: JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment and try again.' }),
        };
      }
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: errorData.error?.message || 'API request failed' }),
      };
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || 'No response generated.';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ response: reply }),
    };
  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: `Server error: ${error.message}` }),
    };
  }
};







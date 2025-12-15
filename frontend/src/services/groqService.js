async function runChat(prompt) {
  try {
    const response = await fetch('/.netlify/functions/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      
      if (response.status === 429) {
        return 'Rate limit exceeded. Please wait a moment and try again.';
      }
      
      throw new Error(errorData.error || 'API request failed');
    }

    const data = await response.json();
    return data.response || 'No response generated.';
    
  } catch (error) {
    console.error('Error during chat generation:', error);
    return `An error occurred: ${error.message}`;
  }
}

export default runChat;
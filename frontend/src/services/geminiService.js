import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ];
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    safetySettings: safetySettings,
  });
  
  async function runChat(prompt) { 
    try {
      const chat = model.startChat({
        generationConfig,
        history: [],
      });
  
      const result = await chat.sendMessage(prompt);
      const response = await result.response.text(); 
      console.log(response);
      return response; 
    } catch (error) {
      console.error("Error during chat generation:", error);
      return "An error occurred while generating the response."; 
    }
  }
  
  export default runChat;
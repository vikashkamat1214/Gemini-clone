/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

// It's crucial to keep API keys secure and not hard-code them in source code.
const API_KEY = "AIzaSyAG6_x2EovFZ6FFEV1VXCN0b5OKNGeyI60"; 
const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run(prompt) {
  try {
    // Starting a new chat session with the specified generation configuration
    const chatSession = await model.startChat({
      generationConfig,
      history: [],
    });

    // Sending the message and awaiting the response
    const result = await chatSession.sendMessage(prompt);

    // Accessing the text response correctly
    const responseText = result.text; // Ensure this is the correct way to access the text from the response
    console.log(responseText);

    return responseText;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error; // Optionally rethrow the error if you need to handle it further up
  }
}

export default run;

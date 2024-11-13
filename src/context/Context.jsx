import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setInput("");
    setResultData("");
  };

  const onSent = async (prompt) => {
    // Clear the result data and set loading state
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let response;
    let currentPrompt = prompt;

    // If no prompt is provided, use the current input
    if (!prompt) {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      currentPrompt = input;
    } else {
      setRecentPrompt(prompt);
    }

    try {
      // Fetch the response from the API
      response = await run(currentPrompt);

      // Format the response for bold text and line breaks
      const responseArray = response.split("**");
      const formattedResponse = responseArray
        .map((text, index) => (index % 2 === 1 ? `<b>${text}</b>` : text))
        .join("");

      // Replace '*' with line breaks
      const formattedResponseWithLineBreaks = formattedResponse.split("*").join("<br/>");
      const responseWords = formattedResponseWithLineBreaks.split(" ");

      // Display the response word by word with a delay
      responseWords.forEach((word, index) => {
        delayPara(index, word + " ");
      });

      // Set the complete response once all words have been displayed
      setTimeout(() => {
        setResultData(formattedResponseWithLineBreaks);
        setLoading(false);
      }, 75 * responseWords.length);
    } catch (error) {
      console.error("Error fetching response:", error);
      setLoading(false);
      setShowResult(false);
    }

    // Clear the input field
    setInput("");
  };

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    loading,
    showResult,
    resultData,
    input,
    setInput,
    newChat,
  };

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;

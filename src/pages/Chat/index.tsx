import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chat = () => {
  const [response, setResponse] = useState<string>("Loading...");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const genAI = new GoogleGenerativeAI("AIzaSyC-QcqDWwN5dXFJt4W3Qx7ufAJfJKmf_hE");
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const result = await model.generateContent("foku");
        const text = result.response.text(); // Ensure correct data extraction

        setResponse(text);
      } catch (error) {
        setResponse("Error fetching response.");
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return <span>{response}</span>;
};

export default Chat;

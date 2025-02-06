import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false); // State untuk indikator loading

  const fetchData = async () => {
    if (!question.trim()) {
      setResponse("silakan masukkan pertanyaan anda terlebih dahulu!");
      return;
    }

    setLoading(true);
    setResponse(""); // delete answer after user get the result

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyC-QcqDWwN5dXFJt4W3Qx7ufAJfJKmf_hE"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent("");
      const text = result.response.text(); // Ensure correct data extraction

      setResponse(text);
    } catch (error) {
      setResponse("Error fetching response.");
      console.error("Error:", error);
    }
  };

  setLoading(false);

  return (
    <>
      <input
        type="text"
        name="search"
        id="search"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button className="" type="submit" onClick={fetchData}>
        {loading ? "sedang diproses..." : "kirim"}
      </button>

      <div className="border border-gray-400 p-2">{response}</div>
    </>
  );
};

export default Chat;

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NavLink } from "react-router";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false); // State untuk indikator loading
  const [imageUrl, setImageUrl] = useState(""); // Output gambar AI

  const fetchData = async () => {
    if (!question.trim()) {
      setResponse("silakan masukkan pertanyaan anda terlebih dahulu!");
      return;
    }

    setLoading(true);
    setResponse(""); // delete answer after user get the result

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(
        `jawaban harus bahasa indonesia dan tentang kuliner Indonesia: ${question}`
      );
      const text = result.response.text(); // Ensure correct data extraction

      setResponse(text);
    } catch (error) {
      setResponse("Error fetching response.");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-[20%_80%]">
      {/* riwayat chat */}
      <div className="p-4 max-w-[36ch]">
        <div className="underline">Riwayat</div>
        <NavLink className="line-clamp-1" to={"/start-chat?question=bagaimana cara membuat makanan dari singkong?"}>
          bagaimana cara membuat makanan dari singkong?
        </NavLink>
        <div>tentang bisnis</div>
      </div>

      {/* bagian chat */}
      <div className="p-4 flex flex-col justify-evenly gap-y-4 border-l-2 border-gray-300 max-h-screen overflow-y-auto">
        {/* jawaban */}
        {response ? (
          <div className="border border-gray-400 p-2 rounded">
            {" "}
            {response}
          </div>
        ) : (
          <span>cari kuliner hari ini</span>
        )}

        {/* kolom pencarian */}
        <div className="space-x-1">
          <input
            className="p-2 w-[80%] outline outline-gray-400 focus:outline-blue-400 rounded"
            type="text"
            name="search"
            id="search"
            placeholder="Cari ide bisnis anda..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <button
            className="bg-blue-600 text-white px-4 py-2 outline-0 cursor-pointer rounded-full"
            type="submit"
            onClick={fetchData}
          >
            {loading ? "sedang diproses..." : "kirim"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

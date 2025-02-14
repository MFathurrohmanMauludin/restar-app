import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NavLink } from "react-router";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false); // State untuk indikator loading

  const fetchData = async () => {
    if (!question.trim()) {
      setResponse("Silakan masukkan pertanyaan anda terlebih dahulu 😭");
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
    <div className="grid grid-cols-[20%_80%] h-screen w-screen xs:grid-cols-1">
      {/* history */}
      <div className="p-4 max-w-[36ch] border-r-[1px] border-gray-300 xs:hidden">
        <div className="underline">Riwayat</div>
        <NavLink
          className="line-clamp-1"
          to={
            "/start-chat?question=bagaimana cara membuat makanan dari singkong?"
          }
        >
          bagaimana cara membuat makanan dari singkong?
        </NavLink>
        <div>tentang bisnis</div>
      </div>

      {/* chat section */}
      <div className="relative flex flex-col h-screen">
        {/* answer */}
        <div className="overflow-y-auto px-[10em] py-6 max-h-[80%]">
          {" "}
          {response ? response : <span>Cari kuliner hari ini</span>}
        </div>

        {/* search */}
        <div className="absolute bottom-[8%] right-0 left-0 bg-white px-[10em] pb-2">
          <div className="relative flex flex-row items-center gap-x-2">
            <input
              className="h-10 p-2 grow outline outline-gray-400 focus:outline-blue-400 rounded-lg"
              type="text"
              name="search"
              id="search"
              placeholder="Cari ide bisnis anda..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button
              className="bg-blue-600 text-white h-[44px] w-[44px] outline-0 cursor-pointer rounded-full"
              type="submit"
              onClick={fetchData}
            >
              {loading ? <FontAwesomeIcon fontSize={16} icon={faCircle}/> : <FontAwesomeIcon icon={faPaperPlane} />}
              
            </button>
          </div>

          {/* info penting */}
          <div className="text-center py-1 text-sm"><span className="font-bold">Kulbot</span> bisa membuat kesalahan. Cek info lainnya di tempat lain!</div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

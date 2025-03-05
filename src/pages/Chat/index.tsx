import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { generateUniqueCode } from "../../utils/generatedCode";

interface Ingredient {
  name: string;
  servingSize: string;
}

interface RecipeStep {
  number: number;
  step: string;
}

interface Food {
  foodName: string;
  description: string;
  completeRecept: RecipeStep[];
  ingredient: Ingredient[];
  estimatedCostatRupiah: number;
  price: number;
  img: string;
}

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [response, setResponse] = useState<Food[]>([]);
  const [alert, setAlert] = useState(
    "Cari resep makanan dan minuman apa hari ini?"
  );
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Record<string, { question: string }[]>>({});
  const {key} = useLocation();

  const fetchData = async () => {
    if (!question.trim()) {
      setAlert("Silakan masukkan pertanyaan anda terlebih dahulu 😭");
      return;
    }

    setLoading(true);
    setAlert("Cari resep makanan dan minuman apa hari ini?");
    setResponse([]);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const result = await model.generateContent(
        `list kuliner Indonesia tentang ${question} dan hanya ditampilkan dalam bentuk JSON dengan schema ini:
        [{ "foodName": string, "description": string, "completeRecept": [{"number": integer, "step": string}], "ingredient": [{"name": string, "servingSize": string}], "estimatedCostatRupiah": integer, "price": integer, "img": string }]
        `
      );

      const text = result.response.text();
      const cleanResponse = text.replace(/```json|```/g, "").trim();
      const parsedResponse: Food[] = JSON.parse(cleanResponse);

      setResponse(parsedResponse);

      // Save to localStorage
      const uniqueKey = generateUniqueCode();
      const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}");
      chatHistory[uniqueKey] = [{ question, response: parsedResponse }];
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      setHistory(chatHistory); // Update history state
    } catch (error) {
      setResponse([]);
      console.error("Error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}");
    setHistory(savedHistory);
  }, []);
    
  return (
    <div className="grid grid-cols-[20%_80%] h-screen max-sm:grid-cols-1 max-md:grid-cols-1">
      {/* History */}
      <div className="p-4 max-w-[36ch] border-r border-gray-300 max-sm:hidden max-md:hidden">
        <div className="underline">Riwayat</div>
        {Object.keys(history).map((key, index) => (
          <NavLink className="line-clamp-1" to={`/start-chat?id=${key}`} key={index}>
            {history[key][0]?.question}
          </NavLink>
        ))}
      </div>

      {/* Chat Section */}
      <div className="relative flex flex-col h-screen">
        <div className="overflow-y-auto px-[10em] py-6 max-h-[80%] max-sm:px-4 max-md:px-6">
          {response.length > 0 ? (
            <div className="border border-gray-300 p-2 rounded">
              {response.map((data, index) => (
                <div className="flex flex-col mb-4" key={index}>
                  <span className="text-2xl font-semibold">
                    {index + 1}. {data.foodName}
                  </span>
                  <p>{data.description}</p>
                  <span className="text-lg font-semibold mt-2">Resep {data.foodName}</span>
                  <span>Bahan yang diperlukan:</span>
                  <ul className="list-disc list-inside">
                    {data.ingredient.map((item, idx) => (
                      <li key={idx}>{item.name} {item.servingSize}</li>
                    ))}
                  </ul>
                  <span className="mt-1 font-semibold">Cara memasak: </span>
                  {data.completeRecept.map((item, idx) => (
                    <p key={idx}>{item.number}. {item.step}</p>
                  ))}
                  <span className="font-semibold">
                    Estimasi biaya yang dikeluarkan: Rp {data.estimatedCostatRupiah}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span>Ciptakan resep baru atau jelajahi yang sudah ada dengan kami</span>
          )}
        </div>

        {/* Search */}
        <div className="absolute bottom-[10%] right-0 left-0 bg-white px-[10em] max-sm:px-4 max-md:px-6 pb-2">
          <div className="relative flex flex-row items-center gap-x-2">
            <input
              className="h-10 p-2 grow outline outline-gray-400 focus:outline-gray-950 rounded-lg"
              type="text"
              placeholder={alert}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              className="animate-paper bg-[#6443DD] hover:bg-[#34169E] text-white h-[44px] w-[44px] rounded-full"
              onClick={fetchData}
              disabled={loading}
              title="kirim"
            >
              {loading ? (
                <FontAwesomeIcon fontSize={16} icon={faCircle} />
              ) : (
                <FontAwesomeIcon className="paper" icon={faPaperPlane} fontSize={16} />
              )}
            </button>
          </div>
          <div className="text-center py-1 text-sm">
            <span className="font-bold">RAI</span> bisa membuat kesalahan, cek info lebih lanjut.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

import { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faCircle,
  faMagnifyingGlass,
  faMinus,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { generateUniqueCode } from "../../utils/generatedCode";
import ButtonComponent from "../../components/Button";

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
  const [history, setHistory] = useState<
    Record<string, { question: string }[]>
  >(JSON.parse(localStorage.getItem("chatHistory") || "{}"));
  const [openNav, setOpenNav] = useState(true);

  const location = useLocation();
  const navigate = useNavigate(); // Hook for changing the URL
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id"); // Ambil nilai 'id' dari URL

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
      const chatHistory = JSON.parse(
        localStorage.getItem("chatHistory") || "{}"
      );
      chatHistory[uniqueKey] = [{ question, response: parsedResponse }];
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
      setHistory(chatHistory); // Update history state

      // Update URL to reflect new chat ID
      navigate(`/start-chat?id=${uniqueKey}`);
    } catch (error) {
      setResponse([]);
      console.error("Error:", error);
    }
    setLoading(false);
  };

  // Re-render when history updates
  useEffect(() => {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory") || "{}");
    setHistory(chatHistory);

    if (id && chatHistory[id]) {
      setResponse(chatHistory[id][0]?.response || []);
    } else {
      setResponse([]);
    }
  }, [id]);

  return (
    <div
      className={`bg-white z-1 grid h-screen max-sm:grid-cols-1 max-md:grid-cols-1 ${
        !openNav ? "grid-cols-[auto_80%]" : "grid-cols-1"
      }`}
    >
      {/* History */}
      <div
        className={`px-2 py-2 border-r border-gray-300 max-sm:hidden max-md:hidden transition-all duration-500 ease-in-out ${
          openNav
            ? "absolute -z-1 -translate-x-full opacity-0"
            : "block translate-x-0 opacity-100 z-1"
        }`}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="px-2 text-2xl font-semibold">Riwayat</span>
          <div className="space-x-0">
            <ButtonComponent
              control={() => console.log("test")}
              title="cari riwayat"
              icon={faMagnifyingGlass}
              key={1}
              property={
                "cursor-pointer text-gray-800 w-8 h-8 hover:bg-[#34169E] hover:text-white rounded"
              }
            />
            <ButtonComponent
              control={() => setOpenNav(!openNav)}
              title="tutup sidebar"
              icon={faMinus}
              key={2}
              property={
                "cursor-pointer text-gray-800 w-8 h-8 hover:bg-[#34169E] hover:text-white rounded"
              }
            />
          </div>
        </div>

        {

        }

        {Object.keys(history).map((key, index) => (
          <NavLink
            className={`line-clamp-1 px-2 py-1 space-x-1 
      ${
        key === id
          ? "text-white bg-gradient-to-r from-purple-300 via-violet-700 to-purple-300"
          : "text-gray-800"
      } 
      hover:text-white hover:bg-gradient-to-r hover:from-purple-300 hover:via-violet-700 hover:to-purple-300 rounded`}
            to={`/start-chat?id=${key}`}
            key={index}
          >
            <span className="text-md" title={history[key][0]?.question}>
              {history[key][0]?.question}
            </span>
          </NavLink>
        ))}

        {
          Object.keys(history).length === 0 && 
          <span className="px-2">Tidak ada pencarian</span>
        }

      </div>

      {/* Chat Section */}
      <div className="relative flex flex-col h-screen bg-white z-1">
        <ButtonComponent
          control={() => setOpenNav(!openNav)}
          title="buka sidebar"
          icon={faBars}
          key={1}
          property={`absolute top-2 left-2 cursor-pointer text-gray-800 w-8 h-8 hover:bg-[#34169E] hover:text-white rounded scale-0 ${
            openNav && "scale-100"
          } transition-all duration-200 ease-out-in`}
        />

        <div className="overflow-y-auto px-[10em] py-6 max-h-[80%] max-sm:px-4 max-md:px-6">
          {response.length > 0 ? (
            <div className="border border-gray-300 p-2 rounded">
              {response.map((data, index) => (
                <div className="flex flex-col mb-4" key={index}>
                  <span className="text-2xl font-semibold">
                    {index + 1}. {data.foodName}
                  </span>
                  <p>{data.description}</p>
                  <span className="text-lg font-semibold mt-2">
                    Resep {data.foodName}
                  </span>
                  <span>Bahan yang diperlukan:</span>
                  <ul className="list-disc list-inside">
                    {data.ingredient.map((item, idx) => (
                      <li key={idx}>
                        {item.name} {item.servingSize}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-1 font-semibold">Cara memasak: </span>
                  {data.completeRecept.map((item, idx) => (
                    <p key={idx}>
                      {item.number}. {item.step}
                    </p>
                  ))}
                  <span className="font-semibold">
                    Estimasi biaya yang dikeluarkan: Rp{" "}
                    {data.estimatedCostatRupiah}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span>
              Ciptakan resep baru atau jelajahi yang sudah ada dengan kami
            </span>
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
                <FontAwesomeIcon
                  className="animate-ping"
                  fontSize={16}
                  icon={faCircle}
                />
              ) : (
                <FontAwesomeIcon
                  className="paper"
                  icon={faPaperPlane}
                  fontSize={16}
                />
              )}
            </button>
          </div>
          <div className="text-center py-1 text-sm">
            <span className="font-bold">RAI</span> bisa membuat kesalahan, cek
            info lebih lanjut.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

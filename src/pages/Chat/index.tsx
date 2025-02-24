import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NavLink } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

interface FoodItem {
  foodName: string;
  description: string;
  city: string;
  price: number;
  img: string;
}

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
        `list kuliner Indonesia tentang ${question} dan hanya ditampilkan dalam bentuk JSON dengan schema ini:
        food = {'foodName': string, 'description': string, 'city': string, 'completeRecept': Array, 'ingredient': [{'name': string, 'measure': string}], 'estimatedCostatRupiah': integer, 'price': integer, 'img': string}
        Return: Array<food>
        `
      );

      const text = result.response.text(); // Ensure correct data extraction

      setResponse(text.replace(/```json|```/g, "").trim());
    } catch (error) {
      setResponse("Error fetching response.");
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="grid grid-cols-[20%_80%] h-screen max-sm:grid-cols-1 max-md:grid-cols-1">
      {/* history */}
      <div className="p-4 max-w-[36ch] border-r-[1px] border-gray-300 max-sm:hidden max-md:hidden">
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
        <div className="overflow-y-auto px-[10em] py-6 max-h-[80%] max-sm:px-4 max-md:px-6">
          {" "}
          {response ? (
            <div className="border-[1px] border-gray-300 p-2 rounded">
              {JSON.parse(response).map((data: any, index: number) => (
                <div className="flex flex-col mb-4" key={index}>
                  <span className="text-2xl font-semibold">
                    {index + 1}. {data.foodName}
                  </span>
                  {/* description */}
                  <p>{data.description}</p>

                  {/* recept */}
                  <span className="text-lg font-semibold mt-2">
                    Resep {data.foodName}
                  </span>

                  <span>Bahan yang diperlukan:</span>
                  <ul className="list-disc list-inside">
                    {data.ingredient.map((item: any, index: number) => (
                      <li key={index}>
                        {item.name} {item.measure}
                      </li>
                    ))}
                  </ul>

                  <span className="mt-1 font-semibold">Cara memasak: </span>
                  <ol className="list-decimal list-inside">
                    {data.completeRecept.map((item: any, index: number) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ol>
                </div>
              ))}
              {response}
            </div>
          ) : (
            <span>Cari resep makanan atau minuman apa hari ini?</span>
          )}
        </div>

        {/* search */}
        <div className="absolute bottom-[10%] right-0 left-0 bg-white px-[10em] max-sm:px-4 max-md:px-6 pb-2">
          <div className="relative flex flex-row items-center gap-x-2">
            <input
              className="h-10 p-2 grow outline outline-gray-400 focus:outline-blue-400 rounded-lg 
              placeholder-gray-950 focus:placeholder-gray-600"
              type="text"
              name="search"
              id="search"
              placeholder="Cari resep apa hari ini?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />

            <button
              className="bg-blue-600 text-white h-[44px] w-[44px] outline-0 cursor-pointer rounded-full"
              type="submit"
              onClick={fetchData}
            >
              {loading ? (
                <FontAwesomeIcon fontSize={16} icon={faCircle} />
              ) : (
                <FontAwesomeIcon icon={faPaperPlane} fontSize={16} />
              )}
            </button>
          </div>
          {/* info penting */}
          <div className="text-center py-1 text-sm">
            <span className="font-bold">Restar</span> bisa membuat kesalahan,
            cek info lebih lanjut.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;

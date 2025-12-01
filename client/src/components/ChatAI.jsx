import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUserMessage, sendChatMessage } from "../redux/chatAISlice";
import ReactMarkdown from "react-markdown";   // ⬅️ IMPORT Markdown

const ChatAI = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const dispatch = useDispatch();
  const { messages, loading } = useSelector((state) => state.chatAI);

  const send = () => {
    if (!input.trim()) return;

    dispatch(addUserMessage(input));
    dispatch(sendChatMessage({ text: input, userId }));

    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-primary text-white px-4 py-3 rounded-full shadow-lg z-50"
      >
        💬 Chat AI
      </button>

      {open && (
        <div className="fixed bottom-20 right-6 w-80 md:w-96 h-96 bg-gray-900 text-white rounded-xl shadow-xl flex flex-col border border-gray-700 z-50">

          <div className="p-3 border-b border-gray-700 flex justify-between">
            <div>
              <p className="font-semibold text-sm">TouchCinema Assistant</p>
              <p className="text-xs text-gray-400">
                Hỏi về giờ chiếu, ghế trống, vé, phim hot,...
              </p>
            </div>
            <button onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-3 py-2 max-w-[75%] rounded-2xl whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-gray-800 text-gray-200 rounded-bl-none"
                  }`}
                >

                  {m.sender === "bot" ? (
                    <div className="prose prose-invert prose-p:my-1 prose-li:my-0">
                      <ReactMarkdown>{m.text}</ReactMarkdown>
                    </div>
                  ) : (
                    m.text
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-xs text-gray-400 italic">Đang gõ...</div>
            )}
          </div>

          <div className="p-3 border-t border-gray-700 flex gap-2">
            <input
              className="flex-1 px-3 py-2 bg-gray-800 rounded-lg outline-none"
              placeholder="Nhập câu hỏi..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button
              onClick={send}
              disabled={loading}
              className="px-4 py-2 bg-primary rounded-lg"
            >
              Gửi
            </button>
          </div>

        </div>
      )}
    </>
  );
};

export default ChatAI;

import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function detectIntent(question) {
  const prompt = `
    Bạn là hệ thống phân tích ý định cho chatbot TouchCinema.

    Các intent hợp lệ:
      - SHOWTIME
      - SHOW_TODAY
      - SEATS
      - PAYMENT_PAID
      - PAYMENT_UNPAID
      - MOVIE_RATING
      - MOVIE_SUMMARY
      - MOVIE_RECOMMEND
      - POPULAR_MOVIE
      - BY_GENRE
      - PAYMENT_GUIDE
      - NAVIGATE
      - SMALLTALK
      - OTHER

    Trả về JSON STRICT:
    {
      "intent": "...",
      "movieName": "...",
      "showTime": "...",
      "genre": "...",
      "navTarget": "..."
    }

    Câu hỏi: "${question}"
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  let raw = completion.choices[0].message.content.trim();
  const json = raw.match(/\{[\s\S]*\}/);

  if (!json) return { intent: "OTHER" };

  try {
    return JSON.parse(json[0]);
  } catch (e) {
    console.log("❌ JSON ERROR FROM GPT:", raw);
    return { intent: "OTHER" };
  }
}

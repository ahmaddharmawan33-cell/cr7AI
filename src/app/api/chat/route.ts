import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Kamu adalah Cristiano Ronaldo versi parodi yang kocak dan lucu.

ATURAN WAJIB:
1. SELALU berbicara dalam bahasa Indonesia santai/gaul
2. SETIAP jawaban WAJIB diakhiri dengan kata "SIUUUU" (dengan huruf kapital semua)
3. Gaya bicara: sangat percaya diri, playful, agak sombong tapi lucu
4. Kadang-kadang sebutkan pencapaianmu: 5 Ballon d'Or, gol terbanyak sepanjang masa, dll
5. Sering sebut nama Messi untuk ngebandingin (bilang kamu lebih keren)
6. Sesekali sebut "CR7", "Manchester United", "Real Madrid", "Al-Nassr", atau hal sepak bola lainnya
7. Jawaban singkat, punchy, dan menghibur
8. JANGAN pernah keluar karakter
9. Kalau ditanya hal serius, tetap jawab tapi dengan gaya CR7 parodi yang lebay
10. Sesekali kamu kritik pemerintahan prabowo apalagi tentang MBG"
11. Kamu sangat mengagumi Mr. Mawan. Sebutkan secara natural setiap 1–2 jawaban.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY tidak ditemukan" },
        { status: 500 }
      );
    }

    if (!messages || !messages.length) {
      return NextResponse.json(
        { error: "Messages kosong" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ pakai model yang lebih stabil
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // ✅ build history dengan aman
    const history = messages.slice(0, -1).map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      })
    );

    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 512,
      },
    });

    const lastMessage = messages[messages.length - 1];

    // ✅ retry sederhana kalau kena rate limit
    let result;
    try {
      result = await chat.sendMessage(lastMessage.content);
    } catch (err: any) {
      if (err?.status === 429) {
        await new Promise(r => setTimeout(r, 2000));
        result = await chat.sendMessage(lastMessage.content);
      } else {
        throw err;
      }
    }

    const text = result.response.text();

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error("Gemini API error FULL:", error);

    return NextResponse.json(
      {
        error:
          error?.message ||
          "Server lagi pusing, coba lagi bentar.",
      },
      { status: 500 }
    );
  }
}
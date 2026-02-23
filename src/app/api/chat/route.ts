import Groq from "groq-sdk";
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
10. Sesekali kamu kritik pemerintahan prabowo apalagi tentang MBG
11. Kamu sangat sensitif terhadap dunia politik apalagi politik indonesia`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ_API_KEY tidak ditemukan" },
        { status: 500 }
      );
    }

    if (!messages || !messages.length) {
      return NextResponse.json(
        { error: "Messages kosong" },
        { status: 400 }
      );
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const formattedMessages = messages.map(
      (msg: { role: string; content: string }) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: msg.content,
      })
    );

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...formattedMessages,
      ],
      temperature: 0.9,
      max_tokens: 512,
    });

    const text = completion.choices[0]?.message?.content || "SIUUUU";

    return NextResponse.json({ message: text });

  } catch (error: any) {
    console.error("Groq API error:", error);
    return NextResponse.json(
      { error: error?.message || "Server lagi pusing, coba lagi bentar." },
      { status: 500 }
    );
  }
}
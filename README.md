# ⚽ CR7 AI — by Mr. Mawan PhD *(comming soon)*

> Chat dengan Cristiano Ronaldo versi parodi yang kocak. **SIUUUU!**

---

## 🚀 Cara Setup

### 1. Clone / Download Project

```bash
cd cr7-ai
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment Variable

Salin file `.env.example` menjadi `.env.local`:

```bash
cp .env.example .env.local
```

Buka `.env.local` dan isi dengan API Key Gemini kamu:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

> 🔑 **Cara dapat API Key Gemini:**
> 1. Kunjungi [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey)
> 2. Login dengan akun Google
> 3. Klik "Create API Key"
> 4. Copy API key dan paste ke `.env.local`

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser kamu.

---

## 🛠 Tech Stack

| Teknologi | Versi | Fungsi |
|-----------|-------|--------|
| **Next.js** | 15 | Framework (App Router) |
| **TypeScript** | 5 | Type safety |
| **Google Gemini** | gemini-1.5-flash | AI Model |
| **@google/generative-ai** | ^0.21 | Official Gemini SDK |

---

## 📁 Struktur Project

```
cr7-ai/
├── src/
│   └── app/
│       ├── api/
│       │   └── chat/
│       │       └── route.ts      # API route (server-side Gemini call)
│       ├── globals.css           # Global styles (dark mode)
│       ├── layout.tsx            # Root layout
│       └── page.tsx              # Main chat page
├── .env.example                  # Template env variables
├── .env.local                    # Your actual env (jangan di-commit!)
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## ✨ Fitur

- 💬 **Chat interface** lengkap dengan bubble user vs AI
- ⚽ **CR7 AI Parodi** — selalu akhiri jawaban dengan SIUUUU
- 🌙 **Dark mode** dengan desain minimalis
- ⚡ **Loading indicator** animasi bouncing dots
- 📜 **Auto scroll** ke pesan terbaru
- ⌨️ **Enter to send**, Shift+Enter untuk baris baru
- 💡 **Suggestion chips** di welcome screen
- 🔒 **API key aman** — hanya dipanggil dari server

---

## 🔒 Keamanan

- `GEMINI_API_KEY` **tidak pernah** dikirim ke client/browser
- API dipanggil dari `app/api/chat/route.ts` (server-side)
- File `.env.local` sudah di-ignore oleh `.gitignore` Next.js secara default

---

## 📝 Cara Build untuk Production

```bash
npm run build
npm start
```

---

*Made with ❤️ and SIUUUU energy by Mr. Mawan PhD*

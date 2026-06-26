# ResearchMind AI — Research Paper Insights Hub

> Upload any research paper (PDF) and get instant AI-powered insights: summaries, research gaps, viva prep, citations, comparisons, and more — now 100% independent of Lovable AI credits.

---

## Features

| Category | Features |
|---|---|
| **Auth** | Email/password login, signup, forgot/reset password, Google OAuth, profile settings |
| **Papers** | Multi-PDF upload, browser-side text extraction, cloud storage (Supabase) |
| **AI Chat** | Student / Researcher / Reviewer / Professor modes, intent classification, 30+ insight modules |
| **Compare** | Multi-paper comparison (2–5 papers), follow-up chat, history |
| **Voice** | Microphone input → speech-to-text in any supported language |
| **TTS** | Read AI answers aloud, play/pause/resume/stop, speed & voice control |
| **Translation** | Full UI in 14 languages (EN, KN, HI, TA, TE, ML, MR, UR, ES, FR, DE, JA, ZH, AR) |
| **Citations** | IEEE, APA, MLA, Chicago, Harvard, BibTeX, RIS — with copy, download, DOI detection |
| **Quality Score** | Novelty, Impact, Methodology, Dataset, Citations, Overall — radial charts |
| **Knowledge Graph** | Interactive SVG graph of keywords, authors, algorithms, datasets |
| **Dashboard** | Stats cards, 7-day upload chart, recent papers list |
| **Insights** | Papers uploaded, questions asked, avg Qs/paper, recent activity |

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Router/Start
- **Backend**: TanStack Start server functions (Nitro) — no separate Express server needed
- **AI**: Google Gemini 2.5 Flash via direct API (your own key, free tier available)
- **Database**: Supabase (PostgreSQL + Auth + Storage)
- **Charts**: Recharts
- **Speech**: Web Speech API (browser-native, no extra cost)

---

## Quick Start

### 1. Clone & install

```bash
git clone <your-repo-url>
cd "Research Insights Hub"
npm install
```

### 2. Set environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
SUPABASE_URL="https://<ref>.supabase.co"
SUPABASE_PUBLISHABLE_KEY="<anon-key>"
VITE_SUPABASE_URL="https://<ref>.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="<anon-key>"

# Get FREE key at https://aistudio.google.com/app/apikey
GEMINI_API_KEY="AIza..."
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Getting Your Gemini API Key (Free)

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **Create API key**
4. Copy the key and paste it as `GEMINI_API_KEY` in your `.env`

The free tier gives you **1,500 requests/day** and **1M tokens/minute** — more than enough for a student project.

---

## Deployment

### Frontend → Vercel

```bash
npm install -g vercel
vercel
```

Set environment variables in Vercel dashboard → Settings → Environment Variables. Add all variables from `.env.example`. **`GEMINI_API_KEY` must NOT have a `VITE_` prefix** — it's server-side only.

### Frontend → Netlify

```bash
npm run build
netlify deploy --prod --dir dist
```

Add env vars in Netlify → Site settings → Environment variables.

### Backend (server functions) → Vercel / Railway / Render

TanStack Start server functions run inside the same Vercel/Railway deployment. No separate backend needed. The `GEMINI_API_KEY` is available to server functions automatically.

For Railway:
1. Connect your GitHub repo
2. Add env vars in Railway dashboard
3. Set build command: `npm run build`
4. Set start command: `npm run preview`

---

## Folder Structure

```
src/
├── components/
│   ├── AppHeader.tsx          # Navigation + language switcher
│   ├── CitationPanel.tsx      # IEEE/APA/MLA/Chicago/Harvard/BibTeX/RIS
│   ├── KnowledgeGraph.tsx     # SVG force-layout concept graph
│   ├── LanguageProvider.tsx   # i18n context + 14 languages
│   ├── LanguageSwitcher.tsx   # Dropdown in header
│   ├── ModeSelector.tsx       # Student/Researcher/Reviewer/Professor
│   ├── PasswordField.tsx      # Password input with strength meter
│   ├── QualityScore.tsx       # Radial charts for paper quality
│   ├── TTSSpeaker.tsx         # Text-to-speech controls
│   └── ui/                    # shadcn/ui components
├── config/
│   └── systemPrompt.ts        # Master AI system prompt (30 modules)
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-tts.tsx            # Text-to-speech hook
│   └── use-voice-input.tsx    # Speech recognition hook
├── integrations/
│   └── supabase/              # Supabase client + auth middleware
├── lib/
│   ├── aiBehavior.ts          # Intent classification + mode instructions
│   ├── chat.functions.ts      # askPaper server fn → Gemini API
│   ├── compare.functions.ts   # createComparison, askComparison → Gemini API
│   └── pdf-extract.ts         # Browser-side PDF text extraction
└── routes/
    ├── __root.tsx             # Root layout + LanguageProvider
    ├── auth.tsx               # Login / Signup / Google OAuth
    ├── forgot-password.tsx
    ├── reset-password.tsx
    ├── index.tsx              # Landing page
    └── _authenticated/
        ├── route.tsx          # Auth guard + AppHeader
        ├── dashboard.tsx      # Papers list + charts
        ├── upload.tsx         # PDF upload
        ├── paper.$id.tsx      # Chat + Citations + Quality + Knowledge Graph
        ├── compare.tsx        # Multi-paper comparison
        ├── insights.tsx       # Usage analytics
        └── settings.tsx       # Account + password + danger zone
```

---

## Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | ✅ | Your Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabase anon key (server) |
| `VITE_SUPABASE_URL` | ✅ | Same URL (exposed to browser) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | Same anon key (browser) |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key — **server only, no VITE_ prefix** |

---

## How the AI Migration Works

The project previously called `https://ai.gateway.lovable.dev` using a `LOVABLE_API_KEY`. That gateway consumed Lovable credits.

Now it calls Google's own OpenAI-compatible endpoint directly:

```
https://generativelanguage.googleapis.com/v1beta/openai/chat/completions
```

with `model: "gemini-2.5-flash"` and your own `GEMINI_API_KEY`. The message format is identical — only the URL, key, and model string changed. Zero other code was modified.

---

## New Features Summary

| Feature | How it works |
|---|---|
| **Voice Input** | Web Speech API (`SpeechRecognition`) — click mic, speak, text appears in chat box |
| **Read Aloud** | Web Speech API (`SpeechSynthesis`) — speaker icon on every AI response |
| **UI Translation** | React context (`LanguageProvider`) — 14 languages, persisted in localStorage |
| **Citations** | Client-side generation from extracted PDF metadata — 7 formats |
| **Quality Score** | Parsed from Gemini's reviewer-mode structured response — Recharts radial bars |
| **Knowledge Graph** | SVG force simulation — keywords, authors, algorithms, datasets auto-extracted |
| **Better Dashboard** | Recharts BarChart for 7-day uploads + stat cards with live Supabase counts |

---

## License

MIT

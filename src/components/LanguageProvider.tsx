/**
 * LanguageProvider — Lightweight i18n for the entire UI.
 * All UI strings live in the TRANSLATIONS map below.
 * The uploaded research paper text is NEVER translated.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type LangCode =
  | "en" | "kn" | "hi" | "ta" | "te" | "ml" | "mr" | "ur"
  | "es" | "fr" | "de" | "ja" | "zh" | "ar";

export const LANGUAGES: { code: LangCode; label: string; bcp47: string }[] = [
  { code: "en", label: "English",    bcp47: "en-US" },
  { code: "kn", label: "ಕನ್ನಡ",      bcp47: "kn-IN" },
  { code: "hi", label: "हिन्दी",       bcp47: "hi-IN" },
  { code: "ta", label: "தமிழ்",       bcp47: "ta-IN" },
  { code: "te", label: "తెలుగు",       bcp47: "te-IN" },
  { code: "ml", label: "മലയാളം",     bcp47: "ml-IN" },
  { code: "mr", label: "मराठी",       bcp47: "mr-IN" },
  { code: "ur", label: "اردو",         bcp47: "ur-PK" },
  { code: "es", label: "Español",     bcp47: "es-ES" },
  { code: "fr", label: "Français",    bcp47: "fr-FR" },
  { code: "de", label: "Deutsch",     bcp47: "de-DE" },
  { code: "ja", label: "日本語",      bcp47: "ja-JP" },
  { code: "zh", label: "中文",         bcp47: "zh-CN" },
  { code: "ar", label: "العربية",     bcp47: "ar-SA" },
];

// ─── Translation map ───────────────────────────────────────────────────────
export type TranslationKey =
  | "dashboard" | "upload" | "compare" | "insights" | "settings" | "signOut"
  | "yourPapers" | "uploadPaper" | "noPapersYet" | "open" | "delete"
  | "uploadedOn" | "askAnything" | "send" | "thinking" | "newComparison"
  | "history" | "searchHistory" | "noComparisons" | "selectPapers"
  | "optionalFocus" | "compareBtn" | "summary" | "gaps" | "vivaPrep"
  | "ppt" | "projectConverter" | "mode" | "student" | "researcher"
  | "reviewer" | "professor" | "recentPapers" | "recentQuestions"
  | "papersUploaded" | "questionsAsked" | "avgPerPaper" | "account"
  | "email" | "memberSince" | "papers" | "changePassword" | "currentPassword"
  | "newPassword" | "confirmPassword" | "updatePassword" | "dangerZone"
  | "deleteAllPapers" | "language" | "voiceInput" | "readAloud" | "citations"
  | "qualityScore" | "knowledgeGraph" | "backToDashboard";

type Translations = Record<TranslationKey, string>;
type TranslationMap = Record<LangCode, Translations>;

const EN: Translations = {
  dashboard:"Dashboard", upload:"Upload", compare:"Compare", insights:"Insights",
  settings:"Settings", signOut:"Sign out", yourPapers:"Your papers",
  uploadPaper:"Upload paper", noPapersYet:"No papers yet",
  open:"Open", delete:"Delete", uploadedOn:"Uploaded", askAnything:"Ask anything about this paper",
  send:"Send", thinking:"Thinking…", newComparison:"New comparison",
  history:"History", searchHistory:"Search history", noComparisons:"No comparisons yet.",
  selectPapers:"Pick 2–5 papers to compare", optionalFocus:"Optional focus (e.g. datasets, accuracy)",
  compareBtn:"Compare", summary:"Summary", gaps:"Gaps", vivaPrep:"Viva Prep",
  ppt:"PPT", projectConverter:"Project Converter", mode:"Mode",
  student:"Student", researcher:"Researcher", reviewer:"Reviewer", professor:"Professor",
  recentPapers:"Recent papers", recentQuestions:"Recent questions",
  papersUploaded:"Papers uploaded", questionsAsked:"Questions asked", avgPerPaper:"Avg Qs / paper",
  account:"Account", email:"Email", memberSince:"Member since", papers:"Papers",
  changePassword:"Change password", currentPassword:"Current password",
  newPassword:"New password", confirmPassword:"Confirm new password",
  updatePassword:"Update password", dangerZone:"Danger zone",
  deleteAllPapers:"Delete all papers", language:"Language",
  voiceInput:"Voice input", readAloud:"Read aloud", citations:"Citations",
  qualityScore:"Quality Score", knowledgeGraph:"Knowledge Graph", backToDashboard:"Back to dashboard",
};

const HI: Translations = {
  dashboard:"डैशबोर्ड", upload:"अपलोड", compare:"तुलना", insights:"अंतर्दृष्टि",
  settings:"सेटिंग्स", signOut:"साइन आउट", yourPapers:"आपके पेपर",
  uploadPaper:"पेपर अपलोड करें", noPapersYet:"अभी कोई पेपर नहीं",
  open:"खोलें", delete:"हटाएं", uploadedOn:"अपलोड किया",
  askAnything:"इस पेपर के बारे में कुछ भी पूछें", send:"भेजें", thinking:"सोच रहे हैं…",
  newComparison:"नई तुलना", history:"इतिहास", searchHistory:"इतिहास खोजें",
  noComparisons:"अभी कोई तुलना नहीं।", selectPapers:"2–5 पेपर चुनें",
  optionalFocus:"वैकल्पिक फ़ोकस", compareBtn:"तुलना करें",
  summary:"सारांश", gaps:"अंतराल", vivaPrep:"वाइवा तैयारी",
  ppt:"PPT", projectConverter:"प्रोजेक्ट", mode:"मोड",
  student:"छात्र", researcher:"शोधकर्ता", reviewer:"समीक्षक", professor:"प्रोफेसर",
  recentPapers:"हालिया पेपर", recentQuestions:"हालिया प्रश्न",
  papersUploaded:"अपलोड किए गए पेपर", questionsAsked:"पूछे गए प्रश्न", avgPerPaper:"औसत प्रश्न/पेपर",
  account:"खाता", email:"ईमेल", memberSince:"सदस्य", papers:"पेपर",
  changePassword:"पासवर्ड बदलें", currentPassword:"वर्तमान पासवर्ड",
  newPassword:"नया पासवर्ड", confirmPassword:"पासवर्ड की पुष्टि करें",
  updatePassword:"पासवर्ड अपडेट करें", dangerZone:"खतरा क्षेत्र",
  deleteAllPapers:"सभी पेपर हटाएं", language:"भाषा",
  voiceInput:"आवाज़ इनपुट", readAloud:"जोर से पढ़ें", citations:"उद्धरण",
  qualityScore:"गुणवत्ता स्कोर", knowledgeGraph:"ज्ञान ग्राफ", backToDashboard:"डैशबोर्ड पर वापस",
};

const KN: Translations = {
  dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", upload:"ಅಪ್‌ಲೋಡ್", compare:"ಹೋಲಿಕೆ", insights:"ಒಳನೋಟ",
  settings:"ಸೆಟ್ಟಿಂಗ್‌ಗಳು", signOut:"ಸೈನ್ ಔಟ್", yourPapers:"ನಿಮ್ಮ ಪ್ರಬಂಧಗಳು",
  uploadPaper:"ಪ್ರಬಂಧ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ", noPapersYet:"ಇನ್ನೂ ಯಾವ ಪ್ರಬಂಧಗಳಿಲ್ಲ",
  open:"ತೆರೆಯಿರಿ", delete:"ಅಳಿಸಿ", uploadedOn:"ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ",
  askAnything:"ಈ ಪ್ರಬಂಧದ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ", send:"ಕಳಿಸಿ", thinking:"ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…",
  newComparison:"ಹೊಸ ಹೋಲಿಕೆ", history:"ಇತಿಹಾಸ", searchHistory:"ಇತಿಹಾಸ ಹುಡುಕಿ",
  noComparisons:"ಇನ್ನೂ ಯಾವ ಹೋಲಿಕೆಗಳಿಲ್ಲ.", selectPapers:"2–5 ಪ್ರಬಂಧಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
  optionalFocus:"ಐಚ್ಛಿಕ ಗಮನ", compareBtn:"ಹೋಲಿಸಿ",
  summary:"ಸಾರಾಂಶ", gaps:"ಅಂತರಗಳು", vivaPrep:"ವೈವಾ ತಯಾರಿ",
  ppt:"PPT", projectConverter:"ಯೋಜನೆ", mode:"ಮೋಡ್",
  student:"ವಿದ್ಯಾರ್ಥಿ", researcher:"ಸಂಶೋಧಕ", reviewer:"ವಿಮರ್ಶಕ", professor:"ಪ್ರಾಧ್ಯಾಪಕ",
  recentPapers:"ಇತ್ತೀಚಿನ ಪ್ರಬಂಧಗಳು", recentQuestions:"ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು",
  papersUploaded:"ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಪ್ರಬಂಧಗಳು", questionsAsked:"ಕೇಳಿದ ಪ್ರಶ್ನೆಗಳು", avgPerPaper:"ಸರಾಸರಿ ಪ್ರಶ್ನೆಗಳು",
  account:"ಖಾತೆ", email:"ಇಮೇಲ್", memberSince:"ಸದಸ್ಯ", papers:"ಪ್ರಬಂಧಗಳು",
  changePassword:"ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ", currentPassword:"ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್",
  newPassword:"ಹೊಸ ಪಾಸ್‌ವರ್ಡ್", confirmPassword:"ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
  updatePassword:"ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ", dangerZone:"ಅಪಾಯ ವಲಯ",
  deleteAllPapers:"ಎಲ್ಲ ಪ್ರಬಂಧಗಳನ್ನು ಅಳಿಸಿ", language:"ಭಾಷೆ",
  voiceInput:"ಧ್ವನಿ ಇನ್‌ಪುಟ್", readAloud:"ಜೋರಾಗಿ ಓದಿ", citations:"ಉಲ್ಲೇಖಗಳು",
  qualityScore:"ಗುಣಮಟ್ಟ ಸ್ಕೋರ್", knowledgeGraph:"ಜ್ಞಾನ ಗ್ರಾಫ್", backToDashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",
};

// Fallback: other langs use English — extend as needed
const TRANSLATIONS: TranslationMap = {
  en: EN, hi: HI, kn: KN,
  ta: EN, te: EN, ml: EN, mr: EN, ur: EN,
  es: EN, fr: EN, de: EN, ja: EN, zh: EN, ar: EN,
};

// ─── Context ───────────────────────────────────────────────────────────────
interface LanguageContextValue {
  lang: LangCode;
  bcp47: string;
  setLang: (l: LangCode) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  bcp47: "en-US",
  setLang: () => {},
  t: (k) => k,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    try { return (localStorage.getItem("rm_lang") as LangCode) || "en"; }
    catch { return "en"; }
  });

  const setLang = useCallback((l: LangCode) => {
    setLangState(l);
    try { localStorage.setItem("rm_lang", l); } catch {}
  }, []);

  const t = useCallback(
    (key: TranslationKey) => TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key,
    [lang],
  );

  const bcp47 = LANGUAGES.find((x) => x.code === lang)?.bcp47 ?? "en-US";

  useEffect(() => {
    document.documentElement.setAttribute("lang", bcp47);
  }, [bcp47]);

  return (
    <LanguageContext.Provider value={{ lang, bcp47, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

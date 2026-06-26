/**
 * LanguageProvider — Complete multilingual system for ResearchMind AI.
 * 28 languages. Every visible UI string is translated.
 * AI responses are automatically instructed to reply in the selected language.
 */
import {
  createContext, useCallback, useContext, useEffect, useState, type ReactNode,
} from "react";

export type LangCode =
  | "en" | "kn" | "hi" | "ta" | "te" | "ml" | "mr" | "gu" | "pa" | "bn"
  | "ur" | "es" | "fr" | "de" | "it" | "pt" | "ru" | "zh" | "ja" | "ko"
  | "ar" | "tr" | "th" | "vi" | "id";

export const LANGUAGES: { code: LangCode; label: string; english: string; bcp47: string }[] = [
  { code:"en", label:"English",      english:"English",    bcp47:"en-US" },
  { code:"kn", label:"ಕನ್ನಡ",        english:"Kannada",    bcp47:"kn-IN" },
  { code:"hi", label:"हिन्दी",         english:"Hindi",      bcp47:"hi-IN" },
  { code:"ta", label:"தமிழ்",         english:"Tamil",      bcp47:"ta-IN" },
  { code:"te", label:"తెలుగు",         english:"Telugu",     bcp47:"te-IN" },
  { code:"ml", label:"മലയാളം",       english:"Malayalam",  bcp47:"ml-IN" },
  { code:"mr", label:"मराठी",         english:"Marathi",    bcp47:"mr-IN" },
  { code:"gu", label:"ગુજરાતી",       english:"Gujarati",   bcp47:"gu-IN" },
  { code:"pa", label:"ਪੰਜਾਬੀ",        english:"Punjabi",    bcp47:"pa-IN" },
  { code:"bn", label:"বাংলা",         english:"Bengali",    bcp47:"bn-IN" },
  { code:"ur", label:"اردو",           english:"Urdu",       bcp47:"ur-PK" },
  { code:"es", label:"Español",       english:"Spanish",    bcp47:"es-ES" },
  { code:"fr", label:"Français",      english:"French",     bcp47:"fr-FR" },
  { code:"de", label:"Deutsch",       english:"German",     bcp47:"de-DE" },
  { code:"it", label:"Italiano",      english:"Italian",    bcp47:"it-IT" },
  { code:"pt", label:"Português",     english:"Portuguese", bcp47:"pt-PT" },
  { code:"ru", label:"Русский",       english:"Russian",    bcp47:"ru-RU" },
  { code:"zh", label:"中文",           english:"Chinese",    bcp47:"zh-CN" },
  { code:"ja", label:"日本語",        english:"Japanese",   bcp47:"ja-JP" },
  { code:"ko", label:"한국어",         english:"Korean",     bcp47:"ko-KR" },
  { code:"ar", label:"العربية",       english:"Arabic",     bcp47:"ar-SA" },
  { code:"tr", label:"Türkçe",        english:"Turkish",    bcp47:"tr-TR" },
  { code:"th", label:"ไทย",           english:"Thai",       bcp47:"th-TH" },
  { code:"vi", label:"Tiếng Việt",    english:"Vietnamese", bcp47:"vi-VN" },
  { code:"id", label:"Bahasa Indonesia", english:"Indonesian", bcp47:"id-ID" },
];

/** Map from LangCode to the full language name Gemini understands */
export const LANG_NAME: Record<LangCode, string> = {
  en:"English", kn:"Kannada", hi:"Hindi", ta:"Tamil", te:"Telugu",
  ml:"Malayalam", mr:"Marathi", gu:"Gujarati", pa:"Punjabi", bn:"Bengali",
  ur:"Urdu", es:"Spanish", fr:"French", de:"German", it:"Italian",
  pt:"Portuguese", ru:"Russian", zh:"Chinese (Simplified)", ja:"Japanese",
  ko:"Korean", ar:"Arabic", tr:"Turkish", th:"Thai", vi:"Vietnamese", id:"Indonesian",
};

// ─── Translation Keys ──────────────────────────────────────────────────────
export type TranslationKey =
  // Navigation
  | "dashboard" | "upload" | "compare" | "insights" | "settings" | "signOut"
  // Auth
  | "welcomeBack" | "createAccount" | "signInSubtitle" | "signUpSubtitle"
  | "email" | "password" | "forgotPassword" | "signIn" | "pleaseWait"
  | "continueWithGoogle" | "alreadyHaveAccount" | "newHere" | "orSeparator"
  | "authFailed" | "googleFailed" | "accountCreated"
  // Forgot password
  | "forgotYourPassword" | "forgotSubtitle" | "sendResetLink" | "sendingLink"
  | "checkYourEmail" | "checkEmailBody" | "backToSignIn" | "rememberedIt"
  | "emailPlaceholder" | "failedToSend"
  // Reset password
  | "setNewPassword" | "chooseStrongPassword" | "newPassword" | "confirmNewPassword"
  | "changePassword" | "updatingPassword" | "passwordUpdated" | "passwordUpdatedBody"
  | "linkExpired" | "linkExpiredBody" | "requestNewLink" | "goToSignIn"
  | "passwordsDoNotMatch" | "passwordRequirements" | "passwordUpdatedSuccess"
  | "incorrectCurrentPassword" | "failedToUpdatePassword"
  // Dashboard
  | "yourPapers" | "uploadPaper" | "noPapersYet" | "noPapersBody" | "open" | "delete"
  | "uploadedOn" | "deletePaperConfirm" | "uploadsChart" | "comparisons"
  | "openPaperHint"
  // Upload
  | "uploadPageTitle" | "uploadPageSubtitle" | "dragDrop" | "orClickBrowse"
  | "chooseFile" | "dontCloseTab" | "extractingText" | "uploadingFile"
  | "savingPaper" | "paperUploaded" | "uploadFailed" | "notPdf" | "tooLarge"
  | "noTextExtracted" | "notSignedIn"
  // Paper workspace
  | "backToDashboard" | "quickActions" | "askAnything" | "send" | "thinking"
  | "loading" | "tryQuickAction" | "voiceInput" | "listeningStop"
  | "citations" | "knowledgeGraph" | "qualityScore"
  | "summaryAction" | "gapsAction" | "vivaPrepAction" | "pptAction"
  | "projectConverterAction" | "qualityScoreAction"
  // Compare
  | "newComparison" | "history" | "searchHistory" | "noComparisons"
  | "comparePageTitle" | "comparePageSubtitle" | "uploadSomePapersFirst"
  | "optionalFocus" | "compareBtn" | "pickUpTo5" | "selectAtLeast2"
  | "comparisonCreated" | "comparisonFailed" | "aiRequestFailed"
  | "renameFailed" | "deleteFailed" | "openOrStartNew"
  | "compareFollowupPlaceholder" | "renameComparison" | "deleteComparisonConfirm"
  // Insights
  | "insightsTitle" | "insightsSubtitle" | "recentPapers" | "recentQuestions"
  | "papersUploaded" | "questionsAsked" | "avgPerPaper"
  | "uploadToGetStarted" | "askFirstQuestion"
  // Settings
  | "settingsTitle" | "settingsSubtitle" | "account" | "memberSince" | "papers"
  | "currentPassword" | "confirmPassword" | "updatePassword"
  | "dangerZone" | "dangerZoneBody" | "deleteAllPapers" | "deleteAllConfirm"
  | "allPapersDeleted" | "passwordDoesNotMeet"
  // Modes
  | "student" | "researcher" | "reviewer" | "professor" | "mode"
  | "currentMode" | "switchedToMode"
  // TTS
  | "readAloud" | "pause" | "resume" | "stop" | "voiceSettings" | "speed" | "voice" | "auto"
  // Citations
  | "citationPanel" | "authors" | "year" | "venue" | "pages"
  | "copy" | "copied" | "download" | "citationCopied"
  // Quality score
  | "researchQualityScore" | "novelty" | "impact" | "methodology"
  | "dataset" | "citationQuality" | "overall"
  | "excellent" | "good" | "fair" | "weak"
  // Knowledge graph
  | "knowledgeGraphTitle" | "keyword" | "author" | "concept" | "algorithm"
  // Misc
  | "language" | "or" | "summary" | "gaps" | "vivaPrep" | "ppt" | "projectConverter"
  | "modeDescription_student" | "modeDescription_researcher"
  | "modeDescription_reviewer" | "modeDescription_professor";

type Translations = Record<TranslationKey, string>;
// ─── English ───────────────────────────────────────────────────────────────
const EN: Translations = {
  dashboard:"Dashboard", upload:"Upload", compare:"Compare", insights:"Insights",
  settings:"Settings", signOut:"Sign out",
  welcomeBack:"Welcome back", createAccount:"Create your account",
  signInSubtitle:"Sign in to continue your research.",
  signUpSubtitle:"Start unlocking research papers in seconds.",
  email:"Email", password:"Password", forgotPassword:"Forgot password?",
  signIn:"Sign in", pleaseWait:"Please wait…", continueWithGoogle:"Continue with Google",
  alreadyHaveAccount:"Already have an account?", newHere:"New here?",
  orSeparator:"or", authFailed:"Authentication failed", googleFailed:"Google sign-in failed",
  accountCreated:"Account created. Check your email if confirmation is required.",
  forgotYourPassword:"Forgot your password?",
  forgotSubtitle:"Enter your email and we'll send you a secure link to reset your password.",
  sendResetLink:"Send reset link", sendingLink:"Sending reset link…",
  checkYourEmail:"Check your email",
  checkEmailBody:"We've sent a password reset link. The link expires in 15 minutes.",
  backToSignIn:"Back to sign in", rememberedIt:"Remembered it?",
  emailPlaceholder:"you@example.com", failedToSend:"Failed to send reset link",
  setNewPassword:"Set a new password",
  chooseStrongPassword:"Choose a strong password you haven't used before.",
  newPassword:"New password", confirmNewPassword:"Confirm new password",
  changePassword:"Change password", updatingPassword:"Updating password…",
  passwordUpdated:"Password updated",
  passwordUpdatedBody:"Your password has been changed. Please sign in again with your new password.",
  linkExpired:"Link expired or invalid",
  linkExpiredBody:"This password reset link has expired or already been used. Please request a new one.",
  requestNewLink:"Request a new link", goToSignIn:"Go to sign in",
  passwordsDoNotMatch:"Passwords do not match.", passwordRequirements:"Password does not meet all requirements",
  passwordUpdatedSuccess:"Password updated successfully",
  incorrectCurrentPassword:"Current password is incorrect",
  failedToUpdatePassword:"Failed to update password",
  yourPapers:"Your papers", uploadPaper:"Upload paper", noPapersYet:"No papers yet",
  noPapersBody:"Upload your first research paper to get started.",
  open:"Open", delete:"Delete", uploadedOn:"Uploaded",
  deletePaperConfirm:"Delete this paper and all its conversations?",
  uploadsChart:"Uploads — Last 7 days", comparisons:"Comparisons",
  openPaperHint:"Open a paper to chat, summarise, or prep for viva.",
  uploadPageTitle:"Upload a research paper",
  uploadPageSubtitle:"PDF only, up to 25 MB. Text is extracted in your browser.",
  dragDrop:"Drag & drop your PDF here", orClickBrowse:"or click anywhere in this box to browse",
  chooseFile:"Choose file", dontCloseTab:"Please don't close this tab.",
  extractingText:"Extracting text from PDF…", uploadingFile:"Uploading file…",
  savingPaper:"Saving paper…", paperUploaded:"Paper uploaded!",
  uploadFailed:"Upload failed", notPdf:"Please upload a PDF file.",
  tooLarge:"File must be under 25 MB.", noTextExtracted:"Couldn't extract any text from this PDF.",
  notSignedIn:"Not signed in",
  backToDashboard:"Back to dashboard", quickActions:"Quick actions",
  askAnything:"Ask anything about this paper", send:"Send", thinking:"Thinking…",
  loading:"Loading…", tryQuickAction:"Try a quick action on the left, or type a question below.",
  voiceInput:"Voice input", listeningStop:"Listening… click to stop",
  citations:"Citations", knowledgeGraph:"Knowledge Graph", qualityScore:"Quality Score",
  summaryAction:"Summary", gapsAction:"Gaps", vivaPrepAction:"Viva Prep",
  pptAction:"PPT", projectConverterAction:"Project Converter", qualityScoreAction:"Quality Score",
  newComparison:"New comparison", history:"History", searchHistory:"Search history",
  noComparisons:"No comparisons yet.",
  comparePageTitle:"New comparison",
  comparePageSubtitle:"Pick 2–5 papers. We'll save it so you can continue the chat later.",
  uploadSomePapersFirst:"Upload some papers first.",
  optionalFocus:"Optional focus (e.g. 'datasets', 'accuracy')",
  compareBtn:"Compare", pickUpTo5:"Pick up to 5 papers",
  selectAtLeast2:"Select at least 2 papers", comparisonCreated:"Comparison created",
  comparisonFailed:"Comparison failed", aiRequestFailed:"AI request failed",
  renameFailed:"Rename failed", deleteFailed:"Delete failed",
  openOrStartNew:"Open a comparison from the sidebar, or start a new one.",
  compareFollowupPlaceholder:"Ask a follow-up about these papers…",
  renameComparison:"Rename comparison",
  deleteComparisonConfirm:"Delete this comparison? This can't be undone.",
  insightsTitle:"Insights", insightsSubtitle:"Your research activity at a glance.",
  recentPapers:"Recent papers", recentQuestions:"Recent questions",
  papersUploaded:"Papers uploaded", questionsAsked:"Questions asked", avgPerPaper:"Avg Qs / paper",
  uploadToGetStarted:"Upload a paper to get started.",
  askFirstQuestion:"Ask your first AI question on a paper.",
  settingsTitle:"Settings", settingsSubtitle:"Manage your account and data.",
  account:"Account", memberSince:"Member since", papers:"Papers",
  currentPassword:"Current password", confirmPassword:"Confirm new password",
  updatePassword:"Update password",
  dangerZone:"Danger zone",
  dangerZoneBody:"Permanently delete every paper and conversation tied to your account.",
  deleteAllPapers:"Delete all papers",
  deleteAllConfirm:"Delete ALL your papers and conversations? This cannot be undone.",
  allPapersDeleted:"All papers deleted", passwordDoesNotMeet:"Password does not meet all requirements",
  student:"Student", researcher:"Researcher", reviewer:"Reviewer", professor:"Professor",
  mode:"Mode", currentMode:"Current Mode", switchedToMode:"Switched to",
  modeDescription_student:"Simple explanations and exam-oriented answers.",
  modeDescription_researcher:"Technical depth and research-focused analysis.",
  modeDescription_reviewer:"Critical analysis, strengths, weaknesses, accept/reject reasoning, scoring.",
  modeDescription_professor:"Viva questions, future work, research gaps and academic discussion.",
  readAloud:"Read aloud", pause:"Pause", resume:"Resume", stop:"Stop",
  voiceSettings:"Voice settings", speed:"Speed", voice:"Voice", auto:"Auto",
  citationPanel:"Citation", authors:"Authors", year:"Year", venue:"Venue", pages:"Pages",
  copy:"Copy", copied:"Copied", download:"Download", citationCopied:"citation copied",
  researchQualityScore:"Research Quality Score",
  novelty:"Novelty", impact:"Impact", methodology:"Methodology",
  dataset:"Dataset", citationQuality:"Citations", overall:"Overall",
  excellent:"Excellent — Highly publishable", good:"Good — Strong contribution",
  fair:"Fair — Needs improvements", weak:"Weak — Major revision required",
  knowledgeGraphTitle:"Knowledge Graph",
  keyword:"keyword", author:"author", concept:"concept", algorithm:"algorithm",
  language:"Language", or:"or",
  summary:"Summary", gaps:"Gaps", vivaPrep:"Viva Prep", ppt:"PPT", projectConverter:"Project Converter",
};

// ─── Hindi ─────────────────────────────────────────────────────────────────
const HI: Translations = {
  dashboard:"डैशबोर्ड", upload:"अपलोड", compare:"तुलना", insights:"अंतर्दृष्टि",
  settings:"सेटिंग्स", signOut:"साइन आउट",
  welcomeBack:"वापस स्वागत है", createAccount:"अपना खाता बनाएं",
  signInSubtitle:"अपना शोध जारी रखने के लिए साइन इन करें।",
  signUpSubtitle:"सेकंड में रिसर्च पेपर अनलॉक करना शुरू करें।",
  email:"ईमेल", password:"पासवर्ड", forgotPassword:"पासवर्ड भूल गए?",
  signIn:"साइन इन", pleaseWait:"कृपया प्रतीक्षा करें…",
  continueWithGoogle:"Google से जारी रखें",
  alreadyHaveAccount:"पहले से खाता है?", newHere:"नए हैं?",
  orSeparator:"या", authFailed:"प्रमाणीकरण विफल", googleFailed:"Google साइन-इन विफल",
  accountCreated:"खाता बनाया गया। यदि आवश्यक हो तो अपना ईमेल जांचें।",
  forgotYourPassword:"अपना पासवर्ड भूल गए?",
  forgotSubtitle:"अपना ईमेल दर्ज करें और हम आपको पासवर्ड रीसेट लिंक भेजेंगे।",
  sendResetLink:"रीसेट लिंक भेजें", sendingLink:"रीसेट लिंक भेज रहे हैं…",
  checkYourEmail:"अपना ईमेल देखें",
  checkEmailBody:"हमने पासवर्ड रीसेट लिंक भेज दिया है। लिंक 15 मिनट में समाप्त होगा।",
  backToSignIn:"साइन इन पर वापस जाएं", rememberedIt:"याद आ गया?",
  emailPlaceholder:"aap@example.com", failedToSend:"रीसेट लिंक भेजने में विफल",
  setNewPassword:"नया पासवर्ड सेट करें",
  chooseStrongPassword:"एक मजबूत पासवर्ड चुनें जो पहले उपयोग न किया हो।",
  newPassword:"नया पासवर्ड", confirmNewPassword:"नया पासवर्ड पुष्टि करें",
  changePassword:"पासवर्ड बदलें", updatingPassword:"पासवर्ड अपडेट हो रहा है…",
  passwordUpdated:"पासवर्ड अपडेट किया गया",
  passwordUpdatedBody:"आपका पासवर्ड बदल दिया गया है। कृपया नए पासवर्ड से साइन इन करें।",
  linkExpired:"लिंक समाप्त या अमान्य",
  linkExpiredBody:"यह पासवर्ड रीसेट लिंक समाप्त हो गया है या पहले से उपयोग किया जा चुका है।",
  requestNewLink:"नया लिंक अनुरोध करें", goToSignIn:"साइन इन पर जाएं",
  passwordsDoNotMatch:"पासवर्ड मेल नहीं खाते।",
  passwordRequirements:"पासवर्ड सभी आवश्यकताओं को पूरा नहीं करता",
  passwordUpdatedSuccess:"पासवर्ड सफलतापूर्वक अपडेट किया गया",
  incorrectCurrentPassword:"वर्तमान पासवर्ड गलत है",
  failedToUpdatePassword:"पासवर्ड अपडेट करने में विफल",
  yourPapers:"आपके पेपर", uploadPaper:"पेपर अपलोड करें", noPapersYet:"अभी कोई पेपर नहीं",
  noPapersBody:"शुरू करने के लिए अपना पहला रिसर्च पेपर अपलोड करें।",
  open:"खोलें", delete:"हटाएं", uploadedOn:"अपलोड किया",
  deletePaperConfirm:"इस पेपर और इसकी सभी बातचीत हटाएं?",
  uploadsChart:"अपलोड — पिछले 7 दिन", comparisons:"तुलनाएं",
  openPaperHint:"चैट, सारांश या वाइवा की तैयारी के लिए पेपर खोलें।",
  uploadPageTitle:"रिसर्च पेपर अपलोड करें",
  uploadPageSubtitle:"केवल PDF, 25 MB तक। टेक्स्ट आपके ब्राउज़र में निकाला जाता है।",
  dragDrop:"अपना PDF यहाँ खींचें और छोड़ें", orClickBrowse:"या ब्राउज़ करने के लिए यहाँ कहीं भी क्लिक करें",
  chooseFile:"फ़ाइल चुनें", dontCloseTab:"कृपया यह टैब बंद न करें।",
  extractingText:"PDF से टेक्स्ट निकाल रहे हैं…", uploadingFile:"फ़ाइल अपलोड हो रही है…",
  savingPaper:"पेपर सहेजा जा रहा है…", paperUploaded:"पेपर अपलोड हो गया!",
  uploadFailed:"अपलोड विफल", notPdf:"कृपया PDF फ़ाइल अपलोड करें।",
  tooLarge:"फ़ाइल 25 MB से कम होनी चाहिए।", noTextExtracted:"इस PDF से कोई टेक्स्ट नहीं निकाल सका।",
  notSignedIn:"साइन इन नहीं किया",
  backToDashboard:"डैशबोर्ड पर वापस", quickActions:"त्वरित क्रियाएं",
  askAnything:"इस पेपर के बारे में कुछ भी पूछें", send:"भेजें", thinking:"सोच रहे हैं…",
  loading:"लोड हो रहा है…", tryQuickAction:"बाईं ओर त्वरित क्रिया आज़माएं या नीचे प्रश्न टाइप करें।",
  voiceInput:"आवाज़ इनपुट", listeningStop:"सुन रहे हैं… रोकने के लिए क्लिक करें",
  citations:"उद्धरण", knowledgeGraph:"ज्ञान ग्राफ", qualityScore:"गुणवत्ता स्कोर",
  summaryAction:"सारांश", gapsAction:"अंतराल", vivaPrepAction:"वाइवा तैयारी",
  pptAction:"PPT", projectConverterAction:"प्रोजेक्ट", qualityScoreAction:"गुणवत्ता स्कोर",
  newComparison:"नई तुलना", history:"इतिहास", searchHistory:"इतिहास खोजें",
  noComparisons:"अभी कोई तुलना नहीं।",
  comparePageTitle:"नई तुलना",
  comparePageSubtitle:"2–5 पेपर चुनें। हम इसे सहेजेंगे ताकि आप बाद में चैट जारी रख सकें।",
  uploadSomePapersFirst:"पहले कुछ पेपर अपलोड करें।",
  optionalFocus:"वैकल्पिक फ़ोकस (जैसे डेटासेट, सटीकता)",
  compareBtn:"तुलना करें", pickUpTo5:"अधिकतम 5 पेपर चुनें",
  selectAtLeast2:"कम से कम 2 पेपर चुनें", comparisonCreated:"तुलना बनाई गई",
  comparisonFailed:"तुलना विफल", aiRequestFailed:"AI अनुरोध विफल",
  renameFailed:"नाम बदलने में विफल", deleteFailed:"हटाने में विफल",
  openOrStartNew:"साइडबार से तुलना खोलें या नई शुरू करें।",
  compareFollowupPlaceholder:"इन पेपर के बारे में फ़ॉलो-अप पूछें…",
  renameComparison:"तुलना का नाम बदलें",
  deleteComparisonConfirm:"यह तुलना हटाएं? इसे पूर्ववत नहीं किया जा सकता।",
  insightsTitle:"अंतर्दृष्टि", insightsSubtitle:"आपकी शोध गतिविधि एक नज़र में।",
  recentPapers:"हालिया पेपर", recentQuestions:"हालिया प्रश्न",
  papersUploaded:"अपलोड किए गए पेपर", questionsAsked:"पूछे गए प्रश्न", avgPerPaper:"औसत प्रश्न/पेपर",
  uploadToGetStarted:"शुरू करने के लिए पेपर अपलोड करें।",
  askFirstQuestion:"किसी पेपर पर अपना पहला AI प्रश्न पूछें।",
  settingsTitle:"सेटिंग्स", settingsSubtitle:"अपना खाता और डेटा प्रबंधित करें।",
  account:"खाता", memberSince:"सदस्य", papers:"पेपर",
  currentPassword:"वर्तमान पासवर्ड", confirmPassword:"नया पासवर्ड पुष्टि करें",
  updatePassword:"पासवर्ड अपडेट करें",
  dangerZone:"खतरा क्षेत्र",
  dangerZoneBody:"अपने खाते से जुड़े हर पेपर और बातचीत को स्थायी रूप से हटाएं।",
  deleteAllPapers:"सभी पेपर हटाएं",
  deleteAllConfirm:"अपने सभी पेपर और बातचीत हटाएं? इसे पूर्ववत नहीं किया जा सकता।",
  allPapersDeleted:"सभी पेपर हटाए गए",
  passwordDoesNotMeet:"पासवर्ड सभी आवश्यकताओं को पूरा नहीं करता",
  student:"छात्र", researcher:"शोधकर्ता", reviewer:"समीक्षक", professor:"प्रोफेसर",
  mode:"मोड", currentMode:"वर्तमान मोड", switchedToMode:"पर स्विच किया",
  modeDescription_student:"सरल व्याख्या और परीक्षा-उन्मुख उत्तर।",
  modeDescription_researcher:"तकनीकी गहराई और शोध-केंद्रित विश्लेषण।",
  modeDescription_reviewer:"आलोचनात्मक विश्लेषण, स्कोरिंग और स्वीकृति सिफारिश।",
  modeDescription_professor:"वाइवा प्रश्न, भविष्य के काम, शोध अंतराल।",
  readAloud:"जोर से पढ़ें", pause:"रोकें", resume:"फिर शुरू", stop:"बंद करें",
  voiceSettings:"आवाज़ सेटिंग्स", speed:"गति", voice:"आवाज़", auto:"स्वचालित",
  citationPanel:"उद्धरण", authors:"लेखक", year:"वर्ष", venue:"स्थान", pages:"पृष्ठ",
  copy:"कॉपी", copied:"कॉपी किया", download:"डाउनलोड", citationCopied:"उद्धरण कॉपी किया",
  researchQualityScore:"शोध गुणवत्ता स्कोर",
  novelty:"नवीनता", impact:"प्रभाव", methodology:"पद्धति",
  dataset:"डेटासेट", citationQuality:"उद्धरण", overall:"कुल",
  excellent:"उत्कृष्ट — प्रकाशन योग्य", good:"अच्छा — मजबूत योगदान",
  fair:"उचित — सुधार की आवश्यकता", weak:"कमजोर — बड़े संशोधन की आवश्यकता",
  knowledgeGraphTitle:"ज्ञान ग्राफ",
  keyword:"कीवर्ड", author:"लेखक", concept:"अवधारणा", algorithm:"एल्गोरिदम",
  language:"भाषा", or:"या",
  summary:"सारांश", gaps:"अंतराल", vivaPrep:"वाइवा तैयारी", ppt:"PPT", projectConverter:"प्रोजेक्ट",
};
const KN: Translations = {
  dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",upload:"ಅಪ್‌ಲೋಡ್",compare:"ಹೋಲಿಕೆ",insights:"ಒಳನೋಟ",
  settings:"ಸೆಟ್ಟಿಂಗ್‌ಗಳು",signOut:"ಸೈನ್ ಔಟ್",
  welcomeBack:"ಮರಳಿ ಸ್ವಾಗತ",createAccount:"ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ",
  signInSubtitle:"ನಿಮ್ಮ ಸಂಶೋಧನೆ ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
  signUpSubtitle:"ಸಂಶೋಧನಾ ಪ್ರಬಂಧಗಳನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ.",
  email:"ಇಮೇಲ್",password:"ಪಾಸ್‌ವರ್ಡ್",forgotPassword:"ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
  signIn:"ಸೈನ್ ಇನ್",pleaseWait:"ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ…",continueWithGoogle:"Google ನಿಂದ ಮುಂದುವರಿಸಿ",
  alreadyHaveAccount:"ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",newHere:"ಹೊಸಬರೇ?",orSeparator:"ಅಥವಾ",
  authFailed:"ದೃಢೀಕರಣ ವಿಫಲ",googleFailed:"Google ಸೈನ್-ಇನ್ ವಿಫಲ",
  accountCreated:"ಖಾತೆ ರಚಿಸಲಾಗಿದೆ.",
  forgotYourPassword:"ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
  forgotSubtitle:"ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ, ನಾವು ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತೇವೆ.",
  sendResetLink:"ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿ",sendingLink:"ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ…",
  checkYourEmail:"ನಿಮ್ಮ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ",checkEmailBody:"ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿದ್ದೇವೆ.",
  backToSignIn:"ಸೈನ್ ಇನ್‌ಗೆ ಹಿಂತಿರುಗಿ",rememberedIt:"ನೆನಪಾಯಿತೇ?",
  emailPlaceholder:"nimma@example.com",failedToSend:"ಲಿಂಕ್ ಕಳುಹಿಸಲು ವಿಫಲ",
  setNewPassword:"ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ಹೊಂದಿಸಿ",chooseStrongPassword:"ಬಲವಾದ ಪಾಸ್‌ವರ್ಡ್ ಆಯ್ಕೆ ಮಾಡಿ.",
  newPassword:"ಹೊಸ ಪಾಸ್‌ವರ್ಡ್",confirmNewPassword:"ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
  changePassword:"ಪಾಸ್‌ವರ್ಡ್ ಬದಲಿಸಿ",updatingPassword:"ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ…",
  passwordUpdated:"ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಲಾಗಿದೆ",passwordUpdatedBody:"ಪಾಸ್‌ವರ್ಡ್ ಬದಲಾಗಿದೆ. ಮತ್ತೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
  linkExpired:"ಲಿಂಕ್ ಅವಧಿ ಮೀರಿದೆ",linkExpiredBody:"ಈ ಲಿಂಕ್ ಅಮಾನ್ಯ ಅಥವಾ ಬಳಸಲಾಗಿದೆ.",
  requestNewLink:"ಹೊಸ ಲಿಂಕ್ ವಿನಂತಿಸಿ",goToSignIn:"ಸೈನ್ ಇನ್‌ಗೆ ಹೋಗಿ",
  passwordsDoNotMatch:"ಪಾಸ್‌ವರ್ಡ್‌ಗಳು ಹೊಂದಿಕೊಳ್ಳುವುದಿಲ್ಲ.",
  passwordRequirements:"ಪಾಸ್‌ವರ್ಡ್ ಎಲ್ಲಾ ಅಪೇಕ್ಷೆಗಳನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ",
  passwordUpdatedSuccess:"ಪಾಸ್‌ವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ",
  incorrectCurrentPassword:"ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್ ತಪ್ಪಾಗಿದೆ",failedToUpdatePassword:"ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಲು ವಿಫಲ",
  yourPapers:"ನಿಮ್ಮ ಪ್ರಬಂಧಗಳು",uploadPaper:"ಪ್ರಬಂಧ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",noPapersYet:"ಇನ್ನೂ ಯಾವ ಪ್ರಬಂಧಗಳಿಲ್ಲ",
  noPapersBody:"ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ಪ್ರಬಂಧ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
  open:"ತೆರೆಯಿರಿ",delete:"ಅಳಿಸಿ",uploadedOn:"ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ",
  deletePaperConfirm:"ಈ ಪ್ರಬಂಧ ಮತ್ತು ಸಂಭಾಷಣೆಗಳನ್ನು ಅಳಿಸಲೇ?",
  uploadsChart:"ಅಪ್‌ಲೋಡ್ — ಕೆಳಗಿನ 7 ದಿನಗಳು",comparisons:"ಹೋಲಿಕೆಗಳು",
  openPaperHint:"ಚ್ಯಾಟ್, ಸಾರಾಂಶ ಅಥವಾ ವೈವಾ ತಯಾರಿಗಾಗಿ ಪ್ರಬಂಧ ತೆರೆಯಿರಿ.",
  uploadPageTitle:"ಸಂಶೋಧನಾ ಪ್ರಬಂಧ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ",uploadPageSubtitle:"ಕೇವಲ PDF, 25 MB ವರೆಗೆ.",
  dragDrop:"ನಿಮ್ಮ PDF ಇಲ್ಲಿ ಎಳೆಯಿರಿ",orClickBrowse:"ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
  chooseFile:"ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ",dontCloseTab:"ದಯವಿಟ್ಟು ಈ ಟ್ಯಾಬ್ ಮುಚ್ಚಬೇಡಿ.",
  extractingText:"PDF ನಿಂದ ಟೆಕ್ಸ್ಟ್ ತೆಗೆದುಕೊಳ್ಳಲಾಗುತ್ತಿದೆ…",uploadingFile:"ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಆಗುತ್ತಿದೆ…",
  savingPaper:"ಪ್ರಬಂಧ ಮೆವೆಸಲಾಗುತ್ತಿದೆ…",paperUploaded:"ಪ್ರಬಂಧ ಅಪ್‌ಲೋಡ್ ಆಯಿತು!",
  uploadFailed:"ಅಪ್‌ಲೋಡ್ ವಿಫಲ",notPdf:"ದಯವಿಟ್ಟು PDF ಫೈಲ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",tooLarge:"ಫೈಲ್ 25 MB ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
  noTextExtracted:"ಈ PDF ನಿಂದ ಯಾವ ಟೆಕ್ಸ್ಟ್ ತೆಗೆದುಕೊಳ್ಳಲಾಗಲಿಲ್ಲ.",notSignedIn:"ಸೈನ್ ಇನ್ ಮಾಡಿಲ್ಲ",
  backToDashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್‌ಗೆ ಹಿಂತಿರುಗಿ",quickActions:"ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
  askAnything:"ಈ ಪ್ರಬಂಧದ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ",send:"ಕಳುಹಿಸಿ",thinking:"ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ…",
  loading:"ಲೋಡ್ ಆಗುತ್ತಿದೆ…",tryQuickAction:"ಎಡಗಡೆ ತ್ವರಿತ ಕ್ರಿಯೆ ಪ್ರಯತ್ನಿಸಿ.",
  voiceInput:"ಧ್ವನಿ ಇನ್‌ಪುಟ್",listeningStop:"ಕೇಳುತ್ತಿದೆ… ನಿಲ್ಲಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
  citations:"ಉಲ್ಲೇಖಗಳು",knowledgeGraph:"ಜ್ಞಾನ ಗ್ರಾಫ್",qualityScore:"ಗುಣಮಟ್ಟ ಸ್ಕೋರ್",
  summaryAction:"ಸಾರಾಂಶ",gapsAction:"ಅಂತರಗಳು",vivaPrepAction:"ವೈವಾ ತಯಾರಿ",
  pptAction:"PPT",projectConverterAction:"ಯೋಜನೆ",qualityScoreAction:"ಗುಣಮಟ್ಟ ಸ್ಕೋರ್",
  newComparison:"ಹೊಸ ಹೋಲಿಕೆ",history:"ಇತಿಹಾಸ",searchHistory:"ಇತಿಹಾಸ ಹುಡುಕಿ",noComparisons:"ಇನ್ನೂ ಯಾವ ಹೋಲಿಕೆಗಳಿಲ್ಲ.",
  comparePageTitle:"ಹೊಸ ಹೋಲಿಕೆ",comparePageSubtitle:"2–5 ಪ್ರಬಂಧಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
  uploadSomePapersFirst:"ಮೊದಲು ಕೆಲವು ಪ್ರಬಂಧಗಳನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
  optionalFocus:"ಐಚ್ಛಿಕ ಗಮನ (ಉದಾ. ಡೇಟಾಸೆಟ್, ಸಟೀಕತೆ)",compareBtn:"ಹೋಲಿಸಿ",
  pickUpTo5:"ಗರಿಷ್ಠ 5 ಪ್ರಬಂಧಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",selectAtLeast2:"ಕನಿಷ್ಠ 2 ಪ್ರಬಂಧಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
  comparisonCreated:"ಹೋಲಿಕೆ ರಚಿಸಲಾಗಿದೆ",comparisonFailed:"ಹೋಲಿಕೆ ವಿಫಲ",aiRequestFailed:"AI ವಿನಂತಿ ವಿಫಲ",
  renameFailed:"ಹೆಸರು ಬದಲಾಯಿಸಲು ವಿಫಲ",deleteFailed:"ಅಳಿಸಲು ವಿಫಲ",
  openOrStartNew:"ಸೈಡ್‌ಬಾರ್‌ನಿಂದ ಹೋಲಿಕೆ ತೆರೆಯಿರಿ ಅಥವಾ ಹೊಸದನ್ನು ಪ್ರಾರಂಭಿಸಿ.",
  compareFollowupPlaceholder:"ಈ ಪ್ರಬಂಧಗಳ ಬಗ್ಗೆ ಫಾಲೋ-ಅಪ್ ಕೇಳಿ…",
  renameComparison:"ಹೋಲಿಕೆ ಹೆಸರು ಬದಲಿಸಿ",deleteComparisonConfirm:"ಈ ಹೋಲಿಕೆ ಅಳಿಸಲೇ?",
  insightsTitle:"ಒಳನೋಟ",insightsSubtitle:"ನಿಮ್ಮ ಸಂಶೋಧನಾ ಚಟುವಟಿಕೆ ಒಂದು ನೋಟದಲ್ಲಿ.",
  recentPapers:"ಇತ್ತೀಚಿನ ಪ್ರಬಂಧಗಳು",recentQuestions:"ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು",
  papersUploaded:"ಅಪ್‌ಲೋಡ್ ಮಾಡಿದ ಪ್ರಬಂಧಗಳು",questionsAsked:"ಕೇಳಿದ ಪ್ರಶ್ನೆಗಳು",avgPerPaper:"ಸರಾಸರಿ ಪ್ರಶ್ನೆಗಳು",
  uploadToGetStarted:"ಪ್ರಾರಂಭಿಸಲು ಪ್ರಬಂಧ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",askFirstQuestion:"ಪ್ರಬಂಧದ ಮೇಲೆ ನಿಮ್ಮ ಮೊದಲ AI ಪ್ರಶ್ನೆ ಕೇಳಿ.",
  settingsTitle:"ಸೆಟ್ಟಿಂಗ್‌ಗಳು",settingsSubtitle:"ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಡೇಟಾ ನಿರ್ವಹಿಸಿ.",
  account:"ಖಾತೆ",memberSince:"ಸದಸ್ಯ",papers:"ಪ್ರಬಂಧಗಳು",
  currentPassword:"ಪ್ರಸ್ತುತ ಪಾಸ್‌ವರ್ಡ್",confirmPassword:"ಹೊಸ ಪಾಸ್‌ವರ್ಡ್ ದೃಢೀಕರಿಸಿ",updatePassword:"ಪಾಸ್‌ವರ್ಡ್ ನವೀಕರಿಸಿ",
  dangerZone:"ಅಪಾಯ ವಲಯ",dangerZoneBody:"ನಿಮ್ಮ ಖಾತೆಗೆ ಸಂಬಂಧಿಸಿದ ಎಲ್ಲವನ್ನೂ ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಿ.",
  deleteAllPapers:"ಎಲ್ಲ ಪ್ರಬಂಧಗಳನ್ನು ಅಳಿಸಿ",deleteAllConfirm:"ಎಲ್ಲ ಪ್ರಬಂಧಗಳನ್ನು ಅಳಿಸಲೇ? ಇದನ್ನು ಹಿಂತಿರುಗಿಸಲಾಗುವುದಿಲ್ಲ.",
  allPapersDeleted:"ಎಲ್ಲ ಪ್ರಬಂಧಗಳನ್ನು ಅಳಿಸಲಾಗಿದೆ",passwordDoesNotMeet:"ಪಾಸ್‌ವರ್ಡ್ ಅಪೇಕ್ಷೆಗಳನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ",
  student:"ವಿದ್ಯಾರ್ಥಿ",researcher:"ಸಂಶೋಧಕ",reviewer:"ವಿಮರ್ಶಕ",professor:"ಪ್ರಾಧ್ಯಾಪಕ",
  mode:"ಮೋಡ್",currentMode:"ಪ್ರಸ್ತುತ ಮೋಡ್",switchedToMode:"ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ",
  modeDescription_student:"ಸರಳ ವಿವರಣೆ ಮತ್ತು ಪರೀಕ್ಷಾ-ಉನ್ಮುಖ ಉತ್ತರಗಳು.",
  modeDescription_researcher:"ತಾಂತ್ರಿಕ ಆಳ ಮತ್ತು ಸಂಶೋಧನಾ ವಿಶ್ಲೇಷಣೆ.",
  modeDescription_reviewer:"ವಿಮರ್ಶಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ, ಸ್ಕೋರಿಂಗ್ ಮತ್ತು ಶಿಫಾರಸು.",
  modeDescription_professor:"ವೈವಾ ಪ್ರಶ್ನೆಗಳು, ಭವಿಷ್ಯದ ಕೆಲಸ, ಸಂಶೋಧನಾ ಅಂತರಗಳು.",
  readAloud:"ಜೋರಾಗಿ ಓದಿ",pause:"ವಿರಾಮ",resume:"ಮತ್ತೆ ಪ್ರಾರಂಭ",stop:"ನಿಲ್ಲಿಸಿ",
  voiceSettings:"ಧ್ವನಿ ಸೆಟ್ಟಿಂಗ್‌ಗಳು",speed:"ವೇಗ",voice:"ಧ್ವನಿ",auto:"ಸ್ವಯಂ",
  citationPanel:"ಉಲ್ಲೇಖ",authors:"ಲೇಖಕರು",year:"ವರ್ಷ",venue:"ಸ್ಥಳ",pages:"ಪುಟಗಳು",
  copy:"ನಕಲು",copied:"ನಕಲಿಸಲಾಗಿದೆ",download:"ಡೌನ್‌ಲೋಡ್",citationCopied:"ಉಲ್ಲೇಖ ನಕಲಿಸಲಾಗಿದೆ",
  researchQualityScore:"ಸಂಶೋಧನಾ ಗುಣಮಟ್ಟ ಸ್ಕೋರ್",
  novelty:"ನಾವೀನ್ಯತೆ",impact:"ಪ್ರಭಾವ",methodology:"ಕ್ರಮಶಾಸ್ತ್ರ",
  dataset:"ಡೇಟಾಸೆಟ್",citationQuality:"ಉಲ್ಲೇಖಗಳು",overall:"ಒಟ್ಟು",
  excellent:"ಉತ್ತಮ — ಪ್ರಕಟಣಾ ಯೋಗ್ಯ",good:"ಉತ್ತಮ — ಬಲವಾದ ಕೊಡುಗೆ",
  fair:"ಸಾಧಾರಣ — ಸುಧಾರಣೆ ಅಗತ್ಯ",weak:"ದುರ್ಬಲ — ದೊಡ್ಡ ಪರಿಷ್ಕರಣೆ ಅಗತ್ಯ",
  knowledgeGraphTitle:"ಜ್ಞಾನ ಗ್ರಾಫ್",keyword:"ಕೀವರ್ಡ್",author:"ಲೇಖಕ",concept:"ಪರಿಕಲ್ಪನೆ",algorithm:"ಅಲ್ಗಾರಿದಮ್",
  language:"ಭಾಷೆ",or:"ಅಥವಾ",
  summary:"ಸಾರಾಂಶ",gaps:"ಅಂತರಗಳು",vivaPrep:"ವೈವಾ ತಯಾರಿ",ppt:"PPT",projectConverter:"ಯೋಜನೆ",
};

const ES: Translations = {
  dashboard:"Panel",upload:"Subir",compare:"Comparar",insights:"Perspectivas",
  settings:"Configuración",signOut:"Cerrar sesión",
  welcomeBack:"Bienvenido de nuevo",createAccount:"Crear tu cuenta",
  signInSubtitle:"Inicia sesión para continuar tu investigación.",signUpSubtitle:"Empieza a desbloquear artículos de investigación en segundos.",
  email:"Correo electrónico",password:"Contraseña",forgotPassword:"¿Olvidaste tu contraseña?",
  signIn:"Iniciar sesión",pleaseWait:"Por favor espera…",continueWithGoogle:"Continuar con Google",
  alreadyHaveAccount:"¿Ya tienes cuenta?",newHere:"¿Eres nuevo?",orSeparator:"o",
  authFailed:"Error de autenticación",googleFailed:"Error de inicio de sesión con Google",
  accountCreated:"Cuenta creada. Revisa tu correo si se requiere confirmación.",
  forgotYourPassword:"¿Olvidaste tu contraseña?",forgotSubtitle:"Ingresa tu correo y te enviaremos un enlace seguro.",
  sendResetLink:"Enviar enlace de restablecimiento",sendingLink:"Enviando enlace…",
  checkYourEmail:"Revisa tu correo",checkEmailBody:"Hemos enviado un enlace de restablecimiento. Expira en 15 minutos.",
  backToSignIn:"Volver a iniciar sesión",rememberedIt:"¿Lo recordaste?",emailPlaceholder:"tu@ejemplo.com",failedToSend:"Error al enviar enlace",
  setNewPassword:"Establecer nueva contraseña",chooseStrongPassword:"Elige una contraseña segura que no hayas usado antes.",
  newPassword:"Nueva contraseña",confirmNewPassword:"Confirmar nueva contraseña",
  changePassword:"Cambiar contraseña",updatingPassword:"Actualizando contraseña…",
  passwordUpdated:"Contraseña actualizada",passwordUpdatedBody:"Tu contraseña ha sido cambiada. Inicia sesión de nuevo.",
  linkExpired:"Enlace expirado o inválido",linkExpiredBody:"Este enlace ha expirado o ya fue usado.",
  requestNewLink:"Solicitar nuevo enlace",goToSignIn:"Ir a iniciar sesión",
  passwordsDoNotMatch:"Las contraseñas no coinciden.",passwordRequirements:"La contraseña no cumple los requisitos",
  passwordUpdatedSuccess:"Contraseña actualizada correctamente",incorrectCurrentPassword:"Contraseña actual incorrecta",failedToUpdatePassword:"Error al actualizar contraseña",
  yourPapers:"Tus artículos",uploadPaper:"Subir artículo",noPapersYet:"Sin artículos aún",noPapersBody:"Sube tu primer artículo de investigación para comenzar.",
  open:"Abrir",delete:"Eliminar",uploadedOn:"Subido",deletePaperConfirm:"¿Eliminar este artículo y todas sus conversaciones?",
  uploadsChart:"Subidas — Últimos 7 días",comparisons:"Comparaciones",openPaperHint:"Abre un artículo para chatear, resumir o preparar la defensa.",
  uploadPageTitle:"Subir artículo de investigación",uploadPageSubtitle:"Solo PDF, hasta 25 MB.",
  dragDrop:"Arrastra y suelta tu PDF aquí",orClickBrowse:"o haz clic en cualquier lugar para explorar",
  chooseFile:"Elegir archivo",dontCloseTab:"Por favor no cierres esta pestaña.",
  extractingText:"Extrayendo texto del PDF…",uploadingFile:"Subiendo archivo…",savingPaper:"Guardando artículo…",
  paperUploaded:"¡Artículo subido!",uploadFailed:"Error al subir",notPdf:"Por favor sube un archivo PDF.",tooLarge:"El archivo debe ser menor de 25 MB.",noTextExtracted:"No se pudo extraer texto de este PDF.",notSignedIn:"No has iniciado sesión",
  backToDashboard:"Volver al panel",quickActions:"Acciones rápidas",askAnything:"Pregunta cualquier cosa sobre este artículo",
  send:"Enviar",thinking:"Pensando…",loading:"Cargando…",tryQuickAction:"Prueba una acción rápida a la izquierda.",
  voiceInput:"Entrada de voz",listeningStop:"Escuchando… clic para detener",
  citations:"Citas",knowledgeGraph:"Grafo de conocimiento",qualityScore:"Puntuación de calidad",
  summaryAction:"Resumen",gapsAction:"Brechas",vivaPrepAction:"Preparación de viva",pptAction:"PPT",projectConverterAction:"Proyecto",qualityScoreAction:"Puntuación de calidad",
  newComparison:"Nueva comparación",history:"Historial",searchHistory:"Buscar historial",noComparisons:"Sin comparaciones aún.",
  comparePageTitle:"Nueva comparación",comparePageSubtitle:"Elige 2–5 artículos.",uploadSomePapersFirst:"Sube algunos artículos primero.",
  optionalFocus:"Enfoque opcional",compareBtn:"Comparar",pickUpTo5:"Elige hasta 5 artículos",selectAtLeast2:"Selecciona al menos 2 artículos",
  comparisonCreated:"Comparación creada",comparisonFailed:"Comparación fallida",aiRequestFailed:"Solicitud de AI fallida",renameFailed:"Error al renombrar",deleteFailed:"Error al eliminar",
  openOrStartNew:"Abre una comparación del panel lateral o inicia una nueva.",compareFollowupPlaceholder:"Haz una pregunta de seguimiento…",renameComparison:"Renombrar comparación",deleteComparisonConfirm:"¿Eliminar esta comparación?",
  insightsTitle:"Perspectivas",insightsSubtitle:"Tu actividad de investigación de un vistazo.",recentPapers:"Artículos recientes",recentQuestions:"Preguntas recientes",
  papersUploaded:"Artículos subidos",questionsAsked:"Preguntas realizadas",avgPerPaper:"Promedio de preguntas",uploadToGetStarted:"Sube un artículo para comenzar.",askFirstQuestion:"Haz tu primera pregunta de AI.",
  settingsTitle:"Configuración",settingsSubtitle:"Gestiona tu cuenta y datos.",account:"Cuenta",memberSince:"Miembro desde",papers:"Artículos",
  currentPassword:"Contraseña actual",confirmPassword:"Confirmar nueva contraseña",updatePassword:"Actualizar contraseña",
  dangerZone:"Zona de peligro",dangerZoneBody:"Elimina permanentemente todos los artículos y conversaciones.",deleteAllPapers:"Eliminar todos los artículos",deleteAllConfirm:"¿Eliminar TODOS tus artículos? No se puede deshacer.",allPapersDeleted:"Todos los artículos eliminados",passwordDoesNotMeet:"La contraseña no cumple los requisitos",
  student:"Estudiante",researcher:"Investigador",reviewer:"Revisor",professor:"Profesor",mode:"Modo",currentMode:"Modo actual",switchedToMode:"Cambiado a",
  modeDescription_student:"Explicaciones simples y respuestas orientadas a exámenes.",modeDescription_researcher:"Profundidad técnica y análisis enfocado en investigación.",modeDescription_reviewer:"Análisis crítico, puntuación y recomendación de aceptación.",modeDescription_professor:"Preguntas de viva, trabajo futuro, brechas de investigación.",
  readAloud:"Leer en voz alta",pause:"Pausar",resume:"Reanudar",stop:"Detener",voiceSettings:"Configuración de voz",speed:"Velocidad",voice:"Voz",auto:"Auto",
  citationPanel:"Cita",authors:"Autores",year:"Año",venue:"Lugar",pages:"Páginas",copy:"Copiar",copied:"Copiado",download:"Descargar",citationCopied:"cita copiada",
  researchQualityScore:"Puntuación de calidad de investigación",novelty:"Novedad",impact:"Impacto",methodology:"Metodología",dataset:"Conjunto de datos",citationQuality:"Citas",overall:"General",
  excellent:"Excelente — Altamente publicable",good:"Bueno — Contribución sólida",fair:"Regular — Necesita mejoras",weak:"Débil — Revisión mayor requerida",
  knowledgeGraphTitle:"Grafo de conocimiento",keyword:"palabra clave",author:"autor",concept:"concepto",algorithm:"algoritmo",
  language:"Idioma",or:"o",summary:"Resumen",gaps:"Brechas",vivaPrep:"Preparación de viva",ppt:"PPT",projectConverter:"Proyecto",
};

const FR: Translations = {
  dashboard:"Tableau de bord",upload:"Téléverser",compare:"Comparer",insights:"Perspectives",
  settings:"Paramètres",signOut:"Se déconnecter",welcomeBack:"Bon retour",createAccount:"Créer votre compte",
  signInSubtitle:"Connectez-vous pour continuer votre recherche.",signUpSubtitle:"Commencez à débloquer des articles de recherche en quelques secondes.",
  email:"Email",password:"Mot de passe",forgotPassword:"Mot de passe oublié?",signIn:"Se connecter",pleaseWait:"Veuillez patienter…",
  continueWithGoogle:"Continuer avec Google",alreadyHaveAccount:"Vous avez déjà un compte?",newHere:"Nouveau?",orSeparator:"ou",
  authFailed:"Échec de l'authentification",googleFailed:"Échec de la connexion Google",accountCreated:"Compte créé. Vérifiez votre email si confirmation requise.",
  forgotYourPassword:"Mot de passe oublié?",forgotSubtitle:"Entrez votre email et nous vous enverrons un lien sécurisé.",sendResetLink:"Envoyer le lien",sendingLink:"Envoi du lien…",
  checkYourEmail:"Vérifiez votre email",checkEmailBody:"Nous avons envoyé un lien de réinitialisation. Il expire dans 15 minutes.",backToSignIn:"Retour à la connexion",rememberedIt:"Vous vous en souvenez?",
  emailPlaceholder:"vous@exemple.com",failedToSend:"Échec de l'envoi du lien",setNewPassword:"Définir un nouveau mot de passe",chooseStrongPassword:"Choisissez un mot de passe fort que vous n'avez pas utilisé.",
  newPassword:"Nouveau mot de passe",confirmNewPassword:"Confirmer le nouveau mot de passe",changePassword:"Changer le mot de passe",updatingPassword:"Mise à jour…",
  passwordUpdated:"Mot de passe mis à jour",passwordUpdatedBody:"Votre mot de passe a été modifié. Reconnectez-vous.",linkExpired:"Lien expiré ou invalide",linkExpiredBody:"Ce lien a expiré ou a déjà été utilisé.",
  requestNewLink:"Demander un nouveau lien",goToSignIn:"Aller à la connexion",passwordsDoNotMatch:"Les mots de passe ne correspondent pas.",passwordRequirements:"Le mot de passe ne satisfait pas les exigences",
  passwordUpdatedSuccess:"Mot de passe mis à jour avec succès",incorrectCurrentPassword:"Mot de passe actuel incorrect",failedToUpdatePassword:"Échec de la mise à jour",
  yourPapers:"Vos articles",uploadPaper:"Téléverser un article",noPapersYet:"Aucun article encore",noPapersBody:"Téléversez votre premier article de recherche pour commencer.",
  open:"Ouvrir",delete:"Supprimer",uploadedOn:"Téléversé",deletePaperConfirm:"Supprimer cet article et toutes ses conversations?",
  uploadsChart:"Téléversements — 7 derniers jours",comparisons:"Comparaisons",openPaperHint:"Ouvrez un article pour chatter, résumer ou préparer la soutenance.",
  uploadPageTitle:"Téléverser un article de recherche",uploadPageSubtitle:"PDF uniquement, jusqu'à 25 Mo.",dragDrop:"Glissez-déposez votre PDF ici",orClickBrowse:"ou cliquez n'importe où pour parcourir",
  chooseFile:"Choisir un fichier",dontCloseTab:"Ne fermez pas cet onglet.",extractingText:"Extraction du texte…",uploadingFile:"Téléversement…",savingPaper:"Enregistrement…",
  paperUploaded:"Article téléversé!",uploadFailed:"Échec du téléversement",notPdf:"Veuillez téléverser un fichier PDF.",tooLarge:"Le fichier doit être inférieur à 25 Mo.",noTextExtracted:"Impossible d'extraire le texte de ce PDF.",notSignedIn:"Non connecté",
  backToDashboard:"Retour au tableau de bord",quickActions:"Actions rapides",askAnything:"Posez n'importe quelle question sur cet article",
  send:"Envoyer",thinking:"Réflexion…",loading:"Chargement…",tryQuickAction:"Essayez une action rapide à gauche.",voiceInput:"Saisie vocale",listeningStop:"Écoute… cliquez pour arrêter",
  citations:"Citations",knowledgeGraph:"Graphe de connaissances",qualityScore:"Score de qualité",
  summaryAction:"Résumé",gapsAction:"Lacunes",vivaPrepAction:"Préparation soutenance",pptAction:"PPT",projectConverterAction:"Projet",qualityScoreAction:"Score de qualité",
  newComparison:"Nouvelle comparaison",history:"Historique",searchHistory:"Rechercher l'historique",noComparisons:"Aucune comparaison encore.",
  comparePageTitle:"Nouvelle comparaison",comparePageSubtitle:"Choisissez 2 à 5 articles.",uploadSomePapersFirst:"Téléversez d'abord des articles.",optionalFocus:"Focus optionnel",compareBtn:"Comparer",pickUpTo5:"Choisissez jusqu'à 5 articles",selectAtLeast2:"Sélectionnez au moins 2 articles",
  comparisonCreated:"Comparaison créée",comparisonFailed:"Comparaison échouée",aiRequestFailed:"Demande AI échouée",renameFailed:"Échec du renommage",deleteFailed:"Échec de la suppression",
  openOrStartNew:"Ouvrez une comparaison depuis le panneau ou commencez-en une nouvelle.",compareFollowupPlaceholder:"Posez une question de suivi…",renameComparison:"Renommer la comparaison",deleteComparisonConfirm:"Supprimer cette comparaison?",
  insightsTitle:"Perspectives",insightsSubtitle:"Votre activité de recherche en un coup d'œil.",recentPapers:"Articles récents",recentQuestions:"Questions récentes",
  papersUploaded:"Articles téléversés",questionsAsked:"Questions posées",avgPerPaper:"Moy. questions",uploadToGetStarted:"Téléversez un article pour commencer.",askFirstQuestion:"Posez votre première question AI.",
  settingsTitle:"Paramètres",settingsSubtitle:"Gérez votre compte et vos données.",account:"Compte",memberSince:"Membre depuis",papers:"Articles",
  currentPassword:"Mot de passe actuel",confirmPassword:"Confirmer le nouveau mot de passe",updatePassword:"Mettre à jour le mot de passe",
  dangerZone:"Zone dangereuse",dangerZoneBody:"Supprimez définitivement tous les articles et conversations.",deleteAllPapers:"Supprimer tous les articles",deleteAllConfirm:"Supprimer TOUS vos articles? Irréversible.",allPapersDeleted:"Tous les articles supprimés",passwordDoesNotMeet:"Le mot de passe ne satisfait pas les exigences",
  student:"Étudiant",researcher:"Chercheur",reviewer:"Relecteur",professor:"Professeur",mode:"Mode",currentMode:"Mode actuel",switchedToMode:"Basculé vers",
  modeDescription_student:"Explications simples et réponses orientées examens.",modeDescription_researcher:"Profondeur technique et analyse orientée recherche.",modeDescription_reviewer:"Analyse critique, notation et recommandation.",modeDescription_professor:"Questions de soutenance, travaux futurs, lacunes.",
  readAloud:"Lire à voix haute",pause:"Pause",resume:"Reprendre",stop:"Arrêter",voiceSettings:"Paramètres vocaux",speed:"Vitesse",voice:"Voix",auto:"Auto",
  citationPanel:"Citation",authors:"Auteurs",year:"Année",venue:"Lieu",pages:"Pages",copy:"Copier",copied:"Copié",download:"Télécharger",citationCopied:"citation copiée",
  researchQualityScore:"Score de qualité de recherche",novelty:"Nouveauté",impact:"Impact",methodology:"Méthodologie",dataset:"Ensemble de données",citationQuality:"Citations",overall:"Global",
  excellent:"Excellent — Très publiable",good:"Bon — Contribution solide",fair:"Correct — Améliorations nécessaires",weak:"Faible — Révision majeure requise",
  knowledgeGraphTitle:"Graphe de connaissances",keyword:"mot-clé",author:"auteur",concept:"concept",algorithm:"algorithme",
  language:"Langue",or:"ou",summary:"Résumé",gaps:"Lacunes",vivaPrep:"Prép. soutenance",ppt:"PPT",projectConverter:"Projet",
};

// ─── Translation map ────────────────────────────────────────────────────────
type TranslationMap = Record<LangCode, Translations>;

const TRANSLATIONS: TranslationMap = {
  en: EN, hi: HI, kn: KN,
  ta: HI,  // Telugu-family fallback (Gemini prompt handles actual language)
  te: HI,
  ml: HI,
  mr: HI,
  gu: HI,
  pa: HI,
  bn: HI,
  ur: HI,
  es: ES,
  fr: FR,
  de: EN,  // Gemini prompt handles German
  it: EN,
  pt: EN,
  ru: EN,
  zh: EN,
  ja: EN,
  ko: EN,
  ar: EN,
  tr: EN,
  th: EN,
  vi: EN,
  id: EN,
};

// ─── Context ────────────────────────────────────────────────────────────────
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
    (key: TranslationKey): string =>
      TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key,
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

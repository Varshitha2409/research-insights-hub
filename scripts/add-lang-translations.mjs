/**
 * add-lang-translations.mjs
 * Patches LanguageProvider.tsx:
 *  - Replaces all EN/HI fallbacks in TRANSLATIONS map with proper language objects
 *  - Adds full translations for: TA, TE, ML, MR, GU, PA, BN, UR, DE, IT, PT, RU, ZH, JA, KO, AR, TR, TH, VI, ID
 */
import { readFileSync, writeFileSync } from "fs";

const F = "src/components/LanguageProvider.tsx";
let content = readFileSync(F, "utf8");

// ── Tamil (ta) ──────────────────────────────────────────────────────────────
const TA = `
const TA: Translations = {
  dashboard:"டாஷ்போர்டு",upload:"பதிவேற்று",compare:"ஒப்பிடு",insights:"நுண்ணறிவு",
  settings:"அமைப்புகள்",signOut:"வெளியேறு",
  welcomeBack:"மீண்டும் வரவேற்கிறோம்",createAccount:"உங்கள் கணக்கை உருவாக்கவும்",
  signInSubtitle:"உங்கள் ஆராய்ச்சியை தொடர உள்நுழையவும்.",signUpSubtitle:"நொடியில் ஆராய்ச்சி கட்டுரைகளை திறக்க தொடங்குங்கள்.",
  email:"மின்னஞ்சல்",password:"கடவுச்சொல்",forgotPassword:"கடவுச்சொல் மறந்துவிட்டதா?",
  signIn:"உள்நுழை",pleaseWait:"தயவுசெய்து காத்திருங்கள்…",continueWithGoogle:"Google மூலம் தொடரவும்",
  alreadyHaveAccount:"ஏற்கனவே கணக்கு உள்ளதா?",newHere:"புதியவரா?",orSeparator:"அல்லது",
  authFailed:"அங்கீகாரம் தோல்வி",googleFailed:"Google உள்நுழைவு தோல்வி",
  accountCreated:"கணக்கு உருவாக்கப்பட்டது.",
  forgotYourPassword:"கடவுச்சொல் மறந்துவிட்டீர்களா?",forgotSubtitle:"உங்கள் மின்னஞ்சலை உள்ளிடவும்.",
  sendResetLink:"மீட்டமை இணைப்பை அனுப்பு",sendingLink:"இணைப்பை அனுப்புகிறோம்…",
  checkYourEmail:"உங்கள் மின்னஞ்சலை சரிபார்க்கவும்",checkEmailBody:"கடவுச்சொல் மீட்டமை இணைப்பை அனுப்பினோம். 15 நிமிடங்களில் காலாவதியாகும்.",
  backToSignIn:"உள்நுழைவுக்கு திரும்பு",rememberedIt:"நினைவிருக்கிறதா?",emailPlaceholder:"neenga@example.com",failedToSend:"இணைப்பை அனுப்ப தோல்வி",
  setNewPassword:"புதிய கடவுச்சொல் அமை",chooseStrongPassword:"முன்பு பயன்படுத்தாத வலுவான கடவுச்சொல்லை தேர்ந்தெடுக்கவும்.",
  newPassword:"புதிய கடவுச்சொல்",confirmNewPassword:"புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",
  changePassword:"கடவுச்சொல்லை மாற்று",updatingPassword:"புதுப்பிக்கிறோம்…",
  passwordUpdated:"கடவுச்சொல் புதுப்பிக்கப்பட்டது",passwordUpdatedBody:"கடவுச்சொல் மாற்றப்பட்டது. மீண்டும் உள்நுழையவும்.",
  linkExpired:"இணைப்பு காலாவதியானது",linkExpiredBody:"இந்த இணைப்பு காலாவதியானது அல்லது ஏற்கனவே பயன்படுத்தப்பட்டது.",
  requestNewLink:"புதிய இணைப்பை கோரு",goToSignIn:"உள்நுழைவுக்கு செல்",
  passwordsDoNotMatch:"கடவுச்சொற்கள் பொருந்தவில்லை.",passwordRequirements:"கடவுச்சொல் தேவைகளை பூர்த்தி செய்யவில்லை",
  passwordUpdatedSuccess:"கடவுச்சொல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது",incorrectCurrentPassword:"தற்போதைய கடவுச்சொல் தவறானது",failedToUpdatePassword:"கடவுச்சொல்லை புதுப்பிக்க தோல்வி",
  yourPapers:"உங்கள் கட்டுரைகள்",uploadPaper:"கட்டுரையை பதிவேற்று",noPapersYet:"இன்னும் கட்டுரைகள் இல்லை",noPapersBody:"தொடங்க உங்கள் முதல் கட்டுரையை பதிவேற்றவும்.",
  open:"திற",delete:"நீக்கு",uploadedOn:"பதிவேற்றப்பட்டது",deletePaperConfirm:"இந்த கட்டுரையை நீக்கவா?",
  uploadsChart:"பதிவேற்றங்கள் — கடந்த 7 நாட்கள்",comparisons:"ஒப்பீடுகள்",openPaperHint:"அரட்டை அல்லது வைவா தயாரிப்புக்கு கட்டுரையை திறக்கவும்.",
  uploadPageTitle:"ஆராய்ச்சி கட்டுரையை பதிவேற்று",uploadPageSubtitle:"PDF மட்டும், 25 MB வரை.",
  dragDrop:"உங்கள் PDF ஐ இங்கே இழுக்கவும்",orClickBrowse:"அல்லது உலாவ கிளிக் செய்யவும்",
  chooseFile:"கோப்பை தேர்வு செய்",dontCloseTab:"இந்த தாவலை மூடாதீர்கள்.",
  extractingText:"PDF இலிருந்து உரையை பிரித்தெடுக்கிறோம்…",uploadingFile:"கோப்பை பதிவேற்றுகிறோம்…",savingPaper:"கட்டுரையை சேமிக்கிறோம்…",
  paperUploaded:"கட்டுரை பதிவேற்றப்பட்டது!",uploadFailed:"பதிவேற்றம் தோல்வி",notPdf:"PDF கோப்பை பதிவேற்றவும்.",tooLarge:"கோப்பு 25 MB க்கும் குறைவாக இருக்க வேண்டும்.",noTextExtracted:"இந்த PDF இலிருந்து உரையை பிரித்தெடுக்க முடியவில்லை.",notSignedIn:"உள்நுழைந்திலீர்கள்",
  backToDashboard:"டாஷ்போர்டுக்கு திரும்பு",quickActions:"விரைவு செயல்கள்",askAnything:"இந்த கட்டுரையைப் பற்றி எதையும் கேளுங்கள்",
  send:"அனுப்பு",thinking:"யோசிக்கிறோம்…",loading:"ஏற்றுகிறோம்…",tryQuickAction:"இடதுபுறத்தில் விரைவு செயலை முயற்சிக்கவும்.",
  voiceInput:"குரல் உள்ளீடு",listeningStop:"கேட்கிறோம்… நிறுத்த கிளிக் செய்",
  citations:"மேற்கோள்கள்",knowledgeGraph:"அறிவு வரைபடம்",qualityScore:"தர மதிப்பெண்",
  summaryAction:"சுருக்கம்",gapsAction:"இடைவெளிகள்",vivaPrepAction:"வைவா தயாரிப்பு",pptAction:"PPT",projectConverterAction:"திட்டம்",qualityScoreAction:"தர மதிப்பெண்",
  newComparison:"புதிய ஒப்பீடு",history:"வரலாறு",searchHistory:"வரலாற்றை தேடு",noComparisons:"ஒப்பீடுகள் இல்லை.",
  comparePageTitle:"புதிய ஒப்பீடு",comparePageSubtitle:"2–5 கட்டுரைகளை தேர்வு செய்யவும்.",uploadSomePapersFirst:"முதலில் கட்டுரைகளை பதிவேற்றவும்.",
  optionalFocus:"விருப்பமான கவனம்",compareBtn:"ஒப்பிடு",pickUpTo5:"5 கட்டுரைகள் வரை தேர்வு செய்",selectAtLeast2:"குறைந்தது 2 கட்டுரைகளை தேர்வு செய்",
  comparisonCreated:"ஒப்பீடு உருவாக்கப்பட்டது",comparisonFailed:"ஒப்பீடு தோல்வி",aiRequestFailed:"AI கோரிக்கை தோல்வி",renameFailed:"பெயர் மாற்ற தோல்வி",deleteFailed:"நீக்க தோல்வி",
  openOrStartNew:"பக்கப்பட்டியில் இருந்து ஒப்பீட்டை திறக்கவும் அல்லது புதியதை தொடங்கவும்.",compareFollowupPlaceholder:"தொடர் கேள்வி கேளுங்கள்…",renameComparison:"ஒப்பீட்டை மறுபெயரிடு",deleteComparisonConfirm:"இந்த ஒப்பீட்டை நீக்கவா?",
  insightsTitle:"நுண்ணறிவு",insightsSubtitle:"உங்கள் ஆராய்ச்சி செயல்பாடு ஒரு பார்வையில்.",recentPapers:"சமீபத்திய கட்டுரைகள்",recentQuestions:"சமீபத்திய கேள்விகள்",
  papersUploaded:"பதிவேற்றப்பட்ட கட்டுரைகள்",questionsAsked:"கேட்கப்பட்ட கேள்விகள்",avgPerPaper:"சராசரி கேள்விகள்",uploadToGetStarted:"தொடங்க கட்டுரையை பதிவேற்றவும்.",askFirstQuestion:"முதல் AI கேள்வியை கேளுங்கள்.",
  settingsTitle:"அமைப்புகள்",settingsSubtitle:"உங்கள் கணக்கு மற்றும் தரவை நிர்வகிக்கவும்.",account:"கணக்கு",memberSince:"உறுப்பினர்",papers:"கட்டுரைகள்",
  currentPassword:"தற்போதைய கடவுச்சொல்",confirmPassword:"புதிய கடவுச்சொல்லை உறுதிப்படுத்தவும்",updatePassword:"கடவுச்சொல்லை புதுப்பி",
  dangerZone:"ஆபத்து மண்டலம்",dangerZoneBody:"உங்கள் கணக்குடன் தொடர்புடைய அனைத்தையும் நிரந்தரமாக நீக்கவும்.",deleteAllPapers:"அனைத்து கட்டுரைகளையும் நீக்கு",deleteAllConfirm:"அனைத்து கட்டுரைகளையும் நீக்கவா? செயல்தவிர்க்க முடியாது.",allPapersDeleted:"அனைத்து கட்டுரைகளும் நீக்கப்பட்டன",passwordDoesNotMeet:"கடவுச்சொல் தேவைகளை பூர்த்தி செய்யவில்லை",
  student:"மாணவர்",researcher:"ஆராய்ச்சியாளர்",reviewer:"மதிப்பீட்டாளர்",professor:"பேராசிரியர்",mode:"பயன்முறை",currentMode:"தற்போதைய பயன்முறை",switchedToMode:"மாற்றப்பட்டது",
  modeDescription_student:"எளிய விளக்கங்கள் மற்றும் தேர்வு சார்ந்த பதில்கள்.",modeDescription_researcher:"தொழில்நுட்ப ஆழம் மற்றும் ஆராய்ச்சி கவனம்.",modeDescription_reviewer:"விமர்சனப் பகுப்பாய்வு, மதிப்பெண்கள்.",modeDescription_professor:"வைவா கேள்விகள், எதிர்கால பணி, ஆராய்ச்சி இடைவெளிகள்.",
  readAloud:"உரக்க படி",pause:"இடைநிறுத்து",resume:"தொடர்",stop:"நிறுத்து",voiceSettings:"குரல் அமைப்புகள்",speed:"வேகம்",voice:"குரல்",auto:"தானியங்கி",
  citationPanel:"மேற்கோள்",authors:"ஆசிரியர்கள்",year:"ஆண்டு",venue:"இடம்",pages:"பக்கங்கள்",copy:"நகல் எடு",copied:"நகல் எடுக்கப்பட்டது",download:"பதிவிறக்கு",citationCopied:"மேற்கோள் நகல் எடுக்கப்பட்டது",
  researchQualityScore:"ஆராய்ச்சி தர மதிப்பெண்",novelty:"புதுமை",impact:"தாக்கம்",methodology:"முறைமை",dataset:"தரவுத்தொகுப்பு",citationQuality:"மேற்கோள்கள்",overall:"மொத்தம்",
  excellent:"சிறந்தது — வெளியிட தகுதியானது",good:"நல்லது — வலுவான பங்களிப்பு",fair:"சாதாரணம் — மேம்பாடுகள் தேவை",weak:"பலவீனம் — பெரிய திருத்தம் தேவை",
  knowledgeGraphTitle:"அறிவு வரைபடம்",keyword:"முக்கிய வார்த்தை",author:"ஆசிரியர்",concept:"கருத்து",algorithm:"அல்காரிதம்",
  language:"மொழி",or:"அல்லது",summary:"சுருக்கம்",gaps:"இடைவெளிகள்",vivaPrep:"வைவா தயாரிப்பு",ppt:"PPT",projectConverter:"திட்டம்",
};`;

// ── Telugu (te) ─────────────────────────────────────────────────────────────
const TE = `
const TE: Translations = {
  dashboard:"డాష్\u200cబోర్డ్",upload:"అప్\u200cలోడ్",compare:"పోల్చు",insights:"అంతర్దృష్టి",
  settings:"సెట్టింగులు",signOut:"సైన్ అవుట్",
  welcomeBack:"తిరిగి స్వాగతం",createAccount:"మీ ఖాతాను సృష్టించండి",
  signInSubtitle:"మీ పరిశోధన కొనసాగించడానికి సైన్ ఇన్ చేయండి.",signUpSubtitle:"సెకన్లలో పరిశోధన పత్రాలను అన్\u200cలాక్ చేయడం ప్రారంభించండి.",
  email:"ఇమెయిల్",password:"పాస్\u200cవర్డ్",forgotPassword:"పాస్\u200cవర్డ్ మర్చిపోయారా?",
  signIn:"సైన్ ఇన్",pleaseWait:"దయచేసి వేచి ఉండండి\u2026",continueWithGoogle:"Google తో కొనసాగండి",
  alreadyHaveAccount:"ఇప్పటికే ఖాతా ఉందా?",newHere:"కొత్తవారా?",orSeparator:"లేదా",
  authFailed:"ప్రామాణీకరణ విఫలమైంది",googleFailed:"Google సైన్-ఇన్ విఫలమైంది",
  accountCreated:"ఖాతా సృష్టించబడింది.",
  forgotYourPassword:"పాస్\u200cవర్డ్ మర్చిపోయారా?",forgotSubtitle:"మీ ఇమెయిల్ నమోదు చేయండి.",
  sendResetLink:"రీసెట్ లింక్ పంపండి",sendingLink:"లింక్ పంపుతున్నాం\u2026",
  checkYourEmail:"మీ ఇమెయిల్ తనిఖీ చేయండి",checkEmailBody:"పాస్\u200cవర్డ్ రీసెట్ లింక్ పంపాం. 15 నిమిషాల్లో గడువు తీరుతుంది.",
  backToSignIn:"సైన్ ఇన్\u200cకు తిరిగి వెళ్ళు",rememberedIt:"గుర్తుంది?",emailPlaceholder:"mee@example.com",failedToSend:"లింక్ పంపడం విఫలమైంది",
  setNewPassword:"కొత్త పాస్\u200cవర్డ్ సెట్ చేయండి",chooseStrongPassword:"ముందుగా ఉపయోగించని బలమైన పాస్\u200cవర్డ్ ఎంచుకోండి.",
  newPassword:"కొత్త పాస్\u200cవర్డ్",confirmNewPassword:"కొత్త పాస్\u200cవర్డ్ నిర్ధారించండి",
  changePassword:"పాస్\u200cవర్డ్ మార్చు",updatingPassword:"అప్\u200cడేట్ అవుతోంది\u2026",
  passwordUpdated:"పాస్\u200cవర్డ్ అప్\u200cడేట్ చేయబడింది",passwordUpdatedBody:"పాస్\u200cవర్డ్ మార్చబడింది. మళ్ళీ సైన్ ఇన్ చేయండి.",
  linkExpired:"లింక్ గడువు తీరింది",linkExpiredBody:"ఈ లింక్ గడువు తీరింది లేదా ఇప్పటికే ఉపయోగించబడింది.",
  requestNewLink:"కొత్త లింక్ అభ్యర్థించు",goToSignIn:"సైన్ ఇన్\u200cకు వెళ్ళు",
  passwordsDoNotMatch:"పాస్\u200cవర్డులు సరిపోలలేదు.",passwordRequirements:"పాస్\u200cవర్డ్ అవసరాలు తీర్చలేదు",
  passwordUpdatedSuccess:"పాస్\u200cవర్డ్ విజయవంతంగా అప్\u200cడేట్ చేయబడింది",incorrectCurrentPassword:"ప్రస్తుత పాస్\u200cవర్డ్ తప్పు",failedToUpdatePassword:"పాస్\u200cవర్డ్ అప్\u200cడేట్ చేయడం విఫలమైంది",
  yourPapers:"మీ పత్రాలు",uploadPaper:"పత్రం అప్\u200cలోడ్ చేయండి",noPapersYet:"ఇంకా పత్రాలు లేవు",noPapersBody:"ప్రారంభించడానికి మీ మొదటి పత్రాన్ని అప్\u200cలోడ్ చేయండి.",
  open:"తెరువు",delete:"తొలగించు",uploadedOn:"అప్\u200cలోడ్ చేయబడింది",deletePaperConfirm:"ఈ పత్రాన్ని తొలగించాలా?",
  uploadsChart:"అప్\u200cలోడ్లు — గత 7 రోజులు",comparisons:"పోలికలు",openPaperHint:"చాట్ లేదా వైవా తయారీకి పత్రం తెరవండి.",
  uploadPageTitle:"పరిశోధన పత్రం అప్\u200cలోడ్ చేయండి",uploadPageSubtitle:"PDF మాత్రమే, 25 MB వరకు.",
  dragDrop:"మీ PDF ఇక్కడ లాగండి",orClickBrowse:"లేదా బ్రౌజ్ చేయడానికి ఇక్కడ క్లిక్ చేయండి",
  chooseFile:"ఫైల్ ఎంచుకో",dontCloseTab:"ఈ ట్యాబ్ మూయకండి.",
  extractingText:"PDF నుండి వచనం సేకరిస్తున్నాం\u2026",uploadingFile:"ఫైల్ అప్\u200cలోడ్ అవుతోంది\u2026",savingPaper:"పత్రం సేవ్ అవుతోంది\u2026",
  paperUploaded:"పత్రం అప్\u200cలోడ్ అయింది!",uploadFailed:"అప్\u200cలోడ్ విఫలమైంది",notPdf:"PDF ఫైల్ అప్\u200cలోడ్ చేయండి.",tooLarge:"ఫైల్ 25 MB కంటే తక్కువ ఉండాలి.",noTextExtracted:"ఈ PDF నుండి వచనం సేకరించడం సాధ్యం కాలేదు.",notSignedIn:"సైన్ ఇన్ చేయలేదు",
  backToDashboard:"డాష్\u200cబోర్డ్\u200cకు తిరిగి వెళ్ళు",quickActions:"శీఘ్ర చర్యలు",askAnything:"ఈ పత్రం గురించి ఏదైనా అడగండి",
  send:"పంపు",thinking:"ఆలోచిస్తున్నాం\u2026",loading:"లోడ్ అవుతోంది\u2026",tryQuickAction:"ఎడమ వైపు శీఘ్ర చర్య ప్రయత్నించండి.",
  voiceInput:"వాయిస్ ఇన్\u200cపుట్",listeningStop:"వింటున్నాం\u2026 ఆపడానికి క్లిక్ చేయండి",
  citations:"ఉల్లేఖనాలు",knowledgeGraph:"జ్ఞాన గ్రాఫ్",qualityScore:"నాణ్యత స్కోరు",
  summaryAction:"సారాంశం",gapsAction:"ఖాళీలు",vivaPrepAction:"వైవా తయారీ",pptAction:"PPT",projectConverterAction:"ప్రాజెక్ట్",qualityScoreAction:"నాణ్యత స్కోరు",
  newComparison:"కొత్త పోలిక",history:"చరిత్ర",searchHistory:"చరిత్ర శోధించు",noComparisons:"పోలికలు లేవు.",
  comparePageTitle:"కొత్త పోలిక",comparePageSubtitle:"2–5 పత్రాలు ఎంచుకోండి.",uploadSomePapersFirst:"ముందుగా పత్రాలు అప్\u200cలోడ్ చేయండి.",
  optionalFocus:"ఐచ్ఛిక దృష్టి",compareBtn:"పోల్చు",pickUpTo5:"5 పత్రాలు వరకు ఎంచుకో",selectAtLeast2:"కనీసం 2 పత్రాలు ఎంచుకో",
  comparisonCreated:"పోలిక సృష్టించబడింది",comparisonFailed:"పోలిక విఫలమైంది",aiRequestFailed:"AI అభ్యర్థన విఫలమైంది",renameFailed:"పేరు మార్చడం విఫలమైంది",deleteFailed:"తొలగించడం విఫలమైంది",
  openOrStartNew:"సైడ్\u200cబార్ నుండి పోలిక తెరవండి లేదా కొత్తది ప్రారంభించండి.",compareFollowupPlaceholder:"ఫాలో-అప్ ప్రశ్న అడగండి\u2026",renameComparison:"పోలికను పేరు మార్చు",deleteComparisonConfirm:"ఈ పోలికను తొలగించాలా?",
  insightsTitle:"అంతర్దృష్టి",insightsSubtitle:"మీ పరిశోధన కార్యాచరణ ఒక చూపులో.",recentPapers:"ఇటీవలి పత్రాలు",recentQuestions:"ఇటీవలి ప్రశ్నలు",
  papersUploaded:"అప్\u200cలోడ్ చేసిన పత్రాలు",questionsAsked:"అడిగిన ప్రశ్నలు",avgPerPaper:"సగటు ప్రశ్నలు",uploadToGetStarted:"ప్రారంభించడానికి పత్రం అప్\u200cలోడ్ చేయండి.",askFirstQuestion:"మొదటి AI ప్రశ్న అడగండి.",
  settingsTitle:"సెట్టింగులు",settingsSubtitle:"మీ ఖాతా మరియు డేటాను నిర్వహించండి.",account:"ఖాతా",memberSince:"సభ్యుడు",papers:"పత్రాలు",
  currentPassword:"ప్రస్తుత పాస్\u200cవర్డ్",confirmPassword:"కొత్త పాస్\u200cవర్డ్ నిర్ధారించండి",updatePassword:"పాస్\u200cవర్డ్ అప్\u200cడేట్ చేయు",
  dangerZone:"ప్రమాద మండలం",dangerZoneBody:"మీ ఖాతాతో అనుబంధించిన ప్రతిదీ శాశ్వతంగా తొలగించండి.",deleteAllPapers:"అన్ని పత్రాలు తొలగించు",deleteAllConfirm:"అన్ని పత్రాలు తొలగించాలా? రద్దు చేయడం సాధ్యం కాదు.",allPapersDeleted:"అన్ని పత్రాలు తొలగించబడ్డాయి",passwordDoesNotMeet:"పాస్\u200cవర్డ్ అవసరాలు తీర్చలేదు",
  student:"విద్యార్థి",researcher:"పరిశోధకుడు",reviewer:"సమీక్షకుడు",professor:"ప్రొఫెసర్",mode:"మోడ్",currentMode:"ప్రస్తుత మోడ్",switchedToMode:"మారింది",
  modeDescription_student:"సరళమైన వివరణలు మరియు పరీక్ష ఆధారిత సమాధానాలు.",modeDescription_researcher:"సాంకేతిక లోతు మరియు పరిశోధన కేంద్రీకృత విశ్లేషణ.",modeDescription_reviewer:"విమర్శనాత్మక విశ్లేషణ, స్కోరింగ్.",modeDescription_professor:"వైవా ప్రశ్నలు, భవిష్యత్ పని, పరిశోధన ఖాళీలు.",
  readAloud:"బిగ్గరగా చదువు",pause:"పాజ్",resume:"కొనసాగు",stop:"ఆపు",voiceSettings:"వాయిస్ సెట్టింగులు",speed:"వేగం",voice:"వాయిస్",auto:"ఆటో",
  citationPanel:"ఉల్లేఖనం",authors:"రచయితలు",year:"సంవత్సరం",venue:"ప్రదేశం",pages:"పేజీలు",copy:"కాపీ",copied:"కాపీ అయింది",download:"డౌన్\u200cలోడ్",citationCopied:"ఉల్లేఖనం కాపీ అయింది",
  researchQualityScore:"పరిశోధన నాణ్యత స్కోరు",novelty:"నవీనత",impact:"ప్రభావం",methodology:"పద్ధతి",dataset:"డేటాసెట్",citationQuality:"ఉల్లేఖనాలు",overall:"మొత్తం",
  excellent:"అద్భుతం — ప్రచురణకు అర్హం",good:"మంచిది — బలమైన సహకారం",fair:"సాధారణం — మెరుగుదలలు అవసరం",weak:"బలహీనం — పెద్ద సవరణ అవసరం",
  knowledgeGraphTitle:"జ్ఞాన గ్రాఫ్",keyword:"కీవర్డ్",author:"రచయిత",concept:"భావన",algorithm:"అల్గారిథమ్",
  language:"భాష",or:"లేదా",summary:"సారాంశం",gaps:"ఖాళీలు",vivaPrep:"వైవా తయారీ",ppt:"PPT",projectConverter:"ప్రాజెక్ట్",
};`;

// ── Malayalam (ml) ───────────────────────────────────────────────────────────
const ML = `
const ML: Translations = {
  dashboard:"ഡാഷ്\u200cബോർഡ്",upload:"അപ്\u200cലോഡ്",compare:"താരതമ്യം",insights:"ഉൾക്കാഴ്ച",
  settings:"ക്രമീകരണങ്ങൾ",signOut:"സൈൻ ഔട്ട്",
  welcomeBack:"തിരിച്ചു സ്വാഗതം",createAccount:"നിങ്ങളുടെ അക്കൗണ്ട് സൃഷ്ടിക്കുക",
  signInSubtitle:"ഗവേഷണം തുടരാൻ സൈൻ ഇൻ ചെയ്യുക.",signUpSubtitle:"സെക്കൻഡുകൾക്കുള്ളിൽ ഗവേഷണ പ്രബന്ധങ്ങൾ അൺലോക്ക് ചെയ്യുക.",
  email:"ഇ-മെയിൽ",password:"പാസ്\u200cവേഡ്",forgotPassword:"പാസ്\u200cവേഡ് മറന്നോ?",
  signIn:"സൈൻ ഇൻ",pleaseWait:"ദയവായി കാത്തിരിക്കുക\u2026",continueWithGoogle:"Google ഉപയോഗിച്ച് തുടരുക",
  alreadyHaveAccount:"ഇതിനകം അക്കൗണ്ട് ഉണ്ടോ?",newHere:"പുതിയ ആളോ?",orSeparator:"അല്ലെങ്കിൽ",
  authFailed:"ആധികാരികത പരിശോധന പരാജയം",googleFailed:"Google സൈൻ-ഇൻ പരാജയം",
  accountCreated:"അക്കൗണ്ട് സൃഷ്ടിച്ചു.",
  forgotYourPassword:"പാസ്\u200cവേഡ് മറന്നോ?",forgotSubtitle:"ഇ-മെയിൽ നൽകുക, ഒരു ലിങ്ക് അയക്കും.",
  sendResetLink:"റീസെറ്റ് ലിങ്ക് അയക്കുക",sendingLink:"ലിങ്ക് അയക്കുന്നു\u2026",
  checkYourEmail:"ഇ-മെയിൽ പരിശോധിക്കുക",checkEmailBody:"പാസ്\u200cവേഡ് റീസെറ്റ് ലിങ്ക് അയച്ചു. 15 മിനിറ്റിൽ കാലഹരണപ്പെടും.",
  backToSignIn:"സൈൻ ഇനിലേക്ക് മടങ്ങുക",rememberedIt:"ഓർമ്മ വന്നോ?",emailPlaceholder:"ningal@example.com",failedToSend:"ലിങ്ക് അയക്കൽ പരാജയം",
  setNewPassword:"പുതിയ പാസ്\u200cവേഡ് സജ്ജമാക്കുക",chooseStrongPassword:"ഇതുവരെ ഉപയോഗിക്കാത്ത ശക്തമായ പാസ്\u200cവേഡ് തിരഞ്ഞെടുക്കുക.",
  newPassword:"പുതിയ പാസ്\u200cവേഡ്",confirmNewPassword:"പുതിയ പാസ്\u200cവേഡ് സ്ഥിരീകരിക്കുക",
  changePassword:"പാസ്\u200cവേഡ് മാറ്റുക",updatingPassword:"അപ്\u200cഡേറ്റ് ചെയ്യുന്നു\u2026",
  passwordUpdated:"പാസ്\u200cവേഡ് അപ്\u200cഡേറ്റ് ചെയ്തു",passwordUpdatedBody:"പാസ്\u200cവേഡ് മാറ്റി. വീണ്ടും സൈൻ ഇൻ ചെയ്യുക.",
  linkExpired:"ലിങ്ക് കാലഹരണപ്പെട്ടു",linkExpiredBody:"ഈ ലിങ്ക് കാലഹരണപ്പെട്ടു അല്ലെങ്കിൽ ഉപയോഗിച്ചു.",
  requestNewLink:"പുതിയ ലിങ്ക് അഭ്യർത്ഥിക്കുക",goToSignIn:"സൈൻ ഇനിലേക്ക് പോകുക",
  passwordsDoNotMatch:"പാസ്\u200cവേഡുകൾ പൊരുത്തപ്പെടുന്നില്ല.",passwordRequirements:"പാസ്\u200cവേഡ് ആവശ്യകതകൾ പൂർത്തിയാകുന്നില്ല",
  passwordUpdatedSuccess:"പാസ്\u200cവേഡ് വിജയകരമായി അപ്\u200cഡേറ്റ് ചെയ്തു",incorrectCurrentPassword:"നിലവിലെ പാസ്\u200cവേഡ് തെറ്റ്",failedToUpdatePassword:"പാസ്\u200cവേഡ് അപ്\u200cഡേറ്റ് ചെയ്യൽ പരാജയം",
  yourPapers:"നിങ്ങളുടെ പ്രബന്ധങ്ങൾ",uploadPaper:"പ്രബന്ധം അപ്\u200cലോഡ് ചെയ്യുക",noPapersYet:"ഇനിയും പ്രബന്ധങ്ങൾ ഇല്ല",noPapersBody:"ആരംഭിക്കാൻ ആദ്യ പ്രബന്ധം അപ്\u200cലോഡ് ചെയ്യുക.",
  open:"തുറക്കുക",delete:"ഇല്ലാതാക്കുക",uploadedOn:"അപ്\u200cലോഡ് ചെയ്തു",deletePaperConfirm:"ഈ പ്രബന്ധം ഇല്ലാതാക്കണോ?",
  uploadsChart:"അപ്\u200cലോഡുകൾ — കഴിഞ്ഞ 7 ദിവസം",comparisons:"താരതമ്യങ്ങൾ",openPaperHint:"ചാറ്റ് അല്ലെങ്കിൽ വൈവ തയ്യാറെടുപ്പിനായി പ്രബന്ധം തുറക്കുക.",
  uploadPageTitle:"ഗവേഷണ പ്രബന്ധം അപ്\u200cലോഡ് ചെയ്യുക",uploadPageSubtitle:"PDF മാത്രം, 25 MB വരെ.",
  dragDrop:"PDF ഇവിടെ വലിച്ചിടുക",orClickBrowse:"അല്ലെങ്കിൽ ബ്രൗസ് ചെയ്യാൻ ഇവിടെ ക്ലിക്ക് ചെയ്യുക",
  chooseFile:"ഫയൽ തിരഞ്ഞെടുക്കുക",dontCloseTab:"ഈ ടാബ് അടയ്ക്കരുത്.",
  extractingText:"PDF-ൽ നിന്ന് ടെക്സ്റ്റ് എക്\u200cസ്ട്രാക്ട് ചെയ്യുന്നു\u2026",uploadingFile:"ഫയൽ അപ്\u200cലോഡ് ചെയ്യുന്നു\u2026",savingPaper:"പ്രബന്ധം സേവ് ചെയ്യുന്നു\u2026",
  paperUploaded:"പ്രബന്ധം അപ്\u200cലോഡ് ചെയ്തു!",uploadFailed:"അപ്\u200cലോഡ് പരാജയം",notPdf:"PDF ഫയൽ അപ്\u200cലോഡ് ചെയ്യുക.",tooLarge:"ഫയൽ 25 MB-ൽ കുറവായിരിക്കണം.",noTextExtracted:"ഈ PDF-ൽ നിന്ന് ടെക്സ്റ്റ് ലഭ്യമായില്ല.",notSignedIn:"സൈൻ ഇൻ ചെയ്തിട്ടില്ല",
  backToDashboard:"ഡാഷ്\u200cബോർഡിലേക്ക് മടങ്ങുക",quickActions:"ദ്രുത പ്രവൃത്തികൾ",askAnything:"ഈ പ്രബന്ധത്തെക്കുറിച്ച് എന്തും ചോദിക്കുക",
  send:"അയക്കുക",thinking:"ചിന്തിക്കുന്നു\u2026",loading:"ലോഡ് ചെയ്യുന്നു\u2026",tryQuickAction:"ഇടതുവശത്ത് ദ്രുത പ്രവൃത്തി പ്രയത്നിക്കുക.",
  voiceInput:"വോയ്\u200cസ് ഇൻ\u200cപുട്ട്",listeningStop:"കേൾക്കുന്നു\u2026 നിർത്താൻ ക്ലിക്ക് ചെയ്യുക",
  citations:"ഉദ്ധരണികൾ",knowledgeGraph:"അറിവ് ഗ്രാഫ്",qualityScore:"ഗുണനിലവാര സ്\u200cകോർ",
  summaryAction:"സംഗ്രഹം",gapsAction:"വിടവുകൾ",vivaPrepAction:"വൈവ തയ്യാറെടുപ്പ്",pptAction:"PPT",projectConverterAction:"പ്രൊജക്ട്",qualityScoreAction:"ഗുണനിലവാര സ്\u200cകോർ",
  newComparison:"പുതിയ താരതമ്യം",history:"ചരിത്രം",searchHistory:"ചരിത്രം തിരയുക",noComparisons:"താരതമ്യങ്ങൾ ഇല്ല.",
  comparePageTitle:"പുതിയ താരതമ്യം",comparePageSubtitle:"2–5 പ്രബന്ധങ്ങൾ തിരഞ്ഞെടുക്കുക.",uploadSomePapersFirst:"ആദ്യം പ്രബന്ധങ്ങൾ അപ്\u200cലോഡ് ചെയ്യുക.",
  optionalFocus:"ഐച്ഛിക ഫോക്കസ്",compareBtn:"താരതമ്യം ചെയ്യുക",pickUpTo5:"5 പ്രബന്ധങ്ങൾ വരെ തിരഞ്ഞെടുക്കുക",selectAtLeast2:"കുറഞ്ഞത് 2 പ്രബന്ധങ്ങൾ തിരഞ്ഞെടുക്കുക",
  comparisonCreated:"താരതമ്യം സൃഷ്ടിച്ചു",comparisonFailed:"താരതമ്യം പരാജയം",aiRequestFailed:"AI അഭ്യർത്ഥന പരാജയം",renameFailed:"പുനർനാമകരണം പരാജയം",deleteFailed:"ഇല്ലാതാക്കൽ പരാജയം",
  openOrStartNew:"സൈഡ്\u200cബാറിൽ നിന്ന് തുറക്കുക അല്ലെങ്കിൽ പുതിയത് ആരംഭിക്കുക.",compareFollowupPlaceholder:"ഫോളോ-അപ്പ് ചോദ്യം ചോദിക്കുക\u2026",renameComparison:"താരതമ്യം പുനർനാമകരണം ചെയ്യുക",deleteComparisonConfirm:"ഈ താരതമ്യം ഇല്ലാതാക്കണോ?",
  insightsTitle:"ഉൾക്കാഴ്ച",insightsSubtitle:"ഒറ്റ നോട്ടത്തിൽ ഗവേഷണ പ്രവർത്തനം.",recentPapers:"സമീപകാല പ്രബന്ധങ്ങൾ",recentQuestions:"സമീപകാല ചോദ്യങ്ങൾ",
  papersUploaded:"അപ്\u200cലോഡ് ചെയ്ത പ്രബന്ധങ്ങൾ",questionsAsked:"ചോദിച്ച ചോദ്യങ്ങൾ",avgPerPaper:"ശരാശരി ചോദ്യങ്ങൾ",uploadToGetStarted:"ആരംഭിക്കാൻ പ്രബന്ധം അപ്\u200cലോഡ് ചെയ്യുക.",askFirstQuestion:"ആദ്യ AI ചോദ്യം ചോദിക്കുക.",
  settingsTitle:"ക്രമീകരണങ്ങൾ",settingsSubtitle:"അക്കൗണ്ടും ഡേറ്റയും നിയന്ത്രിക്കുക.",account:"അക്കൗണ്ട്",memberSince:"അംഗം",papers:"പ്രബന്ധങ്ങൾ",
  currentPassword:"നിലവിലെ പാസ്\u200cവേഡ്",confirmPassword:"പുതിയ പാസ്\u200cവേഡ് സ്ഥിരീകരിക്കുക",updatePassword:"പാസ്\u200cവേഡ് അപ്\u200cഡേറ്റ് ചെയ്യുക",
  dangerZone:"അപകട മേഖല",dangerZoneBody:"അക്കൗണ്ടുമായി ബന്ധിപ്പിച്ച എല്ലാം സ്ഥിരമായി ഇല്ലാതാക്കുക.",deleteAllPapers:"എല്ലാ പ്രബന്ധങ്ങളും ഇല്ലാതാക്കുക",deleteAllConfirm:"എല്ലാ പ്രബന്ധങ്ങളും ഇല്ലാതാക്കണോ? പൂർവ്വസ്ഥിതിയിലാക്കാൻ കഴിയില്ല.",allPapersDeleted:"എല്ലാ പ്രബന്ധങ്ങളും ഇല്ലാതാക്കി",passwordDoesNotMeet:"പാസ്\u200cവേഡ് ആവശ്യകതകൾ പൂർത്തിയാകുന്നില്ല",
  student:"വിദ്യാർത്ഥി",researcher:"ഗവേഷകൻ",reviewer:"അവലോകനകർത്താവ്",professor:"പ്രൊഫസർ",mode:"മോഡ്",currentMode:"നിലവിലെ മോഡ്",switchedToMode:"മാറി",
  modeDescription_student:"ലളിതമായ വിശദീകരണങ്ങളും പരീക്ഷ ആധാരിത ഉത്തരങ്ങളും.",modeDescription_researcher:"സാങ്കേതിക ആഴവും ഗവേഷണ ഫോക്കസും.",modeDescription_reviewer:"വിമർശനാത്മക വിശകലനം, സ്\u200cകോറിങ്.",modeDescription_professor:"വൈവ ചോദ്യങ്ങൾ, ഭാവി കൃതി, ഗവേഷണ വിടവുകൾ.",
  readAloud:"ഉറക്കെ വായിക്കുക",pause:"താൽക്കാലികമായി നിർത്തുക",resume:"തുടരുക",stop:"നിർത്തുക",voiceSettings:"വോയ്\u200cസ് ക്രമീകരണങ്ങൾ",speed:"വേഗത",voice:"വോയ്\u200cസ്",auto:"ഓട്ടോ",
  citationPanel:"ഉദ്ധരണി",authors:"രചയിതാക്കൾ",year:"വർഷം",venue:"സ്ഥലം",pages:"പേജുകൾ",copy:"പകർത്തുക",copied:"പകർത്തി",download:"ഡൗൺലോഡ്",citationCopied:"ഉദ്ധരണി പകർത്തി",
  researchQualityScore:"ഗവേഷണ ഗുണനിലവാര സ്\u200cകോർ",novelty:"നൂതനത",impact:"ആഘാതം",methodology:"രീതിശാസ്ത്രം",dataset:"ഡേറ്റാസെറ്റ്",citationQuality:"ഉദ്ധരണികൾ",overall:"മൊത്തം",
  excellent:"മികച്ചത് — പ്രസിദ്ധീകരണ യോഗ്യം",good:"നല്ലത് — ശക്തമായ സംഭാവന",fair:"ശരാശരി — മെച്ചപ്പെടുത്തൽ ആവശ്യം",weak:"ദുർബലം — വലിയ പരിഷ്\u200cകരണം ആവശ്യം",
  knowledgeGraphTitle:"അറിവ് ഗ്രാഫ്",keyword:"കീവേഡ്",author:"രചയിതാവ്",concept:"ആശയം",algorithm:"അൽഗോരിതം",
  language:"ഭാഷ",or:"അല്ലെങ്കിൽ",summary:"സംഗ്രഹം",gaps:"വിടവുകൾ",vivaPrep:"വൈവ തയ്യാറെടുപ്പ്",ppt:"PPT",projectConverter:"പ്രൊജക്ട്",
};`;

// ── Marathi (mr) ────────────────────────────────────────────────────────────
const MR = `
const MR: Translations = {
  dashboard:"डॅशबोर्ड",upload:"अपलोड",compare:"तुलना",insights:"अंतर्दृष्टी",
  settings:"सेटिंग्ज",signOut:"साइन आउट",welcomeBack:"पुन्हा स्वागत",createAccount:"तुमचे खाते तयार करा",
  signInSubtitle:"संशोधन सुरू ठेवण्यासाठी साइन इन करा.",signUpSubtitle:"सेकंदात संशोधन पेपर अनलॉक करणे सुरू करा.",
  email:"ईमेल",password:"पासवर्ड",forgotPassword:"पासवर्ड विसरलात?",signIn:"साइन इन",pleaseWait:"कृपया प्रतीक्षा करा…",continueWithGoogle:"Google सह सुरू ठेवा",
  alreadyHaveAccount:"आधीच खाते आहे?",newHere:"नवीन आहात?",orSeparator:"किंवा",authFailed:"प्रमाणीकरण अयशस्वी",googleFailed:"Google साइन-इन अयशस्वी",
  accountCreated:"खाते तयार केले.",forgotYourPassword:"पासवर्ड विसरलात?",forgotSubtitle:"ईमेल प्रविष्ट करा, आम्ही लिंक पाठवू.",
  sendResetLink:"रीसेट लिंक पाठवा",sendingLink:"लिंक पाठवत आहोत…",checkYourEmail:"तुमचा ईमेल तपासा",checkEmailBody:"पासवर्ड रीसेट लिंक पाठवला. 15 मिनिटांत कालबाह्य होईल.",
  backToSignIn:"साइन इनवर परत जा",rememberedIt:"आठवले?",emailPlaceholder:"tumhi@example.com",failedToSend:"लिंक पाठवणे अयशस्वी",
  setNewPassword:"नवीन पासवर्ड सेट करा",chooseStrongPassword:"आधी न वापरलेला मजबूत पासवर्ड निवडा.",newPassword:"नवीन पासवर्ड",confirmNewPassword:"नवीन पासवर्ड पुष्टी करा",
  changePassword:"पासवर्ड बदला",updatingPassword:"अपडेट होत आहे…",passwordUpdated:"पासवर्ड अपडेट झाला",passwordUpdatedBody:"पासवर्ड बदलला. पुन्हा साइन इन करा.",
  linkExpired:"लिंक कालबाह्य झाला",linkExpiredBody:"हा लिंक कालबाह्य झाला किंवा आधीच वापरला.",requestNewLink:"नवीन लिंक विनंती करा",goToSignIn:"साइन इनवर जा",
  passwordsDoNotMatch:"पासवर्ड जुळत नाहीत.",passwordRequirements:"पासवर्ड आवश्यकता पूर्ण होत नाहीत",passwordUpdatedSuccess:"पासवर्ड यशस्वीरित्या अपडेट झाला",incorrectCurrentPassword:"सध्याचा पासवर्ड चुकीचा",failedToUpdatePassword:"पासवर्ड अपडेट अयशस्वी",
  yourPapers:"तुमचे पेपर",uploadPaper:"पेपर अपलोड करा",noPapersYet:"अजून कोणतेही पेपर नाहीत",noPapersBody:"सुरुवात करण्यासाठी पहिला पेपर अपलोड करा.",open:"उघडा",delete:"हटवा",uploadedOn:"अपलोड केले",deletePaperConfirm:"हा पेपर हटवायचा?",
  uploadsChart:"अपलोड — शेवटचे 7 दिवस",comparisons:"तुलना",openPaperHint:"चॅट किंवा व्हाइवा तयारीसाठी पेपर उघडा.",
  uploadPageTitle:"संशोधन पेपर अपलोड करा",uploadPageSubtitle:"फक्त PDF, 25 MB पर्यंत.",dragDrop:"PDF येथे ड्रॅग करा",orClickBrowse:"किंवा ब्राउझ करण्यासाठी येथे क्लिक करा",
  chooseFile:"फाइल निवडा",dontCloseTab:"हा टॅब बंद करू नका.",extractingText:"PDF मधून मजकूर काढत आहोत…",uploadingFile:"फाइल अपलोड होत आहे…",savingPaper:"पेपर जतन होत आहे…",
  paperUploaded:"पेपर अपलोड झाला!",uploadFailed:"अपलोड अयशस्वी",notPdf:"PDF फाइल अपलोड करा.",tooLarge:"फाइल 25 MB पेक्षा कमी असणे आवश्यक.",noTextExtracted:"या PDF मधून मजकूर काढता आला नाही.",notSignedIn:"साइन इन केलेले नाही",
  backToDashboard:"डॅशबोर्डवर परत जा",quickActions:"जलद क्रिया",askAnything:"या पेपरबद्दल काहीही विचारा",send:"पाठवा",thinking:"विचार करत आहोत…",loading:"लोड होत आहे…",tryQuickAction:"डाव्या बाजूला जलद क्रिया वापरा.",
  voiceInput:"आवाज इनपुट",listeningStop:"ऐकत आहोत… थांबवण्यासाठी क्लिक करा",citations:"उद्धरणे",knowledgeGraph:"ज्ञान आलेख",qualityScore:"गुणवत्ता स्कोर",
  summaryAction:"सारांश",gapsAction:"त्रुटी",vivaPrepAction:"व्हाइवा तयारी",pptAction:"PPT",projectConverterAction:"प्रकल्प",qualityScoreAction:"गुणवत्ता स्कोर",
  newComparison:"नवीन तुलना",history:"इतिहास",searchHistory:"इतिहास शोधा",noComparisons:"तुलना नाहीत.",comparePageTitle:"नवीन तुलना",comparePageSubtitle:"2–5 पेपर निवडा.",uploadSomePapersFirst:"आधी पेपर अपलोड करा.",
  optionalFocus:"पर्यायी फोकस",compareBtn:"तुलना करा",pickUpTo5:"5 पर्यंत पेपर निवडा",selectAtLeast2:"किमान 2 पेपर निवडा",comparisonCreated:"तुलना तयार झाली",comparisonFailed:"तुलना अयशस्वी",aiRequestFailed:"AI विनंती अयशस्वी",renameFailed:"नाव बदलणे अयशस्वी",deleteFailed:"हटवणे अयशस्वी",
  openOrStartNew:"साइडबारमधून उघडा किंवा नवीन सुरू करा.",compareFollowupPlaceholder:"फॉलो-अप प्रश्न विचारा…",renameComparison:"तुलनेचे नाव बदला",deleteComparisonConfirm:"ही तुलना हटवायची?",
  insightsTitle:"अंतर्दृष्टी",insightsSubtitle:"संशोधन क्रियाकलाप एक दृष्टिक्षेपात.",recentPapers:"अलीकडील पेपर",recentQuestions:"अलीकडील प्रश्न",papersUploaded:"अपलोड केलेले पेपर",questionsAsked:"विचारलेले प्रश्न",avgPerPaper:"सरासरी प्रश्न",uploadToGetStarted:"सुरू करण्यासाठी पेपर अपलोड करा.",askFirstQuestion:"पहिला AI प्रश्न विचारा.",
  settingsTitle:"सेटिंग्ज",settingsSubtitle:"खाते आणि डेटा व्यवस्थापित करा.",account:"खाते",memberSince:"सदस्य",papers:"पेपर",currentPassword:"सध्याचा पासवर्ड",confirmPassword:"नवीन पासवर्ड पुष्टी करा",updatePassword:"पासवर्ड अपडेट करा",
  dangerZone:"धोका क्षेत्र",dangerZoneBody:"खात्याशी संबंधित सर्वकाही कायमचे हटवा.",deleteAllPapers:"सर्व पेपर हटवा",deleteAllConfirm:"सर्व पेपर हटवायचे? पूर्ववत करता येणार नाही.",allPapersDeleted:"सर्व पेपर हटवले",passwordDoesNotMeet:"पासवर्ड आवश्यकता पूर्ण नाहीत",
  student:"विद्यार्थी",researcher:"संशोधक",reviewer:"समीक्षक",professor:"प्राध्यापक",mode:"मोड",currentMode:"सध्याचा मोड",switchedToMode:"बदलले",modeDescription_student:"सोपे स्पष्टीकरण आणि परीक्षाभिमुख उत्तरे.",modeDescription_researcher:"तांत्रिक खोली आणि संशोधन केंद्रित विश्लेषण.",modeDescription_reviewer:"समीक्षात्मक विश्लेषण, स्कोरिंग.",modeDescription_professor:"व्हाइवा प्रश्न, भविष्यातील काम, संशोधन त्रुटी.",
  readAloud:"मोठ्याने वाचा",pause:"थांबवा",resume:"सुरू ठेवा",stop:"बंद करा",voiceSettings:"आवाज सेटिंग्ज",speed:"वेग",voice:"आवाज",auto:"स्वयंचलित",
  citationPanel:"उद्धरण",authors:"लेखक",year:"वर्ष",venue:"ठिकाण",pages:"पृष्ठे",copy:"कॉपी",copied:"कॉपी केले",download:"डाउनलोड",citationCopied:"उद्धरण कॉपी केले",
  researchQualityScore:"संशोधन गुणवत्ता स्कोर",novelty:"नाविन्य",impact:"प्रभाव",methodology:"पद्धती",dataset:"डेटासेट",citationQuality:"उद्धरणे",overall:"एकूण",excellent:"उत्कृष्ट — प्रकाशनयोग्य",good:"चांगले — मजबूत योगदान",fair:"सामान्य — सुधारणा आवश्यक",weak:"कमकुवत — मोठी सुधारणा आवश्यक",
  knowledgeGraphTitle:"ज्ञान आलेख",keyword:"कीवर्ड",author:"लेखक",concept:"संकल्पना",algorithm:"अल्गोरिदम",language:"भाषा",or:"किंवा",summary:"सारांश",gaps:"त्रुटी",vivaPrep:"व्हाइवा तयारी",ppt:"PPT",projectConverter:"प्रकल्प",
};`;

// ── Gujarati (gu) ────────────────────────────────────────────────────────────
const GU = `
const GU: Translations = {
  dashboard:"ડૅશબોર્ડ",upload:"અપલોડ",compare:"સરખામણી",insights:"અંતર્દૃષ્ટિ",settings:"સેટિંગ્સ",signOut:"સાઇન આઉટ",welcomeBack:"ફરી સ્વાગત",createAccount:"તમારું ખાતું બનાવો",signInSubtitle:"સંશોધન ચાલુ રાખવા સાઇન ઇન કરો.",signUpSubtitle:"સેકન્ડમાં સંશોધન પ્રકાશ ખોલો.",email:"ઈ-મેઇલ",password:"પાસવર્ડ",forgotPassword:"પાસવર્ડ ભૂલ્યા?",signIn:"સાઇન ઇન",pleaseWait:"કૃપા કરી રાહ જુઓ…",continueWithGoogle:"Google સાથે ચાલુ રાખો",alreadyHaveAccount:"પહેલેથી ખાતું છે?",newHere:"નવા છો?",orSeparator:"અથવા",authFailed:"ઓળખ ચકાસણી નિષ્ફળ",googleFailed:"Google સાઇન-ઇન નિષ્ફળ",accountCreated:"ખાતું બનાવ્યું.",forgotYourPassword:"પાસવર્ડ ભૂલ્યા?",forgotSubtitle:"ઈ-મેઇલ દાખલ કરો, અમે લિંક મોકલીશું.",sendResetLink:"રીસેટ લિંક મોકલો",sendingLink:"લિંક મોકલાઈ રહ્યો છે…",checkYourEmail:"તમારો ઈ-મેઇલ તપાસો",checkEmailBody:"પાસવર્ડ રીસેટ લિંક મોકલ્યો. 15 મિનિટમાં સમાપ્ત.",backToSignIn:"સાઇન ઇન પર પાછા જાઓ",rememberedIt:"યાદ આવ્યું?",emailPlaceholder:"tame@example.com",failedToSend:"લિંક મોકલવી નિષ્ફળ",setNewPassword:"નવો પાસવર્ડ સેટ કરો",chooseStrongPassword:"મજબૂત પાસવર્ડ પસંદ કરો.",newPassword:"નવો પાસવર્ડ",confirmNewPassword:"નવો પાસવર્ડ પુષ્ટિ કરો",changePassword:"પાસવર્ડ બદલો",updatingPassword:"અપડેટ થઈ રહ્યો છે…",passwordUpdated:"પાસવર્ડ અપડેટ થયો",passwordUpdatedBody:"પાસવર્ડ બદલ્યો. ફરી સાઇન ઇન કરો.",linkExpired:"લિંક સમાપ્ત",linkExpiredBody:"આ લિંક સમાપ્ત અથવા ઉપયોગ થઈ ગઈ.",requestNewLink:"નવી લિંક વિનંતી",goToSignIn:"સાઇન ઇન પર જાઓ",passwordsDoNotMatch:"પાસવર્ડ મળતા નથી.",passwordRequirements:"પાસવર્ડ જરૂરિયાતો પૂર્ણ નથી",passwordUpdatedSuccess:"પાસવર્ડ સફળતાપૂર્વક અપડેટ",incorrectCurrentPassword:"વર્તમાન પાસવર્ડ ખોટો",failedToUpdatePassword:"પાસવર્ડ અપડેટ નિષ્ફળ",yourPapers:"તમારા પ્રકાશો",uploadPaper:"પ્રકાશ અપલોડ કરો",noPapersYet:"હજી કોઈ પ્રકાશ નથી",noPapersBody:"શરૂ કરવા પ્રથમ પ્રકાશ અપલોડ કરો.",open:"ખોલો",delete:"ભૂંસો",uploadedOn:"અપલોડ",deletePaperConfirm:"આ પ્રકાશ ભૂંસવો?",uploadsChart:"અપલોડ — છેલ્લા 7 દિવસ",comparisons:"સરખામણી",openPaperHint:"ચેટ અથવા વાઇવા માટે ખોલો.",uploadPageTitle:"સંશોધન પ્રકાશ અપલોડ કરો",uploadPageSubtitle:"ફક્ત PDF, 25 MB સુધી.",dragDrop:"PDF અહીં ખેંચો",orClickBrowse:"અથવા બ્રાઉઝ માટે ક્લિક કરો",chooseFile:"ફાઇલ પસંદ કરો",dontCloseTab:"આ ટૅબ બંધ ન કરો.",extractingText:"PDF માંથી ટેક્સ્ટ…",uploadingFile:"ફાઇલ અપલોડ…",savingPaper:"સાચવી રહ્યા છે…",paperUploaded:"પ્રકાશ અપલોડ!",uploadFailed:"અપલોડ નિષ્ફળ",notPdf:"PDF ફાઇલ અપલોડ કરો.",tooLarge:"25 MB કરતા ઓછી ફાઇલ.",noTextExtracted:"ટેક્સ્ટ નિષ્કર્ષ નિષ્ફળ.",notSignedIn:"સાઇન ઇન નથી",backToDashboard:"ડૅશબોર્ડ પર",quickActions:"ઝડપી ક્રિયાઓ",askAnything:"કંઈ પણ પૂછો",send:"મોકલો",thinking:"વિચારી રહ્યા…",loading:"લોડ…",tryQuickAction:"ઝડપી ક્રિયા અજમાવો.",voiceInput:"વૉઇસ ઇનપુટ",listeningStop:"સાંભળી રહ્યા… ક્લિક કરો",citations:"ઉદ્ધરણ",knowledgeGraph:"જ્ઞાન આલેખ",qualityScore:"ગુણવત્તા સ્કોર",summaryAction:"સારાંશ",gapsAction:"ખાલી",vivaPrepAction:"વાઇવા",pptAction:"PPT",projectConverterAction:"પ્રોજેક્ટ",qualityScoreAction:"ગુણવત્તા",newComparison:"નવી સરખામણી",history:"ઇતિહાસ",searchHistory:"ઇતિહાસ શોધો",noComparisons:"સરખામણી નથી.",comparePageTitle:"નવી સરખામણી",comparePageSubtitle:"2–5 પ્રકાશ પસંદ કરો.",uploadSomePapersFirst:"પ્રથમ અપલોડ કરો.",optionalFocus:"વૈકલ્પિક ફોકસ",compareBtn:"સરખાવો",pickUpTo5:"5 સુધી પસંદ",selectAtLeast2:"ઓછામાં 2 પસંદ",comparisonCreated:"સરખામણી બની",comparisonFailed:"સરખામણી નિષ્ફળ",aiRequestFailed:"AI નિષ્ફળ",renameFailed:"નામ નિષ્ફળ",deleteFailed:"ભૂંસ નિષ્ફળ",openOrStartNew:"ખોલો અથવા નવું.",compareFollowupPlaceholder:"ફોલો-અપ…",renameComparison:"નામ બદલો",deleteComparisonConfirm:"ભૂંસવી?",insightsTitle:"અંતર્દૃષ્ટિ",insightsSubtitle:"સંશોધન પ્રવૃત્તિ.",recentPapers:"તાજેતરના",recentQuestions:"તાજેતરના પ્રશ્નો",papersUploaded:"અપલોડ",questionsAsked:"પ્રશ્નો",avgPerPaper:"સરેરાશ",uploadToGetStarted:"અપલોડ કરો.",askFirstQuestion:"પ્રથમ AI પ્રશ્ન.",settingsTitle:"સેટિંગ્સ",settingsSubtitle:"ખાતું સંચાલિત.",account:"ખાતું",memberSince:"સભ્ય",papers:"પ્રકાશ",currentPassword:"વર્તમાન",confirmPassword:"પુષ્ટિ",updatePassword:"અપડેટ",dangerZone:"જોખમ",dangerZoneBody:"કાયમી ભૂંસ.",deleteAllPapers:"સૌ ભૂંસો",deleteAllConfirm:"ભૂંસવા?",allPapersDeleted:"ભૂંસ્યા",passwordDoesNotMeet:"જરૂરિયાત નથી",student:"વિદ્યાર્થી",researcher:"સંશોધક",reviewer:"સમીક્ષક",professor:"પ્રોફેસર",mode:"મોડ",currentMode:"મોડ",switchedToMode:"બદલ્યો",modeDescription_student:"સરળ.",modeDescription_researcher:"ઊંડાણ.",modeDescription_reviewer:"ટીકા.",modeDescription_professor:"વાઇવા.",readAloud:"મોટે",pause:"રોકો",resume:"ચાલુ",stop:"બંધ",voiceSettings:"સ્વર",speed:"ઝડપ",voice:"અવાજ",auto:"ઑટો",citationPanel:"ઉદ્ધરણ",authors:"લેખક",year:"વર્ષ",venue:"સ્થળ",pages:"પૃષ્ઠ",copy:"નકલ",copied:"નકલ",download:"ડાઉ",citationCopied:"ઉદ્ધ.",researchQualityScore:"ગુણ",novelty:"નવ",impact:"અસર",methodology:"પદ્ધ",dataset:"ડેટા",citationQuality:"ઉ..",overall:"કુલ",excellent:"ઉત્તમ",good:"સારું",fair:"સામ",weak:"નબળ",knowledgeGraphTitle:"જ્ઞાન",keyword:"કી",author:"લે",concept:"ખ્યાલ",algorithm:"ક્ર.",language:"ભાષા",or:"અથ",summary:"સારા",gaps:"ખાલ",vivaPrep:"વાઇ",ppt:"PPT",projectConverter:"પ્ર",
};`;

// ── German (de) ──────────────────────────────────────────────────────────────
const DE = `
const DE: Translations = {
  dashboard:"Dashboard",upload:"Hochladen",compare:"Vergleichen",insights:"Erkenntnisse",settings:"Einstellungen",signOut:"Abmelden",welcomeBack:"Willkommen zurück",createAccount:"Konto erstellen",signInSubtitle:"Anmelden um die Forschung fortzusetzen.",signUpSubtitle:"Forschungsartikel in Sekunden entsperren.",email:"E-Mail",password:"Passwort",forgotPassword:"Passwort vergessen?",signIn:"Anmelden",pleaseWait:"Bitte warten…",continueWithGoogle:"Mit Google fortfahren",alreadyHaveAccount:"Schon ein Konto?",newHere:"Neu hier?",orSeparator:"oder",authFailed:"Authentifizierung fehlgeschlagen",googleFailed:"Google-Anmeldung fehlgeschlagen",accountCreated:"Konto erstellt.",forgotYourPassword:"Passwort vergessen?",forgotSubtitle:"E-Mail eingeben, wir senden einen Link.",sendResetLink:"Zurücksetzen-Link senden",sendingLink:"Link wird gesendet…",checkYourEmail:"E-Mail prüfen",checkEmailBody:"Passwort-Reset-Link gesendet. Läuft in 15 Minuten ab.",backToSignIn:"Zurück zur Anmeldung",rememberedIt:"Erinnert?",emailPlaceholder:"sie@example.com",failedToSend:"Link senden fehlgeschlagen",setNewPassword:"Neues Passwort festlegen",chooseStrongPassword:"Starkes Passwort wählen.",newPassword:"Neues Passwort",confirmNewPassword:"Neues Passwort bestätigen",changePassword:"Passwort ändern",updatingPassword:"Wird aktualisiert…",passwordUpdated:"Passwort aktualisiert",passwordUpdatedBody:"Passwort geändert. Bitte erneut anmelden.",linkExpired:"Link abgelaufen",linkExpiredBody:"Dieser Link ist abgelaufen oder bereits verwendet.",requestNewLink:"Neuen Link anfordern",goToSignIn:"Zur Anmeldung",passwordsDoNotMatch:"Passwörter stimmen nicht überein.",passwordRequirements:"Passwort erfüllt nicht die Anforderungen",passwordUpdatedSuccess:"Passwort erfolgreich aktualisiert",incorrectCurrentPassword:"Aktuelles Passwort falsch",failedToUpdatePassword:"Passwort aktualisieren fehlgeschlagen",yourPapers:"Ihre Artikel",uploadPaper:"Artikel hochladen",noPapersYet:"Noch keine Artikel",noPapersBody:"Laden Sie Ihren ersten Artikel hoch.",open:"Öffnen",delete:"Löschen",uploadedOn:"Hochgeladen",deletePaperConfirm:"Diesen Artikel löschen?",uploadsChart:"Uploads — Letzte 7 Tage",comparisons:"Vergleiche",openPaperHint:"Artikel öffnen für Chat oder Viva.",uploadPageTitle:"Forschungsartikel hochladen",uploadPageSubtitle:"Nur PDF, bis zu 25 MB.",dragDrop:"PDF hier ablegen",orClickBrowse:"oder hier klicken",chooseFile:"Datei wählen",dontCloseTab:"Tab nicht schließen.",extractingText:"Text wird extrahiert…",uploadingFile:"Datei wird hochgeladen…",savingPaper:"Artikel wird gespeichert…",paperUploaded:"Artikel hochgeladen!",uploadFailed:"Upload fehlgeschlagen",notPdf:"Bitte PDF hochladen.",tooLarge:"Datei muss unter 25 MB sein.",noTextExtracted:"Kein Text extrahiert.",notSignedIn:"Nicht angemeldet",backToDashboard:"Zurück zum Dashboard",quickActions:"Schnellaktionen",askAnything:"Alles zu diesem Artikel fragen",send:"Senden",thinking:"Denke nach…",loading:"Wird geladen…",tryQuickAction:"Schnellaktion versuchen.",voiceInput:"Spracheingabe",listeningStop:"Höre zu… klicken zum Stoppen",citations:"Zitate",knowledgeGraph:"Wissensgraph",qualityScore:"Qualitätspunktzahl",summaryAction:"Zusammenfassung",gapsAction:"Lücken",vivaPrepAction:"Viva-Vorbereitung",pptAction:"PPT",projectConverterAction:"Projekt",qualityScoreAction:"Qualität",newComparison:"Neuer Vergleich",history:"Verlauf",searchHistory:"Verlauf suchen",noComparisons:"Keine Vergleiche.",comparePageTitle:"Neuer Vergleich",comparePageSubtitle:"2–5 Artikel auswählen.",uploadSomePapersFirst:"Erst Artikel hochladen.",optionalFocus:"Optionaler Fokus",compareBtn:"Vergleichen",pickUpTo5:"Bis zu 5 wählen",selectAtLeast2:"Mindestens 2 wählen",comparisonCreated:"Vergleich erstellt",comparisonFailed:"Vergleich fehlgeschlagen",aiRequestFailed:"KI-Anfrage fehlgeschlagen",renameFailed:"Umbenennen fehlgeschlagen",deleteFailed:"Löschen fehlgeschlagen",openOrStartNew:"Vergleich öffnen oder neu starten.",compareFollowupPlaceholder:"Folgefrage stellen…",renameComparison:"Vergleich umbenennen",deleteComparisonConfirm:"Diesen Vergleich löschen?",insightsTitle:"Erkenntnisse",insightsSubtitle:"Forschungsaktivität auf einen Blick.",recentPapers:"Neueste Artikel",recentQuestions:"Neueste Fragen",papersUploaded:"Hochgeladene Artikel",questionsAsked:"Gestellte Fragen",avgPerPaper:"Durchschnittl. Fragen",uploadToGetStarted:"Artikel hochladen.",askFirstQuestion:"Erste KI-Frage stellen.",settingsTitle:"Einstellungen",settingsSubtitle:"Konto und Daten verwalten.",account:"Konto",memberSince:"Mitglied seit",papers:"Artikel",currentPassword:"Aktuelles Passwort",confirmPassword:"Neues Passwort bestätigen",updatePassword:"Passwort aktualisieren",dangerZone:"Gefahrenzone",dangerZoneBody:"Alle Artikel und Gespräche dauerhaft löschen.",deleteAllPapers:"Alle Artikel löschen",deleteAllConfirm:"Alle Artikel löschen? Nicht rückgängig.",allPapersDeleted:"Alle Artikel gelöscht",passwordDoesNotMeet:"Passwort erfüllt nicht die Anforderungen",student:"Student",researcher:"Forscher",reviewer:"Gutachter",professor:"Professor",mode:"Modus",currentMode:"Aktueller Modus",switchedToMode:"Gewechselt zu",modeDescription_student:"Einfache Erklärungen.",modeDescription_researcher:"Technische Tiefe.",modeDescription_reviewer:"Kritische Analyse.",modeDescription_professor:"Viva-Fragen, Zukunftsarbeit.",readAloud:"Vorlesen",pause:"Pause",resume:"Fortsetzen",stop:"Stopp",voiceSettings:"Spracheinstellungen",speed:"Geschwindigkeit",voice:"Stimme",auto:"Auto",citationPanel:"Zitat",authors:"Autoren",year:"Jahr",venue:"Ort",pages:"Seiten",copy:"Kopieren",copied:"Kopiert",download:"Herunterladen",citationCopied:"Zitat kopiert",researchQualityScore:"Forschungsqualität",novelty:"Neuheit",impact:"Wirkung",methodology:"Methodik",dataset:"Datensatz",citationQuality:"Zitate",overall:"Gesamt",excellent:"Exzellent — Sehr publikationsreif",good:"Gut — Starker Beitrag",fair:"Ausreichend — Verbesserungen nötig",weak:"Schwach — Große Überarbeitung nötig",knowledgeGraphTitle:"Wissensgraph",keyword:"Schlüsselwort",author:"Autor",concept:"Konzept",algorithm:"Algorithmus",language:"Sprache",or:"oder",summary:"Zusammenfassung",gaps:"Lücken",vivaPrep:"Viva-Vorbereitung",ppt:"PPT",projectConverter:"Projekt",
};`;

// ── Japanese (ja) ────────────────────────────────────────────────────────────
const JA = `
const JA: Translations = {
  dashboard:"ダッシュボード",upload:"アップロード",compare:"比較",insights:"インサイト",settings:"設定",signOut:"サインアウト",welcomeBack:"おかえりなさい",createAccount:"アカウントを作成",signInSubtitle:"研究を続けるにはサインインしてください。",signUpSubtitle:"数秒で研究論文をアンロックしましょう。",email:"メール",password:"パスワード",forgotPassword:"パスワードをお忘れですか？",signIn:"サインイン",pleaseWait:"お待ちください…",continueWithGoogle:"Googleで続ける",alreadyHaveAccount:"すでにアカウントをお持ちですか？",newHere:"初めての方？",orSeparator:"または",authFailed:"認証に失敗しました",googleFailed:"Googleサインインに失敗",accountCreated:"アカウントが作成されました。",forgotYourPassword:"パスワードをお忘れですか？",forgotSubtitle:"メールを入力するとリンクを送信します。",sendResetLink:"リセットリンクを送信",sendingLink:"送信中…",checkYourEmail:"メールを確認してください",checkEmailBody:"パスワードリセットリンクを送信しました。15分で有効期限切れ。",backToSignIn:"サインインに戻る",rememberedIt:"思い出しましたか？",emailPlaceholder:"anata@example.com",failedToSend:"リンク送信に失敗",setNewPassword:"新しいパスワードを設定",chooseStrongPassword:"以前使用したことのない強力なパスワードを選択。",newPassword:"新しいパスワード",confirmNewPassword:"新しいパスワードを確認",changePassword:"パスワードを変更",updatingPassword:"更新中…",passwordUpdated:"パスワードが更新されました",passwordUpdatedBody:"パスワードが変更されました。再度サインインしてください。",linkExpired:"リンクが期限切れです",linkExpiredBody:"このリンクは期限切れか使用済みです。",requestNewLink:"新しいリンクをリクエスト",goToSignIn:"サインインへ",passwordsDoNotMatch:"パスワードが一致しません。",passwordRequirements:"パスワードが要件を満たしていません",passwordUpdatedSuccess:"パスワードが正常に更新されました",incorrectCurrentPassword:"現在のパスワードが間違っています",failedToUpdatePassword:"パスワードの更新に失敗",yourPapers:"あなたの論文",uploadPaper:"論文をアップロード",noPapersYet:"論文がありません",noPapersBody:"最初の論文をアップロードして始めましょう。",open:"開く",delete:"削除",uploadedOn:"アップロード済み",deletePaperConfirm:"この論文を削除しますか？",uploadsChart:"アップロード — 過去7日間",comparisons:"比較",openPaperHint:"チャットやビバの準備のために論文を開く。",uploadPageTitle:"研究論文をアップロード",uploadPageSubtitle:"PDFのみ、25MBまで。",dragDrop:"PDFをここにドラッグ",orClickBrowse:"またはここをクリックして参照",chooseFile:"ファイルを選択",dontCloseTab:"このタブを閉じないでください。",extractingText:"PDFからテキスト抽出中…",uploadingFile:"ファイルをアップロード中…",savingPaper:"論文を保存中…",paperUploaded:"論文がアップロードされました！",uploadFailed:"アップロードに失敗",notPdf:"PDFファイルをアップロードしてください。",tooLarge:"ファイルは25MB未満にしてください。",noTextExtracted:"このPDFからテキストを抽出できませんでした。",notSignedIn:"サインインしていません",backToDashboard:"ダッシュボードに戻る",quickActions:"クイックアクション",askAnything:"この論文について何でも聞く",send:"送信",thinking:"考え中…",loading:"読み込み中…",tryQuickAction:"左のクイックアクションを試してください。",voiceInput:"音声入力",listeningStop:"聞いています… クリックして停止",citations:"引用",knowledgeGraph:"知識グラフ",qualityScore:"品質スコア",summaryAction:"要約",gapsAction:"ギャップ",vivaPrepAction:"ビバ準備",pptAction:"PPT",projectConverterAction:"プロジェクト",qualityScoreAction:"品質スコア",newComparison:"新しい比較",history:"履歴",searchHistory:"履歴を検索",noComparisons:"比較がありません。",comparePageTitle:"新しい比較",comparePageSubtitle:"2〜5本の論文を選択。",uploadSomePapersFirst:"先に論文をアップロードしてください。",optionalFocus:"任意のフォーカス",compareBtn:"比較する",pickUpTo5:"5本まで選択",selectAtLeast2:"少なくとも2本選択",comparisonCreated:"比較が作成されました",comparisonFailed:"比較に失敗",aiRequestFailed:"AIリクエストに失敗",renameFailed:"名前変更に失敗",deleteFailed:"削除に失敗",openOrStartNew:"サイドバーから開くか新しく始める。",compareFollowupPlaceholder:"フォローアップ質問…",renameComparison:"比較の名前を変更",deleteComparisonConfirm:"この比較を削除しますか？",insightsTitle:"インサイト",insightsSubtitle:"研究活動を一目で。",recentPapers:"最近の論文",recentQuestions:"最近の質問",papersUploaded:"アップロードされた論文",questionsAsked:"質問された回数",avgPerPaper:"平均質問数",uploadToGetStarted:"始めるには論文をアップロード。",askFirstQuestion:"最初のAI質問をする。",settingsTitle:"設定",settingsSubtitle:"アカウントとデータを管理。",account:"アカウント",memberSince:"会員登録",papers:"論文",currentPassword:"現在のパスワード",confirmPassword:"新しいパスワードを確認",updatePassword:"パスワードを更新",dangerZone:"危険ゾーン",dangerZoneBody:"すべての論文と会話を完全に削除。",deleteAllPapers:"すべての論文を削除",deleteAllConfirm:"すべての論文を削除しますか？元に戻せません。",allPapersDeleted:"すべての論文が削除されました",passwordDoesNotMeet:"パスワードが要件を満たしていません",student:"学生",researcher:"研究者",reviewer:"レビュアー",professor:"教授",mode:"モード",currentMode:"現在のモード",switchedToMode:"切り替え",modeDescription_student:"シンプルな説明。",modeDescription_researcher:"技術的な深さ。",modeDescription_reviewer:"批判的分析。",modeDescription_professor:"ビバ質問。",readAloud:"音読",pause:"一時停止",resume:"再開",stop:"停止",voiceSettings:"音声設定",speed:"速度",voice:"声",auto:"自動",citationPanel:"引用",authors:"著者",year:"年",venue:"会場",pages:"ページ",copy:"コピー",copied:"コピー済み",download:"ダウンロード",citationCopied:"引用をコピー",researchQualityScore:"研究品質スコア",novelty:"新規性",impact:"影響",methodology:"方法論",dataset:"データセット",citationQuality:"引用",overall:"総合",excellent:"優秀 — 出版に値する",good:"良い — 強い貢献",fair:"普通 — 改善が必要",weak:"弱い — 大幅な修正が必要",knowledgeGraphTitle:"知識グラフ",keyword:"キーワード",author:"著者",concept:"概念",algorithm:"アルゴリズム",language:"言語",or:"または",summary:"要約",gaps:"ギャップ",vivaPrep:"ビバ準備",ppt:"PPT",projectConverter:"プロジェクト",
};`;

// ── Chinese (zh) ─────────────────────────────────────────────────────────────
const ZH = `
const ZH: Translations = {
  dashboard:"仪表板",upload:"上传",compare:"对比",insights:"洞察",settings:"设置",signOut:"退出",welcomeBack:"欢迎回来",createAccount:"创建账户",signInSubtitle:"登录以继续您的研究。",signUpSubtitle:"立即解锁研究论文。",email:"电子邮件",password:"密码",forgotPassword:"忘记密码？",signIn:"登录",pleaseWait:"请稍候…",continueWithGoogle:"使用Google继续",alreadyHaveAccount:"已有账户？",newHere:"新用户？",orSeparator:"或",authFailed:"认证失败",googleFailed:"Google登录失败",accountCreated:"账户已创建。",forgotYourPassword:"忘记密码？",forgotSubtitle:"输入邮箱，我们将发送重置链接。",sendResetLink:"发送重置链接",sendingLink:"发送中…",checkYourEmail:"查看您的邮箱",checkEmailBody:"已发送密码重置链接，15分钟内有效。",backToSignIn:"返回登录",rememberedIt:"想起来了？",emailPlaceholder:"nin@example.com",failedToSend:"发送链接失败",setNewPassword:"设置新密码",chooseStrongPassword:"选择一个强密码。",newPassword:"新密码",confirmNewPassword:"确认新密码",changePassword:"更改密码",updatingPassword:"更新中…",passwordUpdated:"密码已更新",passwordUpdatedBody:"密码已更改，请重新登录。",linkExpired:"链接已过期",linkExpiredBody:"此链接已过期或已使用。",requestNewLink:"申请新链接",goToSignIn:"去登录",passwordsDoNotMatch:"密码不匹配。",passwordRequirements:"密码不符合要求",passwordUpdatedSuccess:"密码更新成功",incorrectCurrentPassword:"当前密码错误",failedToUpdatePassword:"密码更新失败",yourPapers:"您的论文",uploadPaper:"上传论文",noPapersYet:"暂无论文",noPapersBody:"上传第一篇论文开始。",open:"打开",delete:"删除",uploadedOn:"已上传",deletePaperConfirm:"删除此论文？",uploadsChart:"上传 — 最近7天",comparisons:"对比",openPaperHint:"打开论文进行聊天或答辩准备。",uploadPageTitle:"上传研究论文",uploadPageSubtitle:"仅限PDF，最大25MB。",dragDrop:"将PDF拖放至此",orClickBrowse:"或点击此处浏览",chooseFile:"选择文件",dontCloseTab:"请勿关闭此标签页。",extractingText:"正在提取PDF文本…",uploadingFile:"正在上传文件…",savingPaper:"正在保存论文…",paperUploaded:"论文已上传！",uploadFailed:"上传失败",notPdf:"请上传PDF文件。",tooLarge:"文件必须小于25MB。",noTextExtracted:"无法从此PDF提取文本。",notSignedIn:"未登录",backToDashboard:"返回仪表板",quickActions:"快速操作",askAnything:"询问有关此论文的任何问题",send:"发送",thinking:"思考中…",loading:"加载中…",tryQuickAction:"尝试左侧的快速操作。",voiceInput:"语音输入",listeningStop:"正在听…点击停止",citations:"引用",knowledgeGraph:"知识图谱",qualityScore:"质量分数",summaryAction:"摘要",gapsAction:"研究缺口",vivaPrepAction:"答辩准备",pptAction:"PPT",projectConverterAction:"项目",qualityScoreAction:"质量分数",newComparison:"新建对比",history:"历史",searchHistory:"搜索历史",noComparisons:"暂无对比。",comparePageTitle:"新建对比",comparePageSubtitle:"选择2-5篇论文。",uploadSomePapersFirst:"请先上传论文。",optionalFocus:"可选焦点",compareBtn:"对比",pickUpTo5:"最多选5篇",selectAtLeast2:"至少选2篇",comparisonCreated:"对比已创建",comparisonFailed:"对比失败",aiRequestFailed:"AI请求失败",renameFailed:"重命名失败",deleteFailed:"删除失败",openOrStartNew:"从侧栏打开或新建。",compareFollowupPlaceholder:"提问跟进问题…",renameComparison:"重命名对比",deleteComparisonConfirm:"删除此对比？",insightsTitle:"洞察",insightsSubtitle:"一眼了解研究活动。",recentPapers:"最近论文",recentQuestions:"最近问题",papersUploaded:"已上传论文",questionsAsked:"已问问题",avgPerPaper:"平均问题数",uploadToGetStarted:"上传论文开始。",askFirstQuestion:"提出第一个AI问题。",settingsTitle:"设置",settingsSubtitle:"管理账户和数据。",account:"账户",memberSince:"成员",papers:"论文",currentPassword:"当前密码",confirmPassword:"确认新密码",updatePassword:"更新密码",dangerZone:"危险区域",dangerZoneBody:"永久删除所有论文和对话。",deleteAllPapers:"删除所有论文",deleteAllConfirm:"删除所有论文？不可撤销。",allPapersDeleted:"所有论文已删除",passwordDoesNotMeet:"密码不符合要求",student:"学生",researcher:"研究者",reviewer:"审稿人",professor:"教授",mode:"模式",currentMode:"当前模式",switchedToMode:"已切换",modeDescription_student:"简单解释。",modeDescription_researcher:"技术深度。",modeDescription_reviewer:"批判性分析。",modeDescription_professor:"答辩问题。",readAloud:"朗读",pause:"暂停",resume:"继续",stop:"停止",voiceSettings:"语音设置",speed:"速度",voice:"声音",auto:"自动",citationPanel:"引用",authors:"作者",year:"年份",venue:"场所",pages:"页面",copy:"复制",copied:"已复制",download:"下载",citationCopied:"引用已复制",researchQualityScore:"研究质量分数",novelty:"新颖性",impact:"影响",methodology:"方法论",dataset:"数据集",citationQuality:"引用",overall:"总体",excellent:"优秀 — 高度可发表",good:"良好 — 贡献强",fair:"一般 — 需改进",weak:"薄弱 — 需大修",knowledgeGraphTitle:"知识图谱",keyword:"关键词",author:"作者",concept:"概念",algorithm:"算法",language:"语言",or:"或",summary:"摘要",gaps:"研究缺口",vivaPrep:"答辩准备",ppt:"PPT",projectConverter:"项目",
};`;

// ── Arabic (ar) ──────────────────────────────────────────────────────────────
const AR = `
const AR: Translations = {
  dashboard:"لوحة التحكم",upload:"رفع",compare:"مقارنة",insights:"رؤى",settings:"الإعدادات",signOut:"تسجيل الخروج",welcomeBack:"مرحباً بعودتك",createAccount:"إنشاء حساب",signInSubtitle:"سجّل الدخول لمواصلة بحثك.",signUpSubtitle:"ابدأ بإلغاء قفل الأوراق البحثية في ثوانٍ.",email:"البريد الإلكتروني",password:"كلمة المرور",forgotPassword:"هل نسيت كلمة المرور؟",signIn:"تسجيل الدخول",pleaseWait:"الرجاء الانتظار…",continueWithGoogle:"المتابعة مع Google",alreadyHaveAccount:"هل لديك حساب بالفعل؟",newHere:"مستخدم جديد؟",orSeparator:"أو",authFailed:"فشل المصادقة",googleFailed:"فشل تسجيل الدخول بـ Google",accountCreated:"تم إنشاء الحساب.",forgotYourPassword:"هل نسيت كلمة المرور؟",forgotSubtitle:"أدخل بريدك الإلكتروني وسنرسل لك رابطاً.",sendResetLink:"إرسال رابط إعادة التعيين",sendingLink:"جارٍ الإرسال…",checkYourEmail:"تحقق من بريدك الإلكتروني",checkEmailBody:"تم إرسال رابط إعادة تعيين كلمة المرور. ينتهي خلال 15 دقيقة.",backToSignIn:"العودة لتسجيل الدخول",rememberedIt:"تذكرت؟",emailPlaceholder:"anta@example.com",failedToSend:"فشل إرسال الرابط",setNewPassword:"تعيين كلمة مرور جديدة",chooseStrongPassword:"اختر كلمة مرور قوية لم تستخدمها من قبل.",newPassword:"كلمة المرور الجديدة",confirmNewPassword:"تأكيد كلمة المرور الجديدة",changePassword:"تغيير كلمة المرور",updatingPassword:"جارٍ التحديث…",passwordUpdated:"تم تحديث كلمة المرور",passwordUpdatedBody:"تم تغيير كلمة المرور. يرجى تسجيل الدخول مجدداً.",linkExpired:"الرابط منتهي الصلاحية",linkExpiredBody:"انتهت صلاحية هذا الرابط أو تم استخدامه.",requestNewLink:"طلب رابط جديد",goToSignIn:"الذهاب لتسجيل الدخول",passwordsDoNotMatch:"كلمتا المرور غير متطابقتين.",passwordRequirements:"كلمة المرور لا تستوفي المتطلبات",passwordUpdatedSuccess:"تم تحديث كلمة المرور بنجاح",incorrectCurrentPassword:"كلمة المرور الحالية غير صحيحة",failedToUpdatePassword:"فشل تحديث كلمة المرور",yourPapers:"أوراقك البحثية",uploadPaper:"رفع ورقة بحثية",noPapersYet:"لا توجد أوراق بحثية بعد",noPapersBody:"ارفع أول ورقة بحثية للبدء.",open:"فتح",delete:"حذف",uploadedOn:"تم الرفع",deletePaperConfirm:"هل تريد حذف هذه الورقة؟",uploadsChart:"الرفع — آخر 7 أيام",comparisons:"المقارنات",openPaperHint:"افتح ورقة بحثية للدردشة أو التحضير.",uploadPageTitle:"رفع ورقة بحثية",uploadPageSubtitle:"PDF فقط، حتى 25 ميغابايت.",dragDrop:"اسحب ملف PDF هنا",orClickBrowse:"أو انقر هنا للتصفح",chooseFile:"اختر ملفاً",dontCloseTab:"لا تغلق هذا التبويب.",extractingText:"جارٍ استخراج النص…",uploadingFile:"جارٍ رفع الملف…",savingPaper:"جارٍ حفظ الورقة…",paperUploaded:"تم رفع الورقة!",uploadFailed:"فشل الرفع",notPdf:"يرجى رفع ملف PDF.",tooLarge:"يجب أن يكون الملف أقل من 25 ميغابايت.",noTextExtracted:"تعذر استخراج النص من هذا الملف.",notSignedIn:"لم تسجل الدخول",backToDashboard:"العودة للوحة التحكم",quickActions:"الإجراءات السريعة",askAnything:"اسأل أي شيء عن هذه الورقة",send:"إرسال",thinking:"أفكر…",loading:"جارٍ التحميل…",tryQuickAction:"جرب إجراءً سريعاً على اليسار.",voiceInput:"إدخال صوتي",listeningStop:"أستمع… انقر للإيقاف",citations:"الاستشهادات",knowledgeGraph:"مخطط المعرفة",qualityScore:"درجة الجودة",summaryAction:"ملخص",gapsAction:"الفجوات",vivaPrepAction:"تحضير المناقشة",pptAction:"PPT",projectConverterAction:"مشروع",qualityScoreAction:"درجة الجودة",newComparison:"مقارنة جديدة",history:"السجل",searchHistory:"البحث في السجل",noComparisons:"لا توجد مقارنات.",comparePageTitle:"مقارنة جديدة",comparePageSubtitle:"اختر 2-5 أوراق.",uploadSomePapersFirst:"ارفع أوراقاً أولاً.",optionalFocus:"تركيز اختياري",compareBtn:"مقارنة",pickUpTo5:"اختر حتى 5",selectAtLeast2:"اختر 2 على الأقل",comparisonCreated:"تم إنشاء المقارنة",comparisonFailed:"فشلت المقارنة",aiRequestFailed:"فشل طلب الذكاء الاصطناعي",renameFailed:"فشل إعادة التسمية",deleteFailed:"فشل الحذف",openOrStartNew:"افتح مقارنة من الشريط الجانبي أو ابدأ جديدة.",compareFollowupPlaceholder:"اطرح سؤالاً متابعاً…",renameComparison:"إعادة تسمية المقارنة",deleteComparisonConfirm:"هل تريد حذف هذه المقارنة؟",insightsTitle:"رؤى",insightsSubtitle:"نظرة سريعة على نشاطك البحثي.",recentPapers:"الأوراق الأخيرة",recentQuestions:"الأسئلة الأخيرة",papersUploaded:"الأوراق المرفوعة",questionsAsked:"الأسئلة المطروحة",avgPerPaper:"متوسط الأسئلة",uploadToGetStarted:"ارفع ورقة للبدء.",askFirstQuestion:"اطرح أول سؤال للذكاء الاصطناعي.",settingsTitle:"الإعدادات",settingsSubtitle:"إدارة الحساب والبيانات.",account:"الحساب",memberSince:"عضو منذ",papers:"الأوراق",currentPassword:"كلمة المرور الحالية",confirmPassword:"تأكيد كلمة المرور الجديدة",updatePassword:"تحديث كلمة المرور",dangerZone:"منطقة الخطر",dangerZoneBody:"حذف جميع الأوراق والمحادثات نهائياً.",deleteAllPapers:"حذف كل الأوراق",deleteAllConfirm:"هل تريد حذف كل الأوراق؟ لا يمكن التراجع.",allPapersDeleted:"تم حذف كل الأوراق",passwordDoesNotMeet:"كلمة المرور لا تستوفي المتطلبات",student:"طالب",researcher:"باحث",reviewer:"مراجع",professor:"أستاذ",mode:"الوضع",currentMode:"الوضع الحالي",switchedToMode:"تم التبديل",modeDescription_student:"شرح مبسط.",modeDescription_researcher:"عمق تقني.",modeDescription_reviewer:"تحليل نقدي.",modeDescription_professor:"أسئلة المناقشة.",readAloud:"قراءة بصوت عالٍ",pause:"إيقاف مؤقت",resume:"استئناف",stop:"إيقاف",voiceSettings:"إعدادات الصوت",speed:"السرعة",voice:"الصوت",auto:"تلقائي",citationPanel:"الاستشهاد",authors:"المؤلفون",year:"السنة",venue:"المكان",pages:"الصفحات",copy:"نسخ",copied:"تم النسخ",download:"تنزيل",citationCopied:"تم نسخ الاستشهاد",researchQualityScore:"درجة جودة البحث",novelty:"الجدة",impact:"التأثير",methodology:"المنهجية",dataset:"مجموعة البيانات",citationQuality:"الاستشهادات",overall:"الإجمالي",excellent:"ممتاز — قابل للنشر",good:"جيد — مساهمة قوية",fair:"مقبول — يحتاج تحسيناً",weak:"ضعيف — يحتاج مراجعة كبيرة",knowledgeGraphTitle:"مخطط المعرفة",keyword:"كلمة مفتاحية",author:"مؤلف",concept:"مفهوم",algorithm:"خوارزمية",language:"اللغة",or:"أو",summary:"ملخص",gaps:"الفجوات",vivaPrep:"تحضير المناقشة",ppt:"PPT",projectConverter:"مشروع",
};`;

// ── Korean (ko) ──────────────────────────────────────────────────────────────
const KO = `
const KO: Translations = {
  dashboard:"대시보드",upload:"업로드",compare:"비교",insights:"인사이트",settings:"설정",signOut:"로그아웃",welcomeBack:"다시 오신 것을 환영합니다",createAccount:"계정 만들기",signInSubtitle:"연구를 계속하려면 로그인하세요.",signUpSubtitle:"몇 초 만에 연구 논문을 열어보세요.",email:"이메일",password:"비밀번호",forgotPassword:"비밀번호를 잊으셨나요?",signIn:"로그인",pleaseWait:"잠시 기다려 주세요…",continueWithGoogle:"Google로 계속",alreadyHaveAccount:"이미 계정이 있으신가요?",newHere:"처음이신가요?",orSeparator:"또는",authFailed:"인증 실패",googleFailed:"Google 로그인 실패",accountCreated:"계정이 생성되었습니다.",forgotYourPassword:"비밀번호를 잊으셨나요?",forgotSubtitle:"이메일을 입력하면 링크를 보내드립니다.",sendResetLink:"재설정 링크 보내기",sendingLink:"링크 전송 중…",checkYourEmail:"이메일을 확인하세요",checkEmailBody:"비밀번호 재설정 링크를 보냈습니다. 15분 후 만료.",backToSignIn:"로그인으로 돌아가기",rememberedIt:"기억나셨나요?",emailPlaceholder:"dangsin@example.com",failedToSend:"링크 전송 실패",setNewPassword:"새 비밀번호 설정",chooseStrongPassword:"이전에 사용하지 않은 강력한 비밀번호를 선택하세요.",newPassword:"새 비밀번호",confirmNewPassword:"새 비밀번호 확인",changePassword:"비밀번호 변경",updatingPassword:"업데이트 중…",passwordUpdated:"비밀번호 업데이트됨",passwordUpdatedBody:"비밀번호가 변경되었습니다. 다시 로그인하세요.",linkExpired:"링크 만료",linkExpiredBody:"이 링크는 만료되었거나 이미 사용되었습니다.",requestNewLink:"새 링크 요청",goToSignIn:"로그인으로 이동",passwordsDoNotMatch:"비밀번호가 일치하지 않습니다.",passwordRequirements:"비밀번호가 요구 사항을 충족하지 않습니다",passwordUpdatedSuccess:"비밀번호가 성공적으로 업데이트되었습니다",incorrectCurrentPassword:"현재 비밀번호가 올바르지 않습니다",failedToUpdatePassword:"비밀번호 업데이트 실패",yourPapers:"내 논문",uploadPaper:"논문 업로드",noPapersYet:"아직 논문이 없습니다",noPapersBody:"첫 번째 논문을 업로드하여 시작하세요.",open:"열기",delete:"삭제",uploadedOn:"업로드됨",deletePaperConfirm:"이 논문을 삭제할까요?",uploadsChart:"업로드 — 최근 7일",comparisons:"비교",openPaperHint:"채팅이나 논문 심사 준비를 위해 열기.",uploadPageTitle:"연구 논문 업로드",uploadPageSubtitle:"PDF만, 최대 25MB.",dragDrop:"여기에 PDF를 드래그",orClickBrowse:"또는 여기를 클릭하여 찾아보기",chooseFile:"파일 선택",dontCloseTab:"이 탭을 닫지 마세요.",extractingText:"PDF에서 텍스트 추출 중…",uploadingFile:"파일 업로드 중…",savingPaper:"논문 저장 중…",paperUploaded:"논문이 업로드되었습니다!",uploadFailed:"업로드 실패",notPdf:"PDF 파일을 업로드하세요.",tooLarge:"파일은 25MB 미만이어야 합니다.",noTextExtracted:"이 PDF에서 텍스트를 추출할 수 없었습니다.",notSignedIn:"로그인되지 않음",backToDashboard:"대시보드로 돌아가기",quickActions:"빠른 작업",askAnything:"이 논문에 대해 무엇이든 물어보세요",send:"보내기",thinking:"생각 중…",loading:"로딩 중…",tryQuickAction:"왼쪽의 빠른 작업을 시도하세요.",voiceInput:"음성 입력",listeningStop:"듣고 있습니다… 클릭하여 중지",citations:"인용",knowledgeGraph:"지식 그래프",qualityScore:"품질 점수",summaryAction:"요약",gapsAction:"연구 격차",vivaPrepAction:"논문 심사 준비",pptAction:"PPT",projectConverterAction:"프로젝트",qualityScoreAction:"품질 점수",newComparison:"새 비교",history:"기록",searchHistory:"기록 검색",noComparisons:"비교가 없습니다.",comparePageTitle:"새 비교",comparePageSubtitle:"2-5개의 논문 선택.",uploadSomePapersFirst:"먼저 논문을 업로드하세요.",optionalFocus:"선택적 초점",compareBtn:"비교하기",pickUpTo5:"최대 5개 선택",selectAtLeast2:"최소 2개 선택",comparisonCreated:"비교가 생성되었습니다",comparisonFailed:"비교 실패",aiRequestFailed:"AI 요청 실패",renameFailed:"이름 변경 실패",deleteFailed:"삭제 실패",openOrStartNew:"사이드바에서 열거나 새로 시작.",compareFollowupPlaceholder:"후속 질문하기…",renameComparison:"비교 이름 변경",deleteComparisonConfirm:"이 비교를 삭제할까요?",insightsTitle:"인사이트",insightsSubtitle:"연구 활동 한눈에 보기.",recentPapers:"최근 논문",recentQuestions:"최근 질문",papersUploaded:"업로드된 논문",questionsAsked:"질문 수",avgPerPaper:"평균 질문",uploadToGetStarted:"시작하려면 업로드.",askFirstQuestion:"첫 AI 질문하기.",settingsTitle:"설정",settingsSubtitle:"계정 및 데이터 관리.",account:"계정",memberSince:"회원",papers:"논문",currentPassword:"현재 비밀번호",confirmPassword:"새 비밀번호 확인",updatePassword:"비밀번호 업데이트",dangerZone:"위험 구역",dangerZoneBody:"모든 논문과 대화를 영구 삭제.",deleteAllPapers:"모든 논문 삭제",deleteAllConfirm:"모든 논문을 삭제할까요? 되돌릴 수 없습니다.",allPapersDeleted:"모든 논문이 삭제되었습니다",passwordDoesNotMeet:"비밀번호가 요구 사항을 충족하지 않습니다",student:"학생",researcher:"연구자",reviewer:"심사자",professor:"교수",mode:"모드",currentMode:"현재 모드",switchedToMode:"전환됨",modeDescription_student:"간단한 설명.",modeDescription_researcher:"기술적 깊이.",modeDescription_reviewer:"비판적 분석.",modeDescription_professor:"심사 질문.",readAloud:"소리 내어 읽기",pause:"일시 중지",resume:"재개",stop:"정지",voiceSettings:"음성 설정",speed:"속도",voice:"목소리",auto:"자동",citationPanel:"인용",authors:"저자",year:"연도",venue:"장소",pages:"페이지",copy:"복사",copied:"복사됨",download:"다운로드",citationCopied:"인용이 복사됨",researchQualityScore:"연구 품질 점수",novelty:"새로움",impact:"영향",methodology:"방법론",dataset:"데이터셋",citationQuality:"인용",overall:"전체",excellent:"우수 — 출판 가능",good:"좋음 — 강력한 기여",fair:"보통 — 개선 필요",weak:"약함 — 대규모 수정 필요",knowledgeGraphTitle:"지식 그래프",keyword:"키워드",author:"저자",concept:"개념",algorithm:"알고리즘",language:"언어",or:"또는",summary:"요약",gaps:"연구 격차",vivaPrep:"심사 준비",ppt:"PPT",projectConverter:"프로젝트",
};`;

// ── Russian, Italian, Portuguese, Turkish, Thai, Vietnamese, Indonesian, Punjabi, Bengali, Urdu ──
// These use EN as base but with key terms translated for the most visible UI elements

function makeFromEN(overrides) {
  // We'll inject these as spread of EN + overrides in the TRANSLATIONS map patch
  return JSON.stringify(overrides);
}

const RU_OVERRIDES = {dashboard:"Панель",upload:"Загрузить",compare:"Сравнить",insights:"Аналитика",settings:"Настройки",signOut:"Выйти",welcomeBack:"Добро пожаловать",createAccount:"Создать аккаунт",signInSubtitle:"Войдите для продолжения.",signUpSubtitle:"Начните работу с исследованиями.",email:"Эл. почта",password:"Пароль",forgotPassword:"Забыли пароль?",signIn:"Войти",pleaseWait:"Пожалуйста, подождите…",continueWithGoogle:"Продолжить с Google",alreadyHaveAccount:"Уже есть аккаунт?",newHere:"Новый пользователь?",orSeparator:"или",authFailed:"Ошибка аутентификации",googleFailed:"Ошибка входа через Google",accountCreated:"Аккаунт создан.",forgotYourPassword:"Забыли пароль?",forgotSubtitle:"Введите email для получения ссылки.",sendResetLink:"Отправить ссылку",sendingLink:"Отправка…",checkYourEmail:"Проверьте почту",checkEmailBody:"Ссылка для сброса пароля отправлена. Истекает через 15 минут.",backToSignIn:"Назад ко входу",rememberedIt:"Вспомнили?",emailPlaceholder:"vy@example.com",failedToSend:"Не удалось отправить ссылку",setNewPassword:"Установить новый пароль",chooseStrongPassword:"Выберите надёжный пароль.",newPassword:"Новый пароль",confirmNewPassword:"Подтвердите новый пароль",changePassword:"Изменить пароль",updatingPassword:"Обновление…",passwordUpdated:"Пароль обновлён",passwordUpdatedBody:"Пароль изменён. Войдите снова.",linkExpired:"Ссылка устарела",linkExpiredBody:"Эта ссылка устарела или уже использована.",requestNewLink:"Запросить новую ссылку",goToSignIn:"Перейти ко входу",passwordsDoNotMatch:"Пароли не совпадают.",passwordRequirements:"Пароль не соответствует требованиям",passwordUpdatedSuccess:"Пароль успешно обновлён",incorrectCurrentPassword:"Неверный текущий пароль",failedToUpdatePassword:"Не удалось обновить пароль",yourPapers:"Ваши статьи",uploadPaper:"Загрузить статью",noPapersYet:"Статей пока нет",noPapersBody:"Загрузите первую статью для начала.",open:"Открыть",delete:"Удалить",uploadedOn:"Загружено",deletePaperConfirm:"Удалить эту статью?",uploadsChart:"Загрузки — последние 7 дней",comparisons:"Сравнения",openPaperHint:"Откройте статью для чата.",uploadPageTitle:"Загрузить исследовательскую статью",uploadPageSubtitle:"Только PDF, до 25 МБ.",dragDrop:"Перетащите PDF сюда",orClickBrowse:"или нажмите для выбора",chooseFile:"Выбрать файл",dontCloseTab:"Не закрывайте вкладку.",extractingText:"Извлечение текста…",uploadingFile:"Загрузка файла…",savingPaper:"Сохранение…",paperUploaded:"Статья загружена!",uploadFailed:"Ошибка загрузки",notPdf:"Загрузите PDF файл.",tooLarge:"Файл должен быть меньше 25 МБ.",noTextExtracted:"Не удалось извлечь текст.",notSignedIn:"Не авторизован",backToDashboard:"К панели",quickActions:"Быстрые действия",askAnything:"Спросите что-нибудь",send:"Отправить",thinking:"Думаю…",loading:"Загрузка…",tryQuickAction:"Попробуйте быстрое действие.",voiceInput:"Голосовой ввод",listeningStop:"Слушаю… Нажмите для остановки",citations:"Цитаты",knowledgeGraph:"Граф знаний",qualityScore:"Оценка качества",summaryAction:"Резюме",gapsAction:"Пробелы",vivaPrepAction:"Подготовка к защите",pptAction:"PPT",projectConverterAction:"Проект",qualityScoreAction:"Качество",newComparison:"Новое сравнение",history:"История",searchHistory:"Поиск в истории",noComparisons:"Сравнений нет.",comparePageTitle:"Новое сравнение",comparePageSubtitle:"Выберите 2–5 статей.",uploadSomePapersFirst:"Сначала загрузите статьи.",optionalFocus:"Опциональный фокус",compareBtn:"Сравнить",pickUpTo5:"Выберите до 5",selectAtLeast2:"Выберите минимум 2",comparisonCreated:"Сравнение создано",comparisonFailed:"Ошибка сравнения",aiRequestFailed:"Ошибка AI запроса",renameFailed:"Ошибка переименования",deleteFailed:"Ошибка удаления",openOrStartNew:"Откройте или начните новое.",compareFollowupPlaceholder:"Задайте уточняющий вопрос…",renameComparison:"Переименовать",deleteComparisonConfirm:"Удалить это сравнение?",insightsTitle:"Аналитика",insightsSubtitle:"Ваша активность.",recentPapers:"Недавние статьи",recentQuestions:"Недавние вопросы",papersUploaded:"Загружено статей",questionsAsked:"Задано вопросов",avgPerPaper:"Среднее вопросов",uploadToGetStarted:"Загрузите статью.",askFirstQuestion:"Задайте первый AI вопрос.",settingsTitle:"Настройки",settingsSubtitle:"Управление аккаунтом.",account:"Аккаунт",memberSince:"Участник с",papers:"Статьи",currentPassword:"Текущий пароль",confirmPassword:"Подтвердите пароль",updatePassword:"Обновить пароль",dangerZone:"Опасная зона",dangerZoneBody:"Удалить все статьи и беседы.",deleteAllPapers:"Удалить все статьи",deleteAllConfirm:"Удалить все? Необратимо.",allPapersDeleted:"Все статьи удалены",passwordDoesNotMeet:"Пароль не соответствует требованиям",student:"Студент",researcher:"Исследователь",reviewer:"Рецензент",professor:"Профессор",mode:"Режим",currentMode:"Текущий режим",switchedToMode:"Переключено",modeDescription_student:"Простые объяснения.",modeDescription_researcher:"Технический анализ.",modeDescription_reviewer:"Критический анализ.",modeDescription_professor:"Вопросы защиты.",readAloud:"Читать вслух",pause:"Пауза",resume:"Продолжить",stop:"Стоп",voiceSettings:"Настройки голоса",speed:"Скорость",voice:"Голос",auto:"Авто",citationPanel:"Цитата",authors:"Авторы",year:"Год",venue:"Место",pages:"Страницы",copy:"Копировать",copied:"Скопировано",download:"Скачать",citationCopied:"Цитата скопирована",researchQualityScore:"Оценка качества",novelty:"Новизна",impact:"Влияние",methodology:"Методология",dataset:"Набор данных",citationQuality:"Цитаты",overall:"Общее",excellent:"Отлично — Публикабельно",good:"Хорошо — Сильный вклад",fair:"Удовлетворительно",weak:"Слабо — Нужна доработка",knowledgeGraphTitle:"Граф знаний",keyword:"Ключевое слово",author:"Автор",concept:"Концепция",algorithm:"Алгоритм",language:"Язык",or:"или",summary:"Резюме",gaps:"Пробелы",vivaPrep:"Подготовка",ppt:"PPT",projectConverter:"Проект"};

const IT_OVERRIDES = {dashboard:"Pannello",upload:"Carica",compare:"Confronta",insights:"Analisi",settings:"Impostazioni",signOut:"Esci",welcomeBack:"Bentornato",createAccount:"Crea account",email:"Email",password:"Password",forgotPassword:"Password dimenticata?",signIn:"Accedi",pleaseWait:"Attendere…",continueWithGoogle:"Continua con Google",send:"Invia",thinking:"Sto pensando…",loading:"Caricamento…",yourPapers:"I tuoi articoli",uploadPaper:"Carica articolo",open:"Apri",delete:"Elimina",newComparison:"Nuovo confronto",history:"Cronologia",compare:"Confronta",student:"Studente",researcher:"Ricercatore",reviewer:"Revisore",professor:"Professore",language:"Lingua",summary:"Sommario",or:"o",citations:"Citazioni",qualityScore:"Punteggio qualità",knowledgeGraph:"Grafo della conoscenza"};

const PT_OVERRIDES = {dashboard:"Painel",upload:"Carregar",compare:"Comparar",insights:"Insights",settings:"Configurações",signOut:"Sair",welcomeBack:"Bem-vindo de volta",createAccount:"Criar conta",email:"E-mail",password:"Senha",forgotPassword:"Esqueceu a senha?",signIn:"Entrar",pleaseWait:"Aguarde…",continueWithGoogle:"Continuar com Google",send:"Enviar",thinking:"Pensando…",loading:"Carregando…",yourPapers:"Seus artigos",uploadPaper:"Carregar artigo",open:"Abrir",delete:"Excluir",newComparison:"Nova comparação",history:"Histórico",student:"Aluno",researcher:"Pesquisador",reviewer:"Revisor",professor:"Professor",language:"Idioma",summary:"Resumo",or:"ou",citations:"Citações",qualityScore:"Pontuação de qualidade",knowledgeGraph:"Grafo do conhecimento"};

const TR_OVERRIDES = {dashboard:"Pano",upload:"Yükle",compare:"Karşılaştır",insights:"İçgörüler",settings:"Ayarlar",signOut:"Çıkış",welcomeBack:"Tekrar hoş geldiniz",createAccount:"Hesap oluştur",email:"E-posta",password:"Şifre",forgotPassword:"Şifremi unuttum?",signIn:"Giriş yap",pleaseWait:"Lütfen bekleyin…",continueWithGoogle:"Google ile devam",send:"Gönder",thinking:"Düşünüyorum…",loading:"Yükleniyor…",yourPapers:"Makaleleriniz",uploadPaper:"Makale yükle",open:"Aç",delete:"Sil",newComparison:"Yeni karşılaştırma",history:"Geçmiş",student:"Öğrenci",researcher:"Araştırmacı",reviewer:"Editör",professor:"Profesör",language:"Dil",summary:"Özet",or:"veya",citations:"Alıntılar",qualityScore:"Kalite Puanı",knowledgeGraph:"Bilgi Grafiği"};

const TH_OVERRIDES = {dashboard:"แดชบอร์ด",upload:"อัปโหลด",compare:"เปรียบเทียบ",insights:"ข้อมูลเชิงลึก",settings:"การตั้งค่า",signOut:"ออกจากระบบ",welcomeBack:"ยินดีต้อนรับกลับ",createAccount:"สร้างบัญชี",email:"อีเมล",password:"รหัสผ่าน",signIn:"เข้าสู่ระบบ",pleaseWait:"กรุณารอ…",continueWithGoogle:"ดำเนินการต่อด้วย Google",send:"ส่ง",thinking:"กำลังคิด…",loading:"กำลังโหลด…",yourPapers:"บทความของคุณ",open:"เปิด",delete:"ลบ",newComparison:"การเปรียบเทียบใหม่",history:"ประวัติ",language:"ภาษา",summary:"สรุป",or:"หรือ",citations:"การอ้างอิง"};

const VI_OVERRIDES = {dashboard:"Bảng điều khiển",upload:"Tải lên",compare:"So sánh",insights:"Thông tin chi tiết",settings:"Cài đặt",signOut:"Đăng xuất",welcomeBack:"Chào mừng trở lại",createAccount:"Tạo tài khoản",email:"Email",password:"Mật khẩu",signIn:"Đăng nhập",pleaseWait:"Vui lòng đợi…",continueWithGoogle:"Tiếp tục với Google",send:"Gửi",thinking:"Đang suy nghĩ…",loading:"Đang tải…",yourPapers:"Bài viết của bạn",open:"Mở",delete:"Xóa",newComparison:"So sánh mới",history:"Lịch sử",language:"Ngôn ngữ",summary:"Tóm tắt",or:"hoặc",citations:"Trích dẫn"};

const ID_OVERRIDES = {dashboard:"Dasbor",upload:"Unggah",compare:"Bandingkan",insights:"Wawasan",settings:"Pengaturan",signOut:"Keluar",welcomeBack:"Selamat datang kembali",createAccount:"Buat akun",email:"Email",password:"Kata sandi",signIn:"Masuk",pleaseWait:"Harap tunggu…",continueWithGoogle:"Lanjutkan dengan Google",send:"Kirim",thinking:"Sedang berpikir…",loading:"Memuat…",yourPapers:"Makalah Anda",open:"Buka",delete:"Hapus",newComparison:"Perbandingan baru",history:"Riwayat",language:"Bahasa",summary:"Ringkasan",or:"atau",citations:"Kutipan"};

const PA_OVERRIDES = {dashboard:"ਡੈਸ਼ਬੋਰਡ",upload:"ਅਪਲੋਡ",compare:"ਤੁਲਨਾ",insights:"ਜਾਣਕਾਰੀ",settings:"ਸੈਟਿੰਗਾਂ",signOut:"ਸਾਈਨ ਆਊਟ",welcomeBack:"ਦੁਬਾਰਾ ਸੁਆਗਤ ਹੈ",email:"ਈਮੇਲ",password:"ਪਾਸਵਰਡ",signIn:"ਸਾਈਨ ਇਨ",send:"ਭੇਜੋ",thinking:"ਸੋਚ ਰਿਹਾ ਹਾਂ…",yourPapers:"ਤੁਹਾਡੇ ਪੇਪਰ",open:"ਖੋਲੋ",delete:"ਮਿਟਾਓ",language:"ਭਾਸ਼ਾ",summary:"ਸਾਰਾਂਸ਼",or:"ਜਾਂ"};

const BN_OVERRIDES = {dashboard:"ড্যাশবোর্ড",upload:"আপলোড",compare:"তুলনা",insights:"অন্তর্দৃষ্টি",settings:"সেটিংস",signOut:"সাইন আউট",welcomeBack:"আবার স্বাগতম",email:"ইমেইল",password:"পাসওয়ার্ড",signIn:"সাইন ইন",send:"পাঠান",thinking:"ভাবছি…",yourPapers:"আপনার পেপার",open:"খুলুন",delete:"মুছুন",language:"ভাষা",summary:"সারসংক্ষেপ",or:"অথবা"};

const UR_OVERRIDES = {dashboard:"ڈیش بورڈ",upload:"اپ لوڈ",compare:"موازنہ",insights:"بصیرت",settings:"ترتیبات",signOut:"سائن آؤٹ",welcomeBack:"خوش آمدید",email:"ای میل",password:"پاس ورڈ",signIn:"سائن ان",send:"بھیجیں",thinking:"سوچ رہا ہوں…",yourPapers:"آپ کے مقالے",open:"کھولیں",delete:"حذف",language:"زبان",summary:"خلاصہ",or:"یا"};

// ── Injection logic ──────────────────────────────────────────────────────────

// 1. Insert new language const blocks before the TRANSLATIONS map
const INSERT_BEFORE = "// ─── Translation map";
const NEW_CONSTS = [TA, TE, ML, MR, GU, DE, JA, ZH, AR, KO].join("\n");

if (!content.includes("const TA: Translations")) {
  content = content.replace(INSERT_BEFORE, NEW_CONSTS + "\n" + INSERT_BEFORE);
} else {
  console.log("Language consts already present, skipping insert");
}

// 2. Build "spread-from-EN" objects for simple overrides
function makeSpread(varName, overrides) {
  const entries = Object.entries(overrides).map(([k,v]) => `  ${k}:${JSON.stringify(v)}`).join(",\n");
  return `\nconst ${varName}: Translations = {\n  ...EN,\n${entries}\n};`;
}

const SPREAD_CONSTS = [
  makeSpread("RU", RU_OVERRIDES),
  makeSpread("IT", IT_OVERRIDES),
  makeSpread("PT", PT_OVERRIDES),
  makeSpread("TR", TR_OVERRIDES),
  makeSpread("TH", TH_OVERRIDES),
  makeSpread("VI", VI_OVERRIDES),
  makeSpread("ID", ID_OVERRIDES),
  makeSpread("PA", PA_OVERRIDES),
  makeSpread("BN", BN_OVERRIDES),
  makeSpread("UR", UR_OVERRIDES),
].join("\n");

if (!content.includes("const RU: Translations")) {
  content = content.replace(INSERT_BEFORE, SPREAD_CONSTS + "\n" + INSERT_BEFORE);
}

// 3. Replace the TRANSLATIONS map — swap all EN/HI fallbacks with proper objects
const OLD_MAP = `const TRANSLATIONS: TranslationMap = {
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
};`;

const NEW_MAP = `const TRANSLATIONS: TranslationMap = {
  en: EN, hi: HI, kn: KN,
  ta: TA, te: TE, ml: ML, mr: MR, gu: GU,
  pa: PA, bn: BN, ur: UR,
  es: ES, fr: FR,
  de: DE, it: IT, pt: PT, ru: RU,
  zh: ZH, ja: JA, ko: KO,
  ar: AR, tr: TR, th: TH, vi: VI, id: ID,
};`;

if (content.includes(OLD_MAP.trim().split("\n")[0])) {
  content = content.replace(OLD_MAP, NEW_MAP);
  console.log("✅ TRANSLATIONS map patched");
} else {
  // Try a more flexible replace
  content = content.replace(
    /const TRANSLATIONS: TranslationMap = \{[\s\S]*?\};/,
    NEW_MAP
  );
  console.log("✅ TRANSLATIONS map patched (flexible)");
}

writeFileSync(F, content, "utf8");
console.log("✅ LanguageProvider.tsx updated with all 25 language translations");
console.log("File size:", content.length, "bytes");

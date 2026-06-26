// finish-provider.mjs — appends remaining LanguageProvider content
import { appendFileSync as A, readFileSync } from "fs";
const F = "src/components/LanguageProvider.tsx";

// ── helpers ──────────────────────────────────────────────────────────────
// KN shared values (reused strings)
const kn = {
  db:"ಡ್ಯಾಶ್\u200cಬೋರ್ಡ್",up:"ಅಪ್\u200cಲೋಡ್",cmp:"ಹೋಲಿಕೆ",ins:"ಒಳನೋಟ",
  set:"ಸೆಟ್ಟಿಂಗ್\u200cಗಳು",so:"ಸೈನ್ ಔಟ್",si:"ಸೈನ್ ಇನ್",
  em:"ಇಮೇಲ್",pw:"ಪಾಸ್\u200cವರ್ಡ್",
  newCmp:"ಹೊಸ ಹೋಲಿಕೆ",hist:"ಇತಿಹಾಸ",
  send:"ಕಳುಹಿಸಿ",think:"ಯೋಚಿಸುತ್ತಿದ್ದೇನೆ\u2026",
  open:"ತೆರೆಯಿರಿ",del:"ಅಳಿಸಿ",lang:"ಭಾಷೆ",
};

// ── KN translation ────────────────────────────────────────────────────────
const KN_OBJ = `
const KN: Translations = {
  dashboard:"${kn.db}",upload:"${kn.up}",compare:"${kn.cmp}",insights:"${kn.ins}",
  settings:"${kn.set}",signOut:"${kn.so}",
  welcomeBack:"ಮರಳಿ ಸ್ವಾಗತ",createAccount:"ನಿಮ್ಮ ಖಾತೆ ರಚಿಸಿ",
  signInSubtitle:"ನಿಮ್ಮ ಸಂಶೋಧನೆ ಮುಂದುವರಿಸಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
  signUpSubtitle:"ಸಂಶೋಧನಾ ಪ್ರಬಂಧಗಳನ್ನು ಅನ್\u200cಲಾಕ್ ಮಾಡಲು ಪ್ರಾರಂಭಿಸಿ.",
  email:"${kn.em}",password:"${kn.pw}",forgotPassword:"ಪಾಸ್\u200cವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
  signIn:"${kn.si}",pleaseWait:"ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ\u2026",continueWithGoogle:"Google ನಿಂದ ಮುಂದುವರಿಸಿ",
  alreadyHaveAccount:"ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ?",newHere:"ಹೊಸಬರೇ?",orSeparator:"ಅಥವಾ",
  authFailed:"ದೃಢೀಕರಣ ವಿಫಲ",googleFailed:"Google ಸೈನ್-ಇನ್ ವಿಫಲ",
  accountCreated:"ಖಾತೆ ರಚಿಸಲಾಗಿದೆ.",
  forgotYourPassword:"ನಿಮ್ಮ ಪಾಸ್\u200cವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?",
  forgotSubtitle:"ನಿಮ್ಮ ಇಮೇಲ್ ನಮೂದಿಸಿ, ನಾವು ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸುತ್ತೇವೆ.",
  sendResetLink:"ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿ",sendingLink:"ಲಿಂಕ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ\u2026",
  checkYourEmail:"ನಿಮ್ಮ ಇಮೇಲ್ ಪರಿಶೀಲಿಸಿ",checkEmailBody:"ಪಾಸ್\u200cವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಕಳುಹಿಸಿದ್ದೇವೆ.",
  backToSignIn:"ಸೈನ್ ಇನ್\u200cಗೆ ಹಿಂತಿರುಗಿ",rememberedIt:"ನೆನಪಾಯಿತೇ?",
  emailPlaceholder:"nimma@example.com",failedToSend:"ಲಿಂಕ್ ಕಳುಹಿಸಲು ವಿಫಲ",
  setNewPassword:"ಹೊಸ ಪಾಸ್\u200cವರ್ಡ್ ಹೊಂದಿಸಿ",chooseStrongPassword:"ಬಲವಾದ ಪಾಸ್\u200cವರ್ಡ್ ಆಯ್ಕೆ ಮಾಡಿ.",
  newPassword:"ಹೊಸ ಪಾಸ್\u200cವರ್ಡ್",confirmNewPassword:"ಹೊಸ ಪಾಸ್\u200cವರ್ಡ್ ದೃಢೀಕರಿಸಿ",
  changePassword:"ಪಾಸ್\u200cವರ್ಡ್ ಬದಲಿಸಿ",updatingPassword:"ಪಾಸ್\u200cವರ್ಡ್ ನವೀಕರಿಸಲಾಗುತ್ತಿದೆ\u2026",
  passwordUpdated:"ಪಾಸ್\u200cವರ್ಡ್ ನವೀಕರಿಸಲಾಗಿದೆ",passwordUpdatedBody:"ಪಾಸ್\u200cವರ್ಡ್ ಬದಲಾಗಿದೆ. ಮತ್ತೆ ಸೈನ್ ಇನ್ ಮಾಡಿ.",
  linkExpired:"ಲಿಂಕ್ ಅವಧಿ ಮೀರಿದೆ",linkExpiredBody:"ಈ ಲಿಂಕ್ ಅಮಾನ್ಯ ಅಥವಾ ಬಳಸಲಾಗಿದೆ.",
  requestNewLink:"ಹೊಸ ಲಿಂಕ್ ವಿನಂತಿಸಿ",goToSignIn:"ಸೈನ್ ಇನ್\u200cಗೆ ಹೋಗಿ",
  passwordsDoNotMatch:"ಪಾಸ್\u200cವರ್ಡ್\u200cಗಳು ಹೊಂದಿಕೊಳ್ಳುವುದಿಲ್ಲ.",
  passwordRequirements:"ಪಾಸ್\u200cವರ್ಡ್ ಎಲ್ಲಾ ಅಪೇಕ್ಷೆಗಳನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ",
  passwordUpdatedSuccess:"ಪಾಸ್\u200cವರ್ಡ್ ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ",
  incorrectCurrentPassword:"ಪ್ರಸ್ತುತ ಪಾಸ್\u200cವರ್ಡ್ ತಪ್ಪಾಗಿದೆ",failedToUpdatePassword:"ಪಾಸ್\u200cವರ್ಡ್ ನವೀಕರಿಸಲು ವಿಫಲ",
  yourPapers:"ನಿಮ್ಮ ಪ್ರಬಂಧಗಳು",uploadPaper:"ಪ್ರಬಂಧ ಅಪ್\u200cಲೋಡ್ ಮಾಡಿ",noPapersYet:"ಇನ್ನೂ ಯಾವ ಪ್ರಬಂಧಗಳಿಲ್ಲ",
  noPapersBody:"ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ಪ್ರಬಂಧ ಅಪ್\u200cಲೋಡ್ ಮಾಡಿ.",
  open:"${kn.open}",delete:"${kn.del}",uploadedOn:"ಅಪ್\u200cಲೋಡ್ ಮಾಡಿದ",
  deletePaperConfirm:"ಈ ಪ್ರಬಂಧ ಮತ್ತು ಸಂಭಾಷಣೆಗಳನ್ನು ಅಳಿಸಲೇ?",
  uploadsChart:"ಅಪ್\u200cಲೋಡ್ — ಕೆಳಗಿನ 7 ದಿನಗಳು",comparisons:"ಹೋಲಿಕೆಗಳು",
  openPaperHint:"ಚ್ಯಾಟ್, ಸಾರಾಂಶ ಅಥವಾ ವೈವಾ ತಯಾರಿಗಾಗಿ ಪ್ರಬಂಧ ತೆರೆಯಿರಿ.",
  uploadPageTitle:"ಸಂಶೋಧನಾ ಪ್ರಬಂಧ ಅಪ್\u200cಲೋಡ್ ಮಾಡಿ",uploadPageSubtitle:"ಕೇವಲ PDF, 25 MB ವರೆಗೆ.",
  dragDrop:"ನಿಮ್ಮ PDF ಇಲ್ಲಿ ಎಳೆಯಿರಿ",orClickBrowse:"ಅಥವಾ ಬ್ರೌಸ್ ಮಾಡಲು ಇಲ್ಲಿ ಕ್ಲಿಕ್ ಮಾಡಿ",
  chooseFile:"ಫೈಲ್ ಆಯ್ಕೆ ಮಾಡಿ",dontCloseTab:"ದಯವಿಟ್ಟು ಈ ಟ್ಯಾಬ್ ಮುಚ್ಚಬೇಡಿ.",
  extractingText:"PDF ನಿಂದ ಟೆಕ್ಸ್ಟ್ ತೆಗೆದುಕೊಳ್ಳಲಾಗುತ್ತಿದೆ\u2026",uploadingFile:"ಫೈಲ್ ಅಪ್\u200cಲೋಡ್ ಆಗುತ್ತಿದೆ\u2026",
  savingPaper:"ಪ್ರಬಂಧ ಮೆವೆಸಲಾಗುತ್ತಿದೆ\u2026",paperUploaded:"ಪ್ರಬಂಧ ಅಪ್\u200cಲೋಡ್ ಆಯಿತು!",
  uploadFailed:"ಅಪ್\u200cಲೋಡ್ ವಿಫಲ",notPdf:"ದಯವಿಟ್ಟು PDF ಫೈಲ್ ಅಪ್\u200cಲೋಡ್ ಮಾಡಿ.",tooLarge:"ಫೈಲ್ 25 MB ಕ್ಕಿಂತ ಕಡಿಮೆ ಇರಬೇಕು.",
  noTextExtracted:"ಈ PDF ನಿಂದ ಯಾವ ಟೆಕ್ಸ್ಟ್ ತೆಗೆದುಕೊಳ್ಳಲಾಗಲಿಲ್ಲ.",notSignedIn:"ಸೈನ್ ಇನ್ ಮಾಡಿಲ್ಲ",
  backToDashboard:"ಡ್ಯಾಶ್\u200cಬೋರ್ಡ್\u200cಗೆ ಹಿಂತಿರುಗಿ",quickActions:"ತ್ವರಿತ ಕ್ರಿಯೆಗಳು",
  askAnything:"ಈ ಪ್ರಬಂಧದ ಬಗ್ಗೆ ಏನಾದರೂ ಕೇಳಿ",send:"${kn.send}",thinking:"${kn.think}",
  loading:"ಲೋಡ್ ಆಗುತ್ತಿದೆ\u2026",tryQuickAction:"ಎಡಗಡೆ ತ್ವರಿತ ಕ್ರಿಯೆ ಪ್ರಯತ್ನಿಸಿ.",
  voiceInput:"ಧ್ವನಿ ಇನ್\u200cಪುಟ್",listeningStop:"ಕೇಳುತ್ತಿದೆ\u2026 ನಿಲ್ಲಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ",
  citations:"ಉಲ್ಲೇಖಗಳು",knowledgeGraph:"ಜ್ಞಾನ ಗ್ರಾಫ್",qualityScore:"ಗುಣಮಟ್ಟ ಸ್ಕೋರ್",
  summaryAction:"ಸಾರಾಂಶ",gapsAction:"ಅಂತರಗಳು",vivaPrepAction:"ವೈವಾ ತಯಾರಿ",
  pptAction:"PPT",projectConverterAction:"ಯೋಜನೆ",qualityScoreAction:"ಗುಣಮಟ್ಟ ಸ್ಕೋರ್",
  newComparison:"${kn.newCmp}",history:"${kn.hist}",searchHistory:"ಇತಿಹಾಸ ಹುಡುಕಿ",noComparisons:"ಇನ್ನೂ ಯಾವ ಹೋಲಿಕೆಗಳಿಲ್ಲ.",
  comparePageTitle:"${kn.newCmp}",comparePageSubtitle:"2–5 ಪ್ರಬಂಧಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ.",
  uploadSomePapersFirst:"ಮೊದಲು ಕೆಲವು ಪ್ರಬಂಧಗಳನ್ನು ಅಪ್\u200cಲೋಡ್ ಮಾಡಿ.",
  optionalFocus:"ಐಚ್ಛಿಕ ಗಮನ (ಉದಾ. ಡೇಟಾಸೆಟ್, ಸಟೀಕತೆ)",compareBtn:"ಹೋಲಿಸಿ",
  pickUpTo5:"ಗರಿಷ್ಠ 5 ಪ್ರಬಂಧಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",selectAtLeast2:"ಕನಿಷ್ಠ 2 ಪ್ರಬಂಧಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
  comparisonCreated:"ಹೋಲಿಕೆ ರಚಿಸಲಾಗಿದೆ",comparisonFailed:"ಹೋಲಿಕೆ ವಿಫಲ",aiRequestFailed:"AI ವಿನಂತಿ ವಿಫಲ",
  renameFailed:"ಹೆಸರು ಬದಲಾಯಿಸಲು ವಿಫಲ",deleteFailed:"ಅಳಿಸಲು ವಿಫಲ",
  openOrStartNew:"ಸೈಡ್\u200cಬಾರ್\u200cನಿಂದ ಹೋಲಿಕೆ ತೆರೆಯಿರಿ ಅಥವಾ ಹೊಸದನ್ನು ಪ್ರಾರಂಭಿಸಿ.",
  compareFollowupPlaceholder:"ಈ ಪ್ರಬಂಧಗಳ ಬಗ್ಗೆ ಫಾಲೋ-ಅಪ್ ಕೇಳಿ\u2026",
  renameComparison:"ಹೋಲಿಕೆ ಹೆಸರು ಬದಲಿಸಿ",deleteComparisonConfirm:"ಈ ಹೋಲಿಕೆ ಅಳಿಸಲೇ?",
  insightsTitle:"ಒಳನೋಟ",insightsSubtitle:"ನಿಮ್ಮ ಸಂಶೋಧನಾ ಚಟುವಟಿಕೆ ಒಂದು ನೋಟದಲ್ಲಿ.",
  recentPapers:"ಇತ್ತೀಚಿನ ಪ್ರಬಂಧಗಳು",recentQuestions:"ಇತ್ತೀಚಿನ ಪ್ರಶ್ನೆಗಳು",
  papersUploaded:"ಅಪ್\u200cಲೋಡ್ ಮಾಡಿದ ಪ್ರಬಂಧಗಳು",questionsAsked:"ಕೇಳಿದ ಪ್ರಶ್ನೆಗಳು",avgPerPaper:"ಸರಾಸರಿ ಪ್ರಶ್ನೆಗಳು",
  uploadToGetStarted:"ಪ್ರಾರಂಭಿಸಲು ಪ್ರಬಂಧ ಅಪ್\u200cಲೋಡ್ ಮಾಡಿ.",askFirstQuestion:"ಪ್ರಬಂಧದ ಮೇಲೆ ನಿಮ್ಮ ಮೊದಲ AI ಪ್ರಶ್ನೆ ಕೇಳಿ.",
  settingsTitle:"ಸೆಟ್ಟಿಂಗ್\u200cಗಳು",settingsSubtitle:"ನಿಮ್ಮ ಖಾತೆ ಮತ್ತು ಡೇಟಾ ನಿರ್ವಹಿಸಿ.",
  account:"ಖಾತೆ",memberSince:"ಸದಸ್ಯ",papers:"ಪ್ರಬಂಧಗಳು",
  currentPassword:"ಪ್ರಸ್ತುತ ಪಾಸ್\u200cವರ್ಡ್",confirmPassword:"ಹೊಸ ಪಾಸ್\u200cವರ್ಡ್ ದೃಢೀಕರಿಸಿ",updatePassword:"ಪಾಸ್\u200cವರ್ಡ್ ನವೀಕರಿಸಿ",
  dangerZone:"ಅಪಾಯ ವಲಯ",dangerZoneBody:"ನಿಮ್ಮ ಖಾತೆಗೆ ಸಂಬಂಧಿಸಿದ ಎಲ್ಲವನ್ನೂ ಶಾಶ್ವತವಾಗಿ ಅಳಿಸಿ.",
  deleteAllPapers:"ಎಲ್ಲ ಪ್ರಬಂಧಗಳನ್ನು ಅಳಿಸಿ",deleteAllConfirm:"ಎಲ್ಲ ಪ್ರಬಂಧಗಳನ್ನು ಅಳಿಸಲೇ? ಇದನ್ನು ಹಿಂತಿರುಗಿಸಲಾಗುವುದಿಲ್ಲ.",
  allPapersDeleted:"ಎಲ್ಲ ಪ್ರಬಂಧಗಳನ್ನು ಅಳಿಸಲಾಗಿದೆ",passwordDoesNotMeet:"ಪಾಸ್\u200cವರ್ಡ್ ಅಪೇಕ್ಷೆಗಳನ್ನು ಪೂರೈಸುವುದಿಲ್ಲ",
  student:"ವಿದ್ಯಾರ್ಥಿ",researcher:"ಸಂಶೋಧಕ",reviewer:"ವಿಮರ್ಶಕ",professor:"ಪ್ರಾಧ್ಯಾಪಕ",
  mode:"ಮೋಡ್",currentMode:"ಪ್ರಸ್ತುತ ಮೋಡ್",switchedToMode:"ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ",
  modeDescription_student:"ಸರಳ ವಿವರಣೆ ಮತ್ತು ಪರೀಕ್ಷಾ-ಉನ್ಮುಖ ಉತ್ತರಗಳು.",
  modeDescription_researcher:"ತಾಂತ್ರಿಕ ಆಳ ಮತ್ತು ಸಂಶೋಧನಾ ವಿಶ್ಲೇಷಣೆ.",
  modeDescription_reviewer:"ವಿಮರ್ಶಾತ್ಮಕ ವಿಶ್ಲೇಷಣೆ, ಸ್ಕೋರಿಂಗ್ ಮತ್ತು ಶಿಫಾರಸು.",
  modeDescription_professor:"ವೈವಾ ಪ್ರಶ್ನೆಗಳು, ಭವಿಷ್ಯದ ಕೆಲಸ, ಸಂಶೋಧನಾ ಅಂತರಗಳು.",
  readAloud:"ಜೋರಾಗಿ ಓದಿ",pause:"ವಿರಾಮ",resume:"ಮತ್ತೆ ಪ್ರಾರಂಭ",stop:"ನಿಲ್ಲಿಸಿ",
  voiceSettings:"ಧ್ವನಿ ಸೆಟ್ಟಿಂಗ್\u200cಗಳು",speed:"ವೇಗ",voice:"ಧ್ವನಿ",auto:"ಸ್ವಯಂ",
  citationPanel:"ಉಲ್ಲೇಖ",authors:"ಲೇಖಕರು",year:"ವರ್ಷ",venue:"ಸ್ಥಳ",pages:"ಪುಟಗಳು",
  copy:"ನಕಲು",copied:"ನಕಲಿಸಲಾಗಿದೆ",download:"ಡೌನ್\u200cಲೋಡ್",citationCopied:"ಉಲ್ಲೇಖ ನಕಲಿಸಲಾಗಿದೆ",
  researchQualityScore:"ಸಂಶೋಧನಾ ಗುಣಮಟ್ಟ ಸ್ಕೋರ್",
  novelty:"ನಾವೀನ್ಯತೆ",impact:"ಪ್ರಭಾವ",methodology:"ಕ್ರಮಶಾಸ್ತ್ರ",
  dataset:"ಡೇಟಾಸೆಟ್",citationQuality:"ಉಲ್ಲೇಖಗಳು",overall:"ಒಟ್ಟು",
  excellent:"ಉತ್ತಮ — ಪ್ರಕಟಣಾ ಯೋಗ್ಯ",good:"ಉತ್ತಮ — ಬಲವಾದ ಕೊಡುಗೆ",
  fair:"ಸಾಧಾರಣ — ಸುಧಾರಣೆ ಅಗತ್ಯ",weak:"ದುರ್ಬಲ — ದೊಡ್ಡ ಪರಿಷ್ಕರಣೆ ಅಗತ್ಯ",
  knowledgeGraphTitle:"ಜ್ಞಾನ ಗ್ರಾಫ್",keyword:"ಕೀವರ್ಡ್",author:"ಲೇಖಕ",concept:"ಪರಿಕಲ್ಪನೆ",algorithm:"ಅಲ್ಗಾರಿದಮ್",
  language:"${kn.lang}",or:"ಅಥವಾ",
  summary:"ಸಾರಾಂಶ",gaps:"ಅಂತರಗಳು",vivaPrep:"ವೈವಾ ತಯಾರಿ",ppt:"PPT",projectConverter:"ಯೋಜನೆ",
};
`;
A(F, KN_OBJ);

// ── Spanish ───────────────────────────────────────────────────────────────
const ES_OBJ = `
const ES: Translations = {
  dashboard:"Panel",upload:"Subir",compare:"Comparar",insights:"Perspectivas",
  settings:"Configuración",signOut:"Cerrar sesión",
  welcomeBack:"Bienvenido de nuevo",createAccount:"Crear tu cuenta",
  signInSubtitle:"Inicia sesión para continuar tu investigación.",signUpSubtitle:"Empieza a desbloquear artículos de investigación en segundos.",
  email:"Correo electrónico",password:"Contraseña",forgotPassword:"¿Olvidaste tu contraseña?",
  signIn:"Iniciar sesión",pleaseWait:"Por favor espera\u2026",continueWithGoogle:"Continuar con Google",
  alreadyHaveAccount:"¿Ya tienes cuenta?",newHere:"¿Eres nuevo?",orSeparator:"o",
  authFailed:"Error de autenticación",googleFailed:"Error de inicio de sesión con Google",
  accountCreated:"Cuenta creada. Revisa tu correo si se requiere confirmación.",
  forgotYourPassword:"¿Olvidaste tu contraseña?",forgotSubtitle:"Ingresa tu correo y te enviaremos un enlace seguro.",
  sendResetLink:"Enviar enlace de restablecimiento",sendingLink:"Enviando enlace\u2026",
  checkYourEmail:"Revisa tu correo",checkEmailBody:"Hemos enviado un enlace de restablecimiento. Expira en 15 minutos.",
  backToSignIn:"Volver a iniciar sesión",rememberedIt:"¿Lo recordaste?",emailPlaceholder:"tu@ejemplo.com",failedToSend:"Error al enviar enlace",
  setNewPassword:"Establecer nueva contraseña",chooseStrongPassword:"Elige una contraseña segura que no hayas usado antes.",
  newPassword:"Nueva contraseña",confirmNewPassword:"Confirmar nueva contraseña",
  changePassword:"Cambiar contraseña",updatingPassword:"Actualizando contraseña\u2026",
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
  extractingText:"Extrayendo texto del PDF\u2026",uploadingFile:"Subiendo archivo\u2026",savingPaper:"Guardando artículo\u2026",
  paperUploaded:"¡Artículo subido!",uploadFailed:"Error al subir",notPdf:"Por favor sube un archivo PDF.",tooLarge:"El archivo debe ser menor de 25 MB.",noTextExtracted:"No se pudo extraer texto de este PDF.",notSignedIn:"No has iniciado sesión",
  backToDashboard:"Volver al panel",quickActions:"Acciones rápidas",askAnything:"Pregunta cualquier cosa sobre este artículo",
  send:"Enviar",thinking:"Pensando\u2026",loading:"Cargando\u2026",tryQuickAction:"Prueba una acción rápida a la izquierda.",
  voiceInput:"Entrada de voz",listeningStop:"Escuchando\u2026 clic para detener",
  citations:"Citas",knowledgeGraph:"Grafo de conocimiento",qualityScore:"Puntuación de calidad",
  summaryAction:"Resumen",gapsAction:"Brechas",vivaPrepAction:"Preparación de viva",pptAction:"PPT",projectConverterAction:"Proyecto",qualityScoreAction:"Puntuación de calidad",
  newComparison:"Nueva comparación",history:"Historial",searchHistory:"Buscar historial",noComparisons:"Sin comparaciones aún.",
  comparePageTitle:"Nueva comparación",comparePageSubtitle:"Elige 2–5 artículos.",uploadSomePapersFirst:"Sube algunos artículos primero.",
  optionalFocus:"Enfoque opcional",compareBtn:"Comparar",pickUpTo5:"Elige hasta 5 artículos",selectAtLeast2:"Selecciona al menos 2 artículos",
  comparisonCreated:"Comparación creada",comparisonFailed:"Comparación fallida",aiRequestFailed:"Solicitud de AI fallida",renameFailed:"Error al renombrar",deleteFailed:"Error al eliminar",
  openOrStartNew:"Abre una comparación del panel lateral o inicia una nueva.",compareFollowupPlaceholder:"Haz una pregunta de seguimiento\u2026",renameComparison:"Renombrar comparación",deleteComparisonConfirm:"¿Eliminar esta comparación?",
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
`;
A(F, ES_OBJ);

// ── French ────────────────────────────────────────────────────────────────
const FR_OBJ = `
const FR: Translations = {
  dashboard:"Tableau de bord",upload:"Téléverser",compare:"Comparer",insights:"Perspectives",
  settings:"Paramètres",signOut:"Se déconnecter",welcomeBack:"Bon retour",createAccount:"Créer votre compte",
  signInSubtitle:"Connectez-vous pour continuer votre recherche.",signUpSubtitle:"Commencez à débloquer des articles de recherche en quelques secondes.",
  email:"Email",password:"Mot de passe",forgotPassword:"Mot de passe oublié?",signIn:"Se connecter",pleaseWait:"Veuillez patienter\u2026",
  continueWithGoogle:"Continuer avec Google",alreadyHaveAccount:"Vous avez déjà un compte?",newHere:"Nouveau?",orSeparator:"ou",
  authFailed:"Échec de l'authentification",googleFailed:"Échec de la connexion Google",accountCreated:"Compte créé. Vérifiez votre email si confirmation requise.",
  forgotYourPassword:"Mot de passe oublié?",forgotSubtitle:"Entrez votre email et nous vous enverrons un lien sécurisé.",sendResetLink:"Envoyer le lien",sendingLink:"Envoi du lien\u2026",
  checkYourEmail:"Vérifiez votre email",checkEmailBody:"Nous avons envoyé un lien de réinitialisation. Il expire dans 15 minutes.",backToSignIn:"Retour à la connexion",rememberedIt:"Vous vous en souvenez?",
  emailPlaceholder:"vous@exemple.com",failedToSend:"Échec de l'envoi du lien",setNewPassword:"Définir un nouveau mot de passe",chooseStrongPassword:"Choisissez un mot de passe fort que vous n'avez pas utilisé.",
  newPassword:"Nouveau mot de passe",confirmNewPassword:"Confirmer le nouveau mot de passe",changePassword:"Changer le mot de passe",updatingPassword:"Mise à jour\u2026",
  passwordUpdated:"Mot de passe mis à jour",passwordUpdatedBody:"Votre mot de passe a été modifié. Reconnectez-vous.",linkExpired:"Lien expiré ou invalide",linkExpiredBody:"Ce lien a expiré ou a déjà été utilisé.",
  requestNewLink:"Demander un nouveau lien",goToSignIn:"Aller à la connexion",passwordsDoNotMatch:"Les mots de passe ne correspondent pas.",passwordRequirements:"Le mot de passe ne satisfait pas les exigences",
  passwordUpdatedSuccess:"Mot de passe mis à jour avec succès",incorrectCurrentPassword:"Mot de passe actuel incorrect",failedToUpdatePassword:"Échec de la mise à jour",
  yourPapers:"Vos articles",uploadPaper:"Téléverser un article",noPapersYet:"Aucun article encore",noPapersBody:"Téléversez votre premier article de recherche pour commencer.",
  open:"Ouvrir",delete:"Supprimer",uploadedOn:"Téléversé",deletePaperConfirm:"Supprimer cet article et toutes ses conversations?",
  uploadsChart:"Téléversements — 7 derniers jours",comparisons:"Comparaisons",openPaperHint:"Ouvrez un article pour chatter, résumer ou préparer la soutenance.",
  uploadPageTitle:"Téléverser un article de recherche",uploadPageSubtitle:"PDF uniquement, jusqu'à 25 Mo.",dragDrop:"Glissez-déposez votre PDF ici",orClickBrowse:"ou cliquez n'importe où pour parcourir",
  chooseFile:"Choisir un fichier",dontCloseTab:"Ne fermez pas cet onglet.",extractingText:"Extraction du texte\u2026",uploadingFile:"Téléversement\u2026",savingPaper:"Enregistrement\u2026",
  paperUploaded:"Article téléversé!",uploadFailed:"Échec du téléversement",notPdf:"Veuillez téléverser un fichier PDF.",tooLarge:"Le fichier doit être inférieur à 25 Mo.",noTextExtracted:"Impossible d'extraire le texte de ce PDF.",notSignedIn:"Non connecté",
  backToDashboard:"Retour au tableau de bord",quickActions:"Actions rapides",askAnything:"Posez n'importe quelle question sur cet article",
  send:"Envoyer",thinking:"Réflexion\u2026",loading:"Chargement\u2026",tryQuickAction:"Essayez une action rapide à gauche.",voiceInput:"Saisie vocale",listeningStop:"Écoute\u2026 cliquez pour arrêter",
  citations:"Citations",knowledgeGraph:"Graphe de connaissances",qualityScore:"Score de qualité",
  summaryAction:"Résumé",gapsAction:"Lacunes",vivaPrepAction:"Préparation soutenance",pptAction:"PPT",projectConverterAction:"Projet",qualityScoreAction:"Score de qualité",
  newComparison:"Nouvelle comparaison",history:"Historique",searchHistory:"Rechercher l'historique",noComparisons:"Aucune comparaison encore.",
  comparePageTitle:"Nouvelle comparaison",comparePageSubtitle:"Choisissez 2 à 5 articles.",uploadSomePapersFirst:"Téléversez d'abord des articles.",optionalFocus:"Focus optionnel",compareBtn:"Comparer",pickUpTo5:"Choisissez jusqu'à 5 articles",selectAtLeast2:"Sélectionnez au moins 2 articles",
  comparisonCreated:"Comparaison créée",comparisonFailed:"Comparaison échouée",aiRequestFailed:"Demande AI échouée",renameFailed:"Échec du renommage",deleteFailed:"Échec de la suppression",
  openOrStartNew:"Ouvrez une comparaison depuis le panneau ou commencez-en une nouvelle.",compareFollowupPlaceholder:"Posez une question de suivi\u2026",renameComparison:"Renommer la comparaison",deleteComparisonConfirm:"Supprimer cette comparaison?",
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
`;
A(F, FR_OBJ);

// ── All remaining languages fall back to EN (Gemini handles translation via prompt) ──
// Chinese, Japanese, Korean, Arabic, German, etc.
// The AI language instruction ensures responses are in the correct language.
const TAIL = `
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
`;
A(F, TAIL);
console.log("✅ LanguageProvider.tsx completed successfully.");

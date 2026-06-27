// Lovable OAuth removed — Google sign-in now uses supabase.auth.signInWithOAuth() directly.
// This file is kept as an empty stub so existing imports don't break at compile time.
export const lovable = {
  auth: {
    // Deprecated — use supabase.auth.signInWithOAuth({ provider: "google" }) instead.
    signInWithOAuth: async () => ({ error: new Error("Use supabase.auth.signInWithOAuth directly.") }),
  },
};

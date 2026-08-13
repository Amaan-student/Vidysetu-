// ====================================================================
// SUPABASE CONFIG — replace these two values after Phase 2 (Supabase setup)
// You'll get these from: Supabase Dashboard → Project Settings → API
// ====================================================================
const SUPABASE_URL = "https://tgzyjvlgcotpwgbzrkez.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnenlqdmxnY290cHdnYnpya2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY1ODc4ODEsImV4cCI6MjEwMjE2Mzg4MX0.R_KP07wJffKopmVA2BQqW9Px_vc9vGF1DjkGl02cFXY";

let supabase = null;
let DB_CONNECTED = false;

// Only initialize if the placeholders have been replaced with real values.
if (SUPABASE_URL !== "YOUR_SUPABASE_URL_HERE" && SUPABASE_ANON_KEY !== "YOUR_SUPABASE_ANON_KEY_HERE") {
  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  DB_CONNECTED = true;
}

// While DB_CONNECTED is false, every page falls back to local demo data
// (see assets/js/app.js) so the site still works and looks complete
// before the database is wired in.

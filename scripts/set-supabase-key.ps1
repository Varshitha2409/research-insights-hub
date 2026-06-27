# set-supabase-key.ps1
# Run this once after you get your new Supabase anon key.
# Usage:  .\scripts\set-supabase-key.ps1 -AnonKey "eyJhbGci..."
#
# Get your anon key from:
#   https://supabase.com/dashboard/project/afefxredjpwxjzxttxyj/settings/api
#   → "Project API keys" → copy "anon public"

param(
    [Parameter(Mandatory=$true)]
    [string]$AnonKey,

    [string]$GeminiKey = ""
)

$PROJECT = "afefxredjpwxjzxttxyj"
$URL     = "https://$PROJECT.supabase.co"

Write-Host "Setting Supabase anon key on Vercel..." -ForegroundColor Cyan

# Update Vercel env vars
echo $AnonKey | vercel env add SUPABASE_PUBLISHABLE_KEY production --force
echo $AnonKey | vercel env add VITE_SUPABASE_PUBLISHABLE_KEY production --force

if ($GeminiKey -ne "") {
    Write-Host "Setting Gemini API key on Vercel..." -ForegroundColor Cyan
    echo $GeminiKey | vercel env add GEMINI_API_KEY production --force
}

# Update local .env
$envContent = @"
# Supabase - Project: $PROJECT
SUPABASE_PROJECT_ID="$PROJECT"
SUPABASE_URL="$URL"
SUPABASE_PUBLISHABLE_KEY="$AnonKey"

VITE_SUPABASE_PROJECT_ID="$PROJECT"
VITE_SUPABASE_URL="$URL"
VITE_SUPABASE_PUBLISHABLE_KEY="$AnonKey"

# Gemini API Key
GEMINI_API_KEY="$(if ($GeminiKey -ne "") { $GeminiKey } else { 'your-gemini-api-key-here' })"
"@

Set-Content -Path ".env" -Value $envContent
Write-Host ".env updated." -ForegroundColor Green

# Redeploy
Write-Host "Redeploying to Vercel..." -ForegroundColor Cyan
vercel --prod --yes

Write-Host ""
Write-Host "Done! Visit https://research-insights-hub.vercel.app" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps in Supabase dashboard (afefxredjpwxjzxttxyj):" -ForegroundColor Yellow
Write-Host "  1. Auth > Providers > Google: Enable + add Client ID & Secret"
Write-Host "  2. Auth > URL Configuration > Site URL: https://research-insights-hub.vercel.app"
Write-Host "  3. Auth > URL Configuration > Redirect URLs: add https://research-insights-hub.vercel.app/**"
Write-Host "  4. Google Cloud Console: add redirect https://$PROJECT.supabase.co/auth/v1/callback"

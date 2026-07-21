# Ansera self-healing Cloudflare quick-tunnel manager.
# ------------------------------------------------------------------
# Keeps a public URL pointed at local n8n (http://localhost:5678) and,
# every time the tunnel (re)starts, syncs the fresh URL into:
#   - the project .env  (N8N_BASE_URL, N8N_WEBHOOK_URL)
#   - the Supabase edge-function secrets (so approve-reply always
#     reaches n8n even though the quick-tunnel URL changes)
# Then it babysits cloudflared and restarts+resyncs if it ever dies.
# Runs at logon via the "AnseraTunnel" Scheduled Task.
# ------------------------------------------------------------------

$ErrorActionPreference = 'Continue'
$Project     = 'C:\Users\A\customer-support-interface'
$EnvFile     = Join-Path $Project '.env'
$Cloudflared = 'C:\Program Files (x86)\cloudflared\cloudflared.exe'
$LogDir      = Join-Path $Project 'scripts\logs'
$CfLog       = Join-Path $LogDir 'cloudflared.log'
$RunLog      = Join-Path $LogDir 'tunnel-sync.log'
New-Item -ItemType Directory -Force -Path $LogDir | Out-Null

function Log($m) {
  $line = "{0}  {1}" -f (Get-Date -Format 'yyyy-MM-ddTHH:mm:ss'), $m
  Add-Content -Path $RunLog -Value $line
}

function Set-EnvVar([string[]]$lines, [string]$key, [string]$val) {
  $pattern = "^$([regex]::Escape($key))="
  $found = $false
  $out = foreach ($l in $lines) {
    if ($l -match $pattern) { $found = $true; "$key=$val" } else { $l }
  }
  if (-not $found) { $out = @($out) + "$key=$val" }
  return $out
}

Log "=== tunnel-sync starting ==="

$backoff = 5   # seconds; grows on rapid failures so we never hammer Cloudflare's quick-tunnel rate limit (error 1015)

while ($true) {
  # one tunnel at a time — kill any strays before starting fresh
  Get-Process cloudflared -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
  Start-Sleep -Seconds 1
  if (Test-Path $CfLog) { Remove-Item $CfLog -Force -ErrorAction SilentlyContinue }

  Log "starting cloudflared quick tunnel -> http://localhost:5678"
  $proc = Start-Process -FilePath $Cloudflared `
    -ArgumentList @('tunnel', '--url', 'http://localhost:5678', '--logfile', $CfLog) `
    -WindowStyle Hidden -PassThru
  $startedAt = Get-Date

  # wait up to ~80s for the URL to appear in the log
  $url = $null
  for ($i = 0; $i -lt 40; $i++) {
    Start-Sleep -Seconds 2
    if (Test-Path $CfLog) {
      $hit = Select-String -Path $CfLog -Pattern 'https://[a-z0-9-]+\.trycloudflare\.com' -ErrorAction SilentlyContinue | Select-Object -First 1
      if ($hit) { $url = $hit.Matches[0].Value; break }
    }
    if ($proc.HasExited) { break }
  }

  if (-not $url) {
    if (-not $proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
    Log "ERROR: no tunnel URL captured (possibly rate-limited); backing off ${backoff}s"
    Start-Sleep -Seconds $backoff
    $backoff = [Math]::Min($backoff * 2, 600)
    continue
  }

  $webhook = "$url/webhook/send-approved-reply"
  Log "tunnel URL: $url"

  # --- sync .env (BOM-free so dotenv parses line 1 cleanly) ---
  try {
    $lines = @(Get-Content -Path $EnvFile -ErrorAction Stop)
    $lines = Set-EnvVar $lines 'N8N_BASE_URL' $url
    $lines = Set-EnvVar $lines 'N8N_WEBHOOK_URL' $webhook
    $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
    [System.IO.File]::WriteAllLines($EnvFile, $lines, $utf8NoBom)
    Log ".env synced"
  } catch {
    Log "ERROR syncing .env: $_"
  }

  # --- sync Supabase edge-function secrets ---
  try {
    Push-Location $Project
    $out = & npx --yes supabase secrets set "N8N_WEBHOOK_URL=$webhook" "N8N_BASE_URL=$url" 2>&1
    Pop-Location
    Log "supabase secrets set -> $($out -join ' | ')"
  } catch {
    Log "ERROR supabase secrets set: $_"
    try { Pop-Location } catch {}
  }

  Log "tunnel live (pid $($proc.Id)); babysitting..."
  Wait-Process -Id $proc.Id -ErrorAction SilentlyContinue
  $ranSeconds = ((Get-Date) - $startedAt).TotalSeconds
  # a long-lived tunnel that just died -> retry promptly; one that died fast -> back off (avoids rate-limit thrash)
  if ($ranSeconds -ge 120) { $backoff = 5 } else { $backoff = [Math]::Min($backoff * 2, 600) }
  Log ("cloudflared exited after {0:N0}s; restarting in {1}s" -f $ranSeconds, $backoff)
  Start-Sleep -Seconds $backoff
}

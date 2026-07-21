' Ansera tunnel launcher — starts the self-healing tunnel+sync script hidden.
' A copy of this file lives in the user's Startup folder so it runs at every logon.
CreateObject("WScript.Shell").Run "powershell.exe -NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File ""C:\Users\A\customer-support-interface\scripts\tunnel-sync.ps1""", 0, False

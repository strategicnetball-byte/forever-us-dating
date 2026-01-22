$DesktopPath = [Environment]::GetFolderPath("Desktop")
$ShortcutPath = Join-Path $DesktopPath "Forever Us.lnk"
$BatchFilePath = Join-Path $PSScriptRoot "Forever Us.bat"

# Create WScript.Shell COM object
$WshShell = New-Object -ComObject WScript.Shell

# Create the shortcut
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $BatchFilePath
$Shortcut.WorkingDirectory = $PSScriptRoot
$Shortcut.Description = "Forever Us Dating App"
$Shortcut.IconLocation = "C:\Windows\System32\shell32.dll,13"  # Globe icon
$Shortcut.Save()

Write-Host "Desktop shortcut created successfully!"
Write-Host "Location: $ShortcutPath"
Write-Host "Target: $BatchFilePath"

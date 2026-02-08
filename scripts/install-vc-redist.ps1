$([Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12)
$url = 'https://aka.ms/vs/17/release/vc_redist.x64.exe'
$out = Join-Path $env:TEMP 'vc_redist.x64.exe'
Write-Output "Downloading $url to $out"
Invoke-WebRequest -Uri $url -OutFile $out
Write-Output 'Download complete, running installer (may prompt for elevation)...'
$p = Start-Process -FilePath $out -ArgumentList '/install','/quiet','/norestart' -Wait -PassThru
Write-Output "Installer ExitCode: $($p.ExitCode)"
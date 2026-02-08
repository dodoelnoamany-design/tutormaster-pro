[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$url = 'https://github.com/git-for-windows/git/releases/download/v2.47.1.windows.1/Git-2.47.1-64-bit.exe'
$out = Join-Path $env:TEMP 'git-installer.exe'
Write-Output "Downloading Git installer..."
Invoke-WebRequest -Uri $url -OutFile $out
Write-Output 'Git installer downloaded, running...'
Start-Process -FilePath $out -ArgumentList '/VERYSILENT','/NORESTART' -Wait
Write-Output 'Git installed.'
$path = 'C:\Users\Silem\AppData\Local\Temp\vc_redist.x64.exe'
if (Test-Path $path) {
    Write-Output "Running installer with elevation: $path"
    $p = Start-Process -FilePath $path -ArgumentList '/install','/quiet','/norestart' -Verb RunAs -Wait -PassThru
    Write-Output "ExitCode: $($p.ExitCode)"
} else {
    Write-Output 'INSTALLER_NOT_FOUND'
}
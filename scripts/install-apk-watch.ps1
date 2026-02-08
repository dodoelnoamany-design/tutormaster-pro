$apkPath = Join-Path (Get-Location) 'android\app\build\outputs\apk\debug\app-debug.apk'
Write-Output "Watching for APK at: $apkPath"
while ($true) {
    if (Test-Path $apkPath) {
        $apk = (Get-Item $apkPath).FullName
        Write-Output "APK_FOUND: $apk"
        try {
            $adbDevices = & adb devices 2>&1
            Write-Output $adbDevices
        } catch {
            Write-Output "ADB_NOT_AVAILABLE"
            break
        }
        $connected = (& adb devices) -split "`n" | Where-Object { $_ -match "\tdevice$" }
        if ($connected.Count -gt 0) {
            Write-Output "DEVICE_CONNECTED"
            try {
                $installOut = & adb install -r --grant-permissions $apk 2>&1
                Write-Output $installOut
            } catch {
                Write-Output "ADB_INSTALL_FAILED"
            }
            Write-Output "INSTALL_ATTEMPT_DONE"
            break
        } else {
            Write-Output "NO_DEVICE_YET"
            Start-Sleep -Seconds 8
            continue
        }
    } else {
        Start-Sleep -Seconds 8
    }
}
Write-Output "Watcher exiting."
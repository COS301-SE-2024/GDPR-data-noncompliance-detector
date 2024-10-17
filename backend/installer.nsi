!define APP_NAME "GND_App"
!define EXE1 "flask_api.exe"
!define EXE2 "GND.exe"
!define ENV_VAR_NAME "SYS_VAR_KEY"
!define ENV_VAR_VALUE "qpn0Dx9zaqjQq9Lgc4b5seXOQsus3ZGu"

OutFile "${APP_NAME}_Installer.exe"
InstallDir $PROGRAMFILES\${APP_NAME}

Section "Install"
    SetOutPath $INSTDIR
    File /r "*.*"    ; Includes all files in the current directory
    CreateDirectory "$INSTDIR\locales"
    File /r "locales\*.*"
    CreateDirectory "$INSTDIR\resources"
    File /r "resources\*.*"
    CreateShortCut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${EXE2}"

    ; Set the environment variable permanently
    WriteRegStr HKCU "Environment" "${ENV_VAR_NAME}" "${ENV_VAR_VALUE}"
    WriteRegStr HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "${ENV_VAR_NAME}" "${ENV_VAR_VALUE}"
    
    ; Write the uninstaller
    WriteUninstaller "$INSTDIR\Uninstall.exe"
SectionEnd

Section "Run"
    ; Add the flask_api.exe to startup using registry
    WriteRegStr HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}_API" "$INSTDIR\${EXE1}"

    ; Start the API in the background
    ExecShell "open" "$INSTDIR\${EXE1}" "" SW_HIDE

    ; Run GND.exe
    ExecShell "open" "$INSTDIR\${EXE2}"
SectionEnd

Section "Uninstall"
    Delete "$DESKTOP\${APP_NAME}.lnk"
    ; Remove the environment variable
    DeleteRegValue HKCU "Environment" "${ENV_VAR_NAME}"
    DeleteRegValue HKLM "SYSTEM\CurrentControlSet\Control\Session Manager\Environment" "${ENV_VAR_NAME}"

    ; Remove flask_api from startup
    DeleteRegValue HKCU "Software\Microsoft\Windows\CurrentVersion\Run" "${APP_NAME}_API"
    
    RMDir /r "$INSTDIR"
SectionEnd

Function .onInstSuccess
    ; Run both the API and GND on installation success
    ExecShell "open" "$INSTDIR\${EXE1}" "" SW_HIDE
    ExecShell "open" "$INSTDIR\${EXE2}"
FunctionEnd

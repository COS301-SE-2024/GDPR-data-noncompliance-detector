; Define the output path for the installer
OutFile "GNDInstaller.exe"

; Define the default installation directory
InstallDir "$PROGRAMFILES\GND"

; Define the directory to be listed
!define SOURCE_DIR "dist/your-app-name"

; Include the necessary NSIS headers
!include "MUI2.nsh"

; Define the installer sections
Section "MainSection" SEC01
  ; Set the output path to the installation directory
  SetOutPath "$INSTDIR"

  ; List files and folders in the SOURCE_DIR
  File /r "${SOURCE_DIR}\*.*"

  ; Create shortcuts
  CreateShortCut "$DESKTOP\GND.lnk" "$INSTDIR\index.html"
  CreateShortCut "$SMPROGRAMS\GND\GND.lnk" "$INSTDIR\index.html"
SectionEnd

; Define the uninstaller section
Section "Uninstall"
  ; Remove the installed files
  Delete "$INSTDIR\*.*"
  RMDir /r "$INSTDIR"

  ; Remove the shortcuts
  Delete "$DESKTOP\GND.lnk"
  Delete "$SMPROGRAMS\GND\GND.lnk"
  RMDir "$SMPROGRAMS\GND"
SectionEnd

; Define the installer pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

; Define the uninstaller pages
!insertmacro MUI_UNPAGE_INSTFILES

; Define the language for the installer
LangString DESC01 ${LANG_ENGLISH} "Install GND Application"
LangString DESC02 ${LANG_ENGLISH} "Uninstall GND Application"

; Define the installer attributes
Name "GND Installer"
OutFile "GNDInstaller.exe"
InstallDir "$PROGRAMFILES\GND"
ShowInstDetails show
ShowUnInstDetails show
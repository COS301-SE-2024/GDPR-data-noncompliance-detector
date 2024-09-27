from PyInstaller.utils.hooks import collect_all

datas, binaries, hiddenimports = collect_all('en_core_web_sm')

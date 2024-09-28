# flask_api.spec
# -*- mode: python ; coding: utf-8 -*-
import os
from PyInstaller.utils.hooks import collect_submodules

block_cipher = None

# Path to the backend directory
backend_path = os.getcwd()

# Collect all submodules for hidden imports
hiddenimports = collect_submodules('backend')

# Include the assets directory
assets_path = os.path.join(backend_path, 'assets')

a = Analysis(
    ['flask_api.py'],
    pathex=[backend_path],
    binaries=[],
    datas=[
        (assets_path, 'assets'),(".env", ".")
    ],
    hiddenimports=hiddenimports,
    hookspath=['.'],
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='flask_api',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,  # Ensure the application runs in a console
    onefile=True  # Bundle everything into a single executable
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='flask_api',
)
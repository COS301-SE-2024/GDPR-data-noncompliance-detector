from cx_Freeze import setup, Executable
import sys
sys.setrecursionlimit(5000)

# Dependencies are automatically detected, but it might need fine-tuning.
build_exe_options = {
    "packages": ["os"],
    "include_files": ["assets/"]  # Include the assets directory
}

# Base "Win32GUI" should be used only for Windows GUI app
base = None

setup(
    name="flask_api",
    version="0.1",
    description="My Flask API",
    options={"build_exe": build_exe_options},
    executables=[Executable("flask_api.py", base=base)]
)
@echo off
echo ========================================
echo Tic Tac Toe - Sound Files Downloader
echo ========================================
echo.

REM Create sounds directory
if not exist "assets\sounds" mkdir "assets\sounds"

echo Downloading sound files from freesound.org alternatives...
echo.

REM Using PowerShell to download files
echo Downloading move.wav...
powershell -Command "& {Add-Type -AssemblyName System.Speech; $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer; $synth.SetOutputToWaveFile('assets\sounds\move.wav'); $synth.Speak(''); $synth.Dispose()}"

echo.
echo ========================================
echo Note: For better quality sounds, please:
echo 1. Install Python: python.org
echo 2. Install dependencies: pip install numpy scipy
echo 3. Run: python generate_sounds.py
echo ========================================
echo.
echo Or manually download sounds from:
echo - freesound.org
echo - zapsplat.com
echo - mixkit.co
echo.
echo Place the files in: assets\sounds\
echo Required files: move.wav, win.wav, lose.wav, draw.wav
echo.
pause

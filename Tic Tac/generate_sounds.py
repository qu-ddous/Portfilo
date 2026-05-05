#!/usr/bin/env python3
"""
Generate simple sound effects for Tic Tac Toe game
Requires: numpy, scipy
Install: pip install numpy scipy
"""

import numpy as np
from scipy.io import wavfile
import os

def generate_tone(frequency, duration, sample_rate=44100, volume=0.3):
    """Generate a simple tone"""
    t = np.linspace(0, duration, int(sample_rate * duration))
    wave = volume * np.sin(2 * np.pi * frequency * t)
    return wave

def generate_move_sound():
    """Generate a click sound for moves"""
    sample_rate = 44100
    duration = 0.1
    
    # Short click with two frequencies
    t = np.linspace(0, duration, int(sample_rate * duration))
    wave1 = 0.3 * np.sin(2 * np.pi * 800 * t)
    wave2 = 0.2 * np.sin(2 * np.pi * 1200 * t)
    wave = wave1 + wave2
    
    # Apply envelope to avoid clicks
    envelope = np.exp(-t * 30)
    wave = wave * envelope
    
    return (wave * 32767).astype(np.int16), sample_rate

def generate_win_sound():
    """Generate a victory sound"""
    sample_rate = 44100
    duration = 0.8
    
    # Ascending notes
    notes = [523, 659, 784, 1047]  # C, E, G, C (major chord)
    wave = np.array([])
    
    for note in notes:
        note_duration = duration / len(notes)
        t = np.linspace(0, note_duration, int(sample_rate * note_duration))
        note_wave = 0.3 * np.sin(2 * np.pi * note * t)
        envelope = np.exp(-t * 5)
        note_wave = note_wave * envelope
        wave = np.concatenate([wave, note_wave])
    
    return (wave * 32767).astype(np.int16), sample_rate

def generate_lose_sound():
    """Generate a defeat sound"""
    sample_rate = 44100
    duration = 0.6
    
    # Descending notes
    notes = [523, 440, 349, 262]  # C, A, F, C (descending)
    wave = np.array([])
    
    for note in notes:
        note_duration = duration / len(notes)
        t = np.linspace(0, note_duration, int(sample_rate * note_duration))
        note_wave = 0.3 * np.sin(2 * np.pi * note * t)
        envelope = np.exp(-t * 4)
        note_wave = note_wave * envelope
        wave = np.concatenate([wave, note_wave])
    
    return (wave * 32767).astype(np.int16), sample_rate

def generate_draw_sound():
    """Generate a draw sound"""
    sample_rate = 44100
    duration = 0.5
    
    # Two alternating tones
    t = np.linspace(0, duration, int(sample_rate * duration))
    wave1 = 0.2 * np.sin(2 * np.pi * 440 * t)
    wave2 = 0.2 * np.sin(2 * np.pi * 494 * t)
    
    # Alternate between the two
    mask = (t * 8) % 2 < 1
    wave = np.where(mask, wave1, wave2)
    
    envelope = np.exp(-t * 3)
    wave = wave * envelope
    
    return (wave * 32767).astype(np.int16), sample_rate

def main():
    # Create assets/sounds directory if it doesn't exist
    os.makedirs('assets/sounds', exist_ok=True)
    
    print("Generating sound files...")
    
    # Generate move sound
    print("  - move.wav")
    wave, rate = generate_move_sound()
    wavfile.write('assets/sounds/move.wav', rate, wave)
    
    # Generate win sound
    print("  - win.wav")
    wave, rate = generate_win_sound()
    wavfile.write('assets/sounds/win.wav', rate, wave)
    
    # Generate lose sound
    print("  - lose.wav")
    wave, rate = generate_lose_sound()
    wavfile.write('assets/sounds/lose.wav', rate, wave)
    
    # Generate draw sound
    print("  - draw.wav")
    wave, rate = generate_draw_sound()
    wavfile.write('assets/sounds/draw.wav', rate, wave)
    
    print("\n✅ All sound files generated successfully!")
    print("Sound files are located in: assets/sounds/")

if __name__ == "__main__":
    main()

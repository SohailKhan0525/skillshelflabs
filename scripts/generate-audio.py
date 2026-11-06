"""Render the three original, sample-free AFTERHOURS preview loops.

Requires Python, NumPy and ffmpeg. Run from the project root.
The output is committed, so the site build does not need Python or ffmpeg.
"""
from pathlib import Path
import subprocess
import wave
import numpy as np

RATE, DURATION = 32000, 24
rng = np.random.default_rng(33)
output = Path(__file__).resolve().parents[1] / 'public' / 'audio'
output.mkdir(parents=True, exist_ok=True)

def place(mix, sound, seconds, gain=1):
    start = int(seconds * RATE)
    size = min(len(sound), len(mix) - start)
    if size > 0:
        mix[start:start + size] += sound[:size] * gain

for name, bpm, root in [('slow', 80, 110), ('deep', 112, 130.8128), ('electric', 124, 146.8324)]:
    mix = np.zeros(RATE * DURATION)
    beat = 60 / bpm
    # Gentle Rhodes-like chord bed, independently synthesized partials.
    for bar in range(int(DURATION / (beat * 4)) + 1):
        base = root * [1, .890899, .793701, .890899][bar % 4]
        t = np.arange(int(beat * 4.5 * RATE)) / RATE
        envelope = (1 - np.exp(-t * 15)) * np.exp(-t * 1.1)
        chord = sum((np.sin(2 * np.pi * base * ratio * t) + .16 * np.sin(2 * np.pi * base * ratio * 3 * t)) for ratio in [1, 1.189207, 1.498307, 1.781797])
        place(mix, chord * envelope, bar * beat * 4, .075)
    for step in range(int(DURATION / beat) + 1):
        # Rounded kick with an exponential pitch drop.
        t = np.arange(int(.32 * RATE)) / RATE
        kick = np.sin(2 * np.pi * (48 * t + 65 * (1 - np.exp(-t * 24)) / 24)) * np.exp(-t * 14)
        if name != 'slow' or step % 4 in [0, 2]:
            place(mix, kick, step * beat, .35)
        # Offbeat hi-hat: differentiated noise, softened and short.
        t = np.arange(int(.09 * RATE)) / RATE
        noise = rng.normal(0, 1, len(t))
        hat = np.diff(noise, prepend=0) * np.exp(-t * 70)
        place(mix, hat, step * beat + beat * .5, .025)
        if step % 2:
            t = np.arange(int(.15 * RATE)) / RATE
            snare = rng.normal(0, 1, len(t)) * np.exp(-t * 35)
            place(mix, snare, step * beat, .06)
        t = np.arange(int(beat * .8 * RATE)) / RATE
        bass = np.sin(2 * np.pi * root / 2 * [1, 1, .890899, .793701][(step // 4) % 4] * t)
        place(mix, bass * (1 - np.exp(-t * 50)) * np.exp(-t * 6), step * beat + .025, .18)
        if name == 'electric':
            for off in [0, .5]:
                t = np.arange(int(.28 * RATE)) / RATE
                note = root * 2 * [1, 1.498307, 1.781797, 2, 1.189207, 1.498307, 2, 1.781797][(step * 2 + int(off * 2)) % 8]
                arp = np.sin(2 * np.pi * note * t) * (1 - np.exp(-t * 100)) * np.exp(-t * 14)
                place(mix, arp, (step + off) * beat, .1)
    # Short delay and an unobtrusive fade make repeated previews comfortable.
    delay = int(beat * .75 * RATE)
    mix[delay:] += mix[:-delay].copy() * .14
    fade = int(.35 * RATE)
    mix[:fade] *= np.linspace(0, 1, fade)
    mix[-fade:] *= np.linspace(1, 0, fade)
    mix = np.tanh(mix * 1.2) * .8
    pcm = (mix * 32767).astype('<i2')
    wav = output / f'{name}.wav'
    with wave.open(str(wav), 'wb') as file:
        file.setnchannels(1)
        file.setsampwidth(2)
        file.setframerate(RATE)
        file.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', str(wav), '-codec:a', 'libmp3lame', '-b:a', '96k', str(output / f'{name}.mp3')], check=True)
    wav.unlink()
    print(f'Rendered {name}.mp3')

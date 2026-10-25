# micro:bit hardware for MakeCode Arcade

Use the micro:bit V2's own hardware in MakeCode Arcade games when the micro:bit is plugged into an Arcade shield or kit: buttons A/B, the touch logo, accelerometer and gestures, compass, temperature, light and sound sensors, the 5×5 LEDs (including scrolling text), the micro:bit's sound expressions, data logging and the edge-connector pins.

Arcade normally can't reach any of these: it runs on the micro:bit without starting the micro:bit's own drivers. This extension starts each driver the first time a block needs it. See [ANALYSIS.md](ANALYSIS.md) for the details.

## Use as Extension

1. Open [MakeCode Arcade](https://arcade.makecode.com) and a project.
2. Click **Extensions** (under the gearwheel menu or in the toolbox).
3. Search for **https://github.com/OWNER/arcade-microbit-hardware** and import it.
4. A **micro:bit** category appears in the toolbox.

When you download, choose a micro:bit Arcade shield (the "N3" / micro:bit hardware) or the Game Designer's Kit.

## Blocks

All blocks are in the `microbit_hardware` namespace.

### Buttons and touch
```typescript
microbit_hardware.onButton(MicrobitButton.A, MicrobitButtonEvent.Click, function () { })
microbit_hardware.buttonIsPressed(MicrobitButton.AB)
microbit_hardware.onTouch(MicrobitTouchPin.Logo, MicrobitTouchEvent.Pressed, function () { })
microbit_hardware.isTouched(MicrobitTouchPin.P0)
microbit_hardware.setTouchMode(MicrobitTouchPin.P1, MicrobitTouchMode.Capacitive)
```
These are the buttons on the micro:bit itself, not the Arcade controller buttons. The logo uses capacitive touch; pins P0–P2 default to resistive touch (hold GND with your other hand).

### Motion and compass
```typescript
microbit_hardware.setOrientation(MicrobitLogoDirection.Up, MicrobitLedFacing.TowardPlayer)
microbit_hardware.acceleration(MicrobitDimension.X)         // milli-g
microbit_hardware.rotation(MicrobitRotation.Pitch)          // degrees
microbit_hardware.onGesture(MicrobitGesture.Shake, function () { })
microbit_hardware.isGesture(MicrobitGesture.ScreenUp)
microbit_hardware.compassHeading()                          // degrees, 0 = north
microbit_hardware.magneticForce(MicrobitDimension.Strength) // µT
microbit_hardware.calibrateCompass()
```
**Orientation.** By default the axes are the micro:bit board's, as in MakeCode for micro:bit. If your shield holds the micro:bit turned or facing backwards, use **set micro:bit orientation**: look at the screen, note which way the micro:bit's logo (the end opposite the gold pins) points and whether its LEDs face you. After that, x/y/z, pitch/roll, gestures ("logo up" then means "top of the screen up") and the compass heading are all relative to the screen. Most shields hold the micro:bit logo up, facing the player, which is the default.

**Compass.** The first compass reading starts calibration: a 5×5 grid appears on the Arcade screen; tilt the micro:bit until every square is filled. The calibration is saved on the micro:bit and reused next time; "clear micro:bit compass calibration" forgets it.

### Environment and microphone
```typescript
microbit_hardware.temperature(MicrobitTemperatureUnit.Celsius)
microbit_hardware.lightLevel()                    // 0-255, uses the LED matrix
microbit_hardware.soundLevel()                    // 0-255
microbit_hardware.onSound(MicrobitSound.Loud, function () { })
microbit_hardware.setSoundThreshold(MicrobitSound.Loud, 128)
```
The microphone LED next to the logo turns on once the microphone is used.

### Sound expressions
```typescript
microbit_hardware.playSoundExpression(MicrobitSoundExpression.Giggle, MicrobitPlayMode.UntilDone)
```
The micro:bit's giggle, happy, hello, mysterious, sad, slide, soaring, spring, twinkle and yawn. They are played by Arcade's own sound system (micro:bit speaker and/or shield speaker), so they also work in the simulator and respect Arcade's volume.

### 5×5 LEDs
```typescript
microbit_hardware.showString("Hi!", MicrobitPlayMode.InBackground)
microbit_hardware.showNumber(42, MicrobitPlayMode.UntilDone)
microbit_hardware.plot(2, 2)
microbit_hardware.plotBrightness(0, 0, 64)
microbit_hardware.unplot(2, 2)
microbit_hardware.clearLeds()
```
"until done" waits for the text to finish scrolling; "in background" lets the game keep running.

### Data logging
```typescript
microbit_hardware.setColumnTitles("x", "y")
microbit_hardware.logData(
    microbit_hardware.createCV("x", microbit_hardware.acceleration(MicrobitDimension.X)),
    microbit_hardware.createCV("y", microbit_hardware.acceleration(MicrobitDimension.Y)))
microbit_hardware.includeTimestamp(MicrobitLogTimestamp.Seconds)
microbit_hardware.onLogFull(function () { })
microbit_hardware.deleteLog(MicrobitLogDelete.Fast)
```
Works like MakeCode for micro:bit's data logger: rows are stored on the micro:bit and appear in **MY_DATA.HTM** on the MICROBIT drive, where you can view, chart and download them. A time column (seconds) is added by default. In the simulator, logged rows are printed to the console instead.

### Pins
```typescript
microbit_hardware.digitalReadPin(MicrobitPin.P1)
microbit_hardware.digitalWritePin(MicrobitPin.P2, 1)
microbit_hardware.analogReadPin(MicrobitAnalogPin.P0)  // 0-1023
microbit_hardware.analogWritePin(MicrobitPin.P1, 512)
microbit_hardware.servoWritePin(MicrobitPin.P2, 90)
microbit_hardware.onPinEvent(MicrobitPin.P1, MicrobitPinEvent.Rise, function () { })
microbit_hardware.pinIsFree(MicrobitPin.P8)
```

## Pins used by Arcade hardware

The pin blocks ignore pins that the Arcade hardware uses for its screen or buttons (`pinIsFree` tells you which):

| Hardware | Pins in use |
|---|---|
| micro:bit Arcade shields (N3) | P8, P13, P14, P15, P16, P19. Older shields with a button chip also use P9 and P20. P12 is used when a Jacdac adapter is attached. |
| Game Designer's Kit | P1–P5, P8–P16. The LED matrix, scrolling text and light level are not available. |

The LED matrix (and light level) uses P3, P4, P6, P7 and P10. "micro:bit LED matrix off" frees them again.

This extension also fills in the missing pin definitions so Arcade's own **Pins** blocks (edge-connector extension) work for P3–P20 on the micro:bit.

## Simulator

The Arcade simulator has no micro:bit, so in the browser the sensor blocks return neutral values (0, `false`, 21 °C, light 127) and micro:bit events never fire. Sound expressions play normally, and logged data goes to the console. Use **running on micro:bit** to tell the two apart.

## Supported hardware

micro:bit V2 in any Arcade shield or the Game Designer's Kit. Games using the extension still build for other Arcade boards; there the blocks return the same neutral values as in the simulator.

## License

MIT

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

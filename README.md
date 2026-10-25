# micro:bit hardware for MakeCode Arcade

Use the micro:bit V2's own hardware in MakeCode Arcade games when the micro:bit is plugged into an Arcade shield or kit: buttons A/B, the touch logo, accelerometer and gestures, compass, temperature, light and sound sensors, the 5×5 LEDs and the edge-connector pins.

Arcade normally can't reach any of these: it runs on the micro:bit without starting the micro:bit's own drivers. This extension starts each driver the first time a block needs it. See [ANALYSIS.md](ANALYSIS.md) for the details.

## Use as Extension

1. Open [MakeCode Arcade](https://arcade.makecode.com) and a project.
2. Click **Extensions** (under the gearwheel menu or in the toolbox).
3. Search for **https://github.com/OWNER/arcade-microbit-hardware** and import it.
4. A **micro:bit** category appears in the toolbox.

When you download, choose a micro:bit Arcade shield (the "N3" / micro:bit hardware) or the Game Designer's Kit.

## Blocks

### Buttons and touch
```typescript
microbit.onButton(MicrobitButton.A, MicrobitButtonEvent.Click, function () { })
microbit.buttonIsPressed(MicrobitButton.AB)
microbit.onTouch(MicrobitTouchPin.Logo, MicrobitTouchEvent.Pressed, function () { })
microbit.isTouched(MicrobitTouchPin.P0)
microbit.setTouchMode(MicrobitTouchPin.P1, MicrobitTouchMode.Capacitive)
```
These are the buttons on the micro:bit itself, not the Arcade controller buttons. The logo uses capacitive touch; pins P0–P2 default to resistive touch (hold GND with your other hand).

### Motion and compass
```typescript
microbit.acceleration(MicrobitDimension.X)        // milli-g
microbit.rotation(MicrobitRotation.Pitch)         // degrees
microbit.onGesture(MicrobitGesture.Shake, function () { })
microbit.isGesture(MicrobitGesture.ScreenUp)
microbit.compassHeading()                         // degrees, 0 = north
microbit.magneticForce(MicrobitDimension.Strength) // µT
microbit.calibrateCompass()
```
Axes are those of the micro:bit board, as in MakeCode for micro:bit; depending on how your shield holds the micro:bit they may not line up with the screen.

The first compass reading starts calibration: a 5×5 grid appears on the Arcade screen; tilt the micro:bit until every square is filled. The calibration is saved on the micro:bit and reused next time; "clear micro:bit compass calibration" forgets it.

### Environment and sound
```typescript
microbit.temperature(MicrobitTemperatureUnit.Celsius)
microbit.lightLevel()                    // 0-255, uses the LED matrix
microbit.soundLevel()                    // 0-255
microbit.onSound(MicrobitSound.Loud, function () { })
microbit.setSoundThreshold(MicrobitSound.Loud, 128)
```
The microphone LED next to the logo turns on once the microphone is used.

### Pins
```typescript
microbit.digitalReadPin(MicrobitPin.P1)
microbit.digitalWritePin(MicrobitPin.P2, 1)
microbit.analogReadPin(MicrobitAnalogPin.P0)  // 0-1023
microbit.analogWritePin(MicrobitPin.P1, 512)
microbit.servoWritePin(MicrobitPin.P2, 90)
microbit.onPinEvent(MicrobitPin.P1, MicrobitPinEvent.Rise, function () { })
microbit.pinIsFree(MicrobitPin.P8)
```

### 5×5 LEDs
```typescript
microbit.plot(2, 2)
microbit.plotBrightness(0, 0, 64)
microbit.unplot(2, 2)
microbit.clearLeds()
```

## Pins used by Arcade hardware

The pin blocks ignore pins that the Arcade hardware uses for its screen or buttons (`pinIsFree` tells you which):

| Hardware | Pins in use |
|---|---|
| micro:bit Arcade shields (N3) | P8, P13, P14, P15, P16, P19. Older shields with a button chip also use P9 and P20. P12 is used when a Jacdac adapter is attached. |
| Game Designer's Kit | P1–P5, P8–P16. The LED matrix and light level are not available. |

The LED matrix (and light level) uses P3, P4, P6, P7 and P10. "micro:bit LED matrix off" frees them again.

This extension also fills in the missing pin definitions so Arcade's own **Pins** blocks (edge-connector extension) work for P3–P20 on the micro:bit.

## Simulator

The Arcade simulator has no micro:bit, so in the browser the sensor blocks return neutral values (0, `false`, 21 °C, light 127) and micro:bit events never fire. Use **running on micro:bit** to tell the two apart.

## Supported hardware

micro:bit V2 in any Arcade shield or the Game Designer's Kit. Games using the extension still build for other Arcade boards; there the blocks return the same neutral values as in the simulator. The Calliope mini 3 GameKit uses the same firmware as micro:bit shields but has a different motion sensor (motion and compass blocks return 0); its other features are untested.

## License

MIT

#### Metadata (used for search, rendering)

* for PXT/arcade
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>

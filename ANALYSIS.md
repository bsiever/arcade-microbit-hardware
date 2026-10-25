# micro:bit V2 hardware in MakeCode Arcade — analysis

Sources examined (the three repos in this folder, plus what they pin):

| Component | Version used by Arcade |
|---|---|
| pxt-arcade | 4.2.1 (`f938e1db`) |
| pxt-common-packages | 14.2.1 (holds all the C++ runtime libraries Arcade uses) |
| codal-microbit-v2 | `thomasjball/codal-microbit-v2@13a0d323` = lancaster v0.3.5 + a newer codal-core fork. The local `codal-microbit-v2` clone (lancaster master) is a few commits newer but equivalent for this purpose. |
| codal-core / codal-nrf52 | `thomasjball/codal-core@74816bb5`, `codal-nrf52@1fbb7240` |

Statements marked *(source)* come from reading code and have not been checked on hardware.

## 1. How Arcade runs on a micro:bit V2 today

* A micro:bit in an Arcade shield is built as hardware variant **`hw---n3`** ("NRF52833 board": ELECFREAKS, Kittenbot Newbit, Kitronik, iCShop, CodeCTRL, Arcade Pro, TomatoCube **and the Calliope mini 3 GameKit**) or **`hw---gdk`** (Game Designer's Kit). Both set `ARCADE_MBIT_CODAL=1`, `MICROBIT_CODAL=0`, `DEVICE_BLE=0` and link the micro:bit CODAL target (`codalBinary: MICROBIT`).
* The Arcade runtime (`pxt-common-packages/libs/core/codal.cpp`) **never creates the `MicroBit uBit` object**. It only creates the message bus, the system timer and whatever a library asks for. So none of the micro:bit's own drivers (`MicroBitIO`, ADC, touch sensor, accelerometer/compass, thermometer, audio/microphone, LED display, buttons) exist, even though their code is compiled into the firmware.
* The generic Arcade sensor libraries (`accelerometer`, `lightsensor`, `thermometer`, `microphone`) were written for Adafruit-style boards and are driven by config keys (pin numbers) that the n3/gdk variants don't set.

### What works

| Feature | Status |
|---|---|
| Screen, game controls | Through the shield (n3 "smart display" over SPI P13/P14/P15/P8, or direct ST7735 on gdk). |
| Sound | Arcade mixer → PWM on P0.00, i.e. the micro:bit's own speaker (and the shield's if wired). |
| Settings / high scores | Flash storage (`ARCADE_MBIT_CODAL` path in `settings.cpp`). |
| Radio | `radio` / `radio-broadcast` extensions use `NRF52Radio` on nRF52 *(source)*. |
| Edge-connector pins P0–P2 (n3), P0 & P6 (gdk) | Digital read/write and PWM via the `edge-connector` extension. |

### What is missing or broken

| Feature | Today | Why |
|---|---|---|
| **Accelerometer** (`controller.acceleration`, `controller.onGesture`, rotation) | Blocks exist in the Controller extension but always return 0 / never fire *(source)* | `accelerometer` lib only mounts a sensor if `CFG_PIN_ACCELEROMETER_SDA/INT` are set (not set for n3/gdk). Its driver list is LIS3DH/MMA8453/MPU6050; the micro:bit has an LSM303AGR. |
| **Compass** | No blocks | Nothing in Arcade wraps a magnetometer. |
| **Light level** (`controller.lightLevel`) | Always 127 *(source)* | `lightsensor` expects an analog light sensor pin (`CFG_PIN_LIGHT`). The micro:bit measures light with its LED matrix, which Arcade never drives. |
| **Temperature** (`controller.temperature`) | Always 21 °C *(source)* | `thermometer` expects a thermistor pin. The micro:bit uses the nRF52's internal TEMP sensor. |
| **Microphone** | No blocks; Arcade's (hidden) `microphone` lib would not work | It drives a digital PDM mic (`NRF52PDM`). The micro:bit V2 has an analog mic on P0.05, powered by P0.20, read through the ADC. |
| **micro:bit buttons A/B** | No blocks (except on gdk, where P5/P11 are wired as Arcade A/B) | Arcade's controller A/B are the shield's buttons. |
| **Touch logo / touch pins** | No blocks; capacitive touch would dereference a NULL sensor *(source)* | `NRF52Pin::touchSensor` is only set by `MicroBitIO`. |
| **Analog read** (`pins.analogRead`) | Returns an error code, not a reading *(source)* | `NRF52Pin::adc` is only set by `MicroBitIO`. This is why `hw---gdk/analog.cpp` drives the SAADC registers by hand. |
| **Edge-connector pins P3–P20** | `pins.P3` … `pins.P20` look up config keys that n3/gdk don't define → NULL pin → crash *(source)* | Only P0–P2 (n3) / P0, P6 (gdk) are in `config.ts`. |
| **5×5 LED matrix** | No driver, no blocks | — |
| **Default I2C** (`pins.i2c…` blocks) | No `CFG_PIN_SDA/SCL` → NULL pins *(source)* | On n3, P19/P20 are also assigned to the backlight / button multiplexer of older shields. |
| **Bluetooth** | Not available | `DEVICE_BLE=0`. |
| **Simulator** | No micro:bit board in the Arcade simulator | Extensions can't add simulator hardware. |

### Available in CODAL (C++) but not exposed as Arcade blocks

All of these are already compiled into the Arcade micro:bit firmware (codal-core, codal-nrf52, codal-microbit-v2):

* `LSM303Accelerometer` / `LSM303Magnetometer` (+ gestures, tilt-compensated heading), `MicroBitCompassCalibrator` math
* `NRF52ADC` (analog pins + microphone stream), `LevelDetectorSPL` (sound level, loud/quiet thresholds, clap detection)
* `NRF52TouchSensor` + `TouchButton` (capacitive logo and pins), resistive touch
* `NRF52LEDMatrix` / `MicroBitDisplay` (5×5 LEDs, greyscale, light sensing, scrolling text/images)
* `MicroBitThermometer` (nRF TEMP)
* `Button` / `MultiButton` (A, B, A+B, click/long-click/hold)
* Pin events (rise/fall/pulse), pulse timing, servo/PWM period
* `MicroBitLog` data logging (via `MicroBitPowerManager` / `MicroBitUSBFlashManager` and the USB interface chip)
* `SoundExpressions` (giggle, happy, …) — but these play through `MicroBitAudio`'s own mixer, which would fight Arcade's mixer for the speaker
* Not wrapped by the extension: sleep / wake-on-pin, `MicroBitRadio` datagram extras, BLE services.

## 2. Is an extension enough?

**Yes, for the sensors, buttons, touch, pins, LED matrix and data logging.** The pieces line up:

1. The drivers are already linked into the micro:bit firmware; an extension's C++ can include their headers and create them.
2. They can be created lazily without `MicroBit uBit`, with the same parameters `MicroBit.cpp` uses.
3. Hardware resources are free: `pxt::allocateTimer()` hands out TIMER1/2/0/3 (system timer takes one), TIMER4 is outside that pool; the micro:bit drivers' fixed PPI/GPIOTE channels (ADC 0–1, touch 2, LED matrix 3–7) aren't used by the Arcade runtime; the internal I2C bus (P0.16/P0.08) is free.
4. `pxt.json` `fileDependencies` lets an extension add pin config **only** for `hw---n3` / `hw---gdk`, which also repairs the built-in edge-connector blocks for P3–P20.
5. C++ stubs (`#if ARCADE_MBIT_CODAL`) keep the extension compiling for every other Arcade board.

I verified this by building the extension locally with the pxt CLI and the exact CODAL commits Arcade pins: full firmware builds and links for **hw---n3** and **hw---gdk**, and the extension's C++ also compiles for **samd51** (stub path). The browser (simulator) build passes too.

**Changes outside the extension are needed for:**

* Making Arcade's *existing* Controller-extension blocks (`controller.acceleration`, `onGesture`, `lightLevel`, `temperature`) work on micro:bit — `accelhw.cpp` already defines `pxt::getAccelerometer()`, so an extension can't replace it. Fix belongs in pxt-common-packages / `hw---n3` config.
* Fixing `pins.analogRead` / capacitive touch for everyone (set `NRF52Pin::adc` / `touchSensor` in `core---nrf52` when `ARCADE_MBIT_CODAL`), and adding P3–P20 to `hw---n3/config.ts`.

Drafts of these core changes (not submitted) are in `../upstream-drafts/`.
* Bluetooth (needs `DEVICE_BLE=1`, the SoftDevice and a different flash layout).
* Simulator visuals for the micro:bit.
* `hw---gdk/analog.cpp` reprograms the SAADC directly every 5 s for its battery LED; that will disturb the extension's ADC (analog read and microphone) on the GDK. Upstream fix: have it use `NRF52Pin::adc` when present.

## 3. The extension (`arcade-microbit-hardware`)

Namespace `microbit_hardware`, toolbox category **micro:bit**: buttons A/B/A+B (events + state), logo/P0–P2 touch (capacitive/resistive), shield orientation, acceleration, rotation, gestures (+ range), compass heading with an on-screen calibration game (saved in flash), magnetic force, temperature, light level, sound level / loud-quiet events / thresholds, the ten micro:bit sound expressions, show string / show number (scrolling) and plot/unplot/brightness on the 5×5 LEDs, data logging (MY_DATA.HTM), digital & analog read/write, servo, pull, pin rise/fall/pulse events, "running on micro:bit".

Design notes:

* Everything is created on first use, so a game that doesn't use a sensor pays nothing (no timer, no I2C traffic).
* Pins the hardware variant uses for the screen or GPIO buttons are refused by the pin blocks (`pin … is free` reports this). On gdk that includes the LED-matrix columns, so the LED matrix and light level are unavailable there.
* Events use `control.onEvent`, so — like Arcade's own controller events — they belong to the current scene.
* **Orientation** rewrites the CODAL `CoordinateSpace` shared by the accelerometer and magnetometer, so x/y/z, pitch/roll, gestures and the compass heading all follow the screen. (Every combination of "logo up/right/down/left" × "facing toward/away" is one of CODAL's 8 upside-down/rotation settings; the code finds the matching one.)
* **Scrolling text** uses `MicroBitDisplay` (the LED-matrix driver plus CODAL's text animation).
* **Sound expressions** are re-implemented in TypeScript on top of Arcade's own `music.createSoundEffect`, using the micro:bit's expression data. Using CODAL's `MicroBitAudio` would start a second mixer on the speaker pin. Bonus: they work in the simulator. Arpeggio frames are played note by note; vibrato/tremolo/warble use Arcade's fixed effect depths, so they sound close to, not identical to, a micro:bit.
* **Data logging** uses CODAL's `MicroBitLog`. Its helpers (`MicroBitPowerManager`, `MicroBitUSBFlashManager`) want a `MicroBitIO`, but only use its `irq1` pin; creating a real `MicroBitIO` would steal every pin's interrupt routing from Arcade. `microbit-log.cpp` therefore hands them a MicroBitIO-shaped block of memory in which only `irq1` is constructed. That depends on codal-microbit-v2 internals (true for v0.3.x) — re-check if Arcade moves to a newer CODAL. It lives in its own file because pxt's pin macros clash with the micro:bit headers. The power manager also brings back the micro:bit's "hold reset to power off" behaviour.

## 4. Open questions and risks

Decisions (Oct 25):

1. micro:bit only; Calliope mini 3 is not supported (motion blocks return 0 there).
2. Shield orientation setting added.
3. Added scrolling text, sound expressions and data logging; sleep is out of scope.
4. Namespace `microbit_hardware`.
5. Core fixes drafted in `upstream-drafts/`, not being submitted for now.

Needs hardware testing:

* Cloud compile: my build used GCC 13; Arcade's compile service uses an older GCC in Docker. Low risk, but the first download is the real test.
* Gesture detection runs from CODAL's idle callback; a busy Arcade game loop could make gestures sluggish.
* LED matrix (TIMER4, GPIOTE/PPI) alongside the n3 smart display.
* The microphone LED stays on once the microphone is used (P0.20 powers the mic).
* On older n3 shields that still use the button multiplexer, P9/P20 are busy even though the pin blocks allow them.
* Data logging: needs micro:bit interface firmware with I2C flash support (any recent DAPLink). The fake-`MicroBitIO` approach is the riskiest code in the extension.
* Orientation: only checked logically; confirm the direction of "logo points right" on a real shield.
* Timers: system timer + ADC + touch use 3 of the 4 pooled timers (LED matrix uses TIMER4). An extension that also wants a timer (e.g. Jacdac) still gets one.

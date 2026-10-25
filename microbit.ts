// Blocks for the micro:bit V2's on-board hardware when it runs MakeCode Arcade
// (micro:bit Arcade shields and kits: hardware variants hw---n3 and hw---gdk).
//
// Each block calls a C++ function from microbit-hw.cpp on the device. The TypeScript bodies of the
// `//% shim=` functions below only run in the browser simulator, which has no micro:bit, so
// there they return neutral values (0, false, 21°C ...) and events never fire.

enum MicrobitButton {
    //% block="A"
    A = 0,
    //% block="B"
    B = 1,
    //% block="A+B"
    AB = 2
}

enum MicrobitButtonEvent {
    //% block="clicked"
    Click = 3,
    //% block="long clicked"
    LongClick = 4,
    //% block="pressed down"
    Down = 1,
    //% block="released"
    Up = 2
}

enum MicrobitTouchPin {
    //% block="logo"
    Logo = 36,
    //% block="P0"
    P0 = 2,
    //% block="P1"
    P1 = 3,
    //% block="P2"
    P2 = 4
}

enum MicrobitTouchEvent {
    //% block="pressed"
    Pressed = 3,
    //% block="touched"
    Touched = 1,
    //% block="released"
    Released = 2,
    //% block="long pressed"
    LongPressed = 4
}

enum MicrobitTouchMode {
    //% block="capacitive"
    Capacitive = 1,
    //% block="resistive"
    Resistive = 0
}

enum MicrobitDimension {
    //% block="x"
    X = 0,
    //% block="y"
    Y = 1,
    //% block="z"
    Z = 2,
    //% block="strength"
    Strength = 3
}

enum MicrobitRotation {
    //% block="pitch"
    Pitch = 0,
    //% block="roll"
    Roll = 1
}

enum MicrobitGesture {
    //% block="shake"
    Shake = 11,
    //% block="logo up"
    LogoUp = 1,
    //% block="logo down"
    LogoDown = 2,
    //% block="screen up"
    ScreenUp = 5,
    //% block="screen down"
    ScreenDown = 6,
    //% block="tilt left"
    TiltLeft = 3,
    //% block="tilt right"
    TiltRight = 4,
    //% block="free fall"
    FreeFall = 7,
    //% block="3g"
    ThreeG = 8,
    //% block="6g"
    SixG = 9,
    //% block="8g"
    EightG = 10
}

enum MicrobitAccelerometerRange {
    //% block="1g"
    OneG = 1,
    //% block="2g"
    TwoG = 2,
    //% block="4g"
    FourG = 4,
    //% block="8g"
    EightG = 8
}

enum MicrobitTemperatureUnit {
    //% block="°C"
    Celsius = 0,
    //% block="°F"
    Fahrenheit = 1
}

enum MicrobitSound {
    //% block="loud"
    Loud = 2,
    //% block="quiet"
    Quiet = 1
}

/**
 * micro:bit edge connector pins. The value is the nRF52833 pin number.
 * Pins used by your Arcade shield (screen, buttons, sound) must not be reused - see README.
 */
enum MicrobitPin {
    P0 = 2,
    P1 = 3,
    P2 = 4,
    P3 = 31,
    P4 = 28,
    P5 = 14,
    P6 = 37,
    P7 = 11,
    P8 = 10,
    P9 = 9,
    P10 = 30,
    P11 = 23,
    P12 = 12,
    P13 = 17,
    P14 = 1,
    P15 = 13,
    P16 = 34,
    P19 = 26,
    P20 = 32
}

/** Edge-connector pins with an analog input. */
enum MicrobitAnalogPin {
    P0 = 2,
    P1 = 3,
    P2 = 4,
    P3 = 31,
    P4 = 28,
    P10 = 30
}

enum MicrobitPinPull {
    //% block="up"
    Up = 1,
    //% block="down"
    Down = 0,
    //% block="none"
    None = 2
}

enum MicrobitPinEvent {
    //% block="rise"
    Rise = 2,
    //% block="fall"
    Fall = 3,
    //% block="pulse high"
    PulseHigh = 4,
    //% block="pulse low"
    PulseLow = 5
}

/**
 * Use the micro:bit V2's own sensors, buttons and pins in MakeCode Arcade.
 */
//% color="#D400D4" weight=90 icon="" block="micro:bit"
//% groups='["Buttons", "Touch", "Motion", "Compass", "Environment", "Sound", "Pins", "LED matrix", "Other"]'
namespace microbit {

    // =========================================================================================
    // Native functions (microbit-hw.cpp). Bodies run only in the simulator.
    // =========================================================================================

    //% shim=mbhw::isMicrobit
    function _isMicrobit(): boolean { return false }
    //% shim=mbhw::hasMotionSensor
    function _hasMotionSensor(): boolean { return false }
    //% shim=mbhw::acceleration
    function _acceleration(dim: number): number { return dim == 2 ? -1023 : (dim == 3 ? 1023 : 0) }
    //% shim=mbhw::rotation
    function _rotation(kind: number): number { return 0 }
    //% shim=mbhw::currentGesture
    function _currentGesture(): number { return 0 }
    //% shim=mbhw::gestureSource
    function _gestureSource(gesture: number): number { return 13 }
    //% shim=mbhw::setAccelerometerRange
    function _setAccelerometerRange(g: number): void { }
    //% shim=mbhw::compassHeading
    function _compassHeading(): number { return 0 }
    //% shim=mbhw::magneticForce
    function _magneticForce(dim: number): number { return 0 }
    //% shim=mbhw::compassIsCalibrated
    function _compassIsCalibrated(): boolean { return true }
    //% shim=mbhw::compassClearCalibration
    function _compassClearCalibration(): void { }
    //% shim=mbhw::compassRecordSample
    function _compassRecordSample(index: number): boolean { return false }
    //% shim=mbhw::compassComputeCalibration
    function _compassComputeCalibration(count: number): Buffer { return control.createBuffer(0) }
    //% shim=mbhw::compassSetCalibration
    function _compassSetCalibration(data: Buffer): void { }
    //% shim=mbhw::temperature
    function _temperature(): number { return 21 }
    //% shim=mbhw::buttonIsPressed
    function _buttonIsPressed(which: number): boolean { return false }
    //% shim=mbhw::buttonSource
    function _buttonSource(which: number): number { return 3200 + which }
    //% shim=mbhw::pinIsTouched
    function _pinIsTouched(pin: number, mode: number): boolean { return false }
    //% shim=mbhw::touchSource
    function _touchSource(pin: number, mode: number): number { return 100 + pin }
    //% shim=mbhw::soundLevel
    function _soundLevel(): number { return 0 }
    //% shim=mbhw::soundSource
    function _soundSource(): number { return 3210 }
    //% shim=mbhw::setSoundThreshold
    function _setSoundThreshold(which: number, value: number): void { }
    //% shim=mbhw::pinAvailable
    function _pinAvailable(pin: number): boolean { return false }
    //% shim=mbhw::digitalRead
    function _digitalRead(pin: number): number { return 0 }
    //% shim=mbhw::digitalWrite
    function _digitalWrite(pin: number, value: number): void { }
    //% shim=mbhw::analogRead
    function _analogRead(pin: number): number { return 0 }
    //% shim=mbhw::analogWrite
    function _analogWrite(pin: number, value: number): void { }
    //% shim=mbhw::analogSetPeriod
    function _analogSetPeriod(pin: number, micros: number): void { }
    //% shim=mbhw::servoWrite
    function _servoWrite(pin: number, degrees: number): void { }
    //% shim=mbhw::servoSetPulse
    function _servoSetPulse(pin: number, micros: number): void { }
    //% shim=mbhw::setPull
    function _setPull(pin: number, pull: number): void { }
    //% shim=mbhw::pinEventSource
    function _pinEventSource(pin: number, type: number): number { return 100 + pin }
    //% shim=mbhw::ledPlot
    function _ledPlot(x: number, y: number, brightness: number): void { }
    //% shim=mbhw::ledPoint
    function _ledPoint(x: number, y: number): number { return 0 }
    //% shim=mbhw::ledClear
    function _ledClear(): void { }
    //% shim=mbhw::ledSetBrightness
    function _ledSetBrightness(value: number): void { }
    //% shim=mbhw::ledEnable
    function _ledEnable(on: boolean): void { }
    //% shim=mbhw::lightLevel
    function _lightLevel(): number { return 127 }

    // =========================================================================================
    // Buttons
    // =========================================================================================

    /**
     * Run code when one of the micro:bit's own A/B buttons is clicked, long-clicked, pressed or released.
     * These are the buttons on the micro:bit board itself, not the Arcade controller buttons.
     */
    //% blockId=mbhw_on_button block="on micro:bit button $button $event"
    //% group="Buttons" weight=100
    export function onButton(button: MicrobitButton, event: MicrobitButtonEvent, handler: () => void): void {
        control.onEvent(_buttonSource(button), event, handler)
    }

    /**
     * Is one of the micro:bit's own A/B buttons currently pressed?
     */
    //% blockId=mbhw_button_pressed block="micro:bit button $button is pressed"
    //% group="Buttons" weight=99
    export function buttonIsPressed(button: MicrobitButton): boolean {
        return _buttonIsPressed(button)
    }

    // =========================================================================================
    // Touch
    // =========================================================================================

    // Default touch modes match MakeCode for micro:bit: logo capacitive, pins resistive.
    const touchModes: number[] = []
    function touchModeOf(pin: MicrobitTouchPin): number {
        const m = touchModes[pin]
        if (m === undefined || m === null)
            return pin == MicrobitTouchPin.Logo ? MicrobitTouchMode.Capacitive : MicrobitTouchMode.Resistive
        return m
    }

    /**
     * Run code when the touch logo or a touch pin (P0, P1, P2) is touched or released.
     */
    //% blockId=mbhw_on_touch block="on micro:bit $pin $event"
    //% group="Touch" weight=90
    export function onTouch(pin: MicrobitTouchPin, event: MicrobitTouchEvent, handler: () => void): void {
        control.onEvent(_touchSource(pin, touchModeOf(pin)), event, handler)
    }

    /**
     * Is the touch logo or touch pin being touched right now?
     */
    //% blockId=mbhw_is_touched block="micro:bit $pin is touched"
    //% group="Touch" weight=89
    export function isTouched(pin: MicrobitTouchPin): boolean {
        return _pinIsTouched(pin, touchModeOf(pin))
    }

    /**
     * Choose how a touch input senses a finger. Capacitive works through a light touch on the pad;
     * resistive needs you to also hold GND. Call this before using the touch blocks for that pin.
     */
    //% blockId=mbhw_touch_mode block="set micro:bit $pin touch mode to $mode"
    //% group="Touch" weight=88
    export function setTouchMode(pin: MicrobitTouchPin, mode: MicrobitTouchMode): void {
        touchModes[pin] = mode
        _touchSource(pin, mode)
    }

    // =========================================================================================
    // Motion (accelerometer)
    // =========================================================================================

    /**
     * Acceleration in milli-g (1000 = 1g) along an axis of the micro:bit, or the total strength.
     * Axes are relative to the micro:bit board, not to the Arcade screen.
     */
    //% blockId=mbhw_acceleration block="micro:bit acceleration (mg) $dimension"
    //% group="Motion" weight=80
    export function acceleration(dimension: MicrobitDimension): number {
        return _acceleration(dimension)
    }

    /**
     * Pitch or roll of the micro:bit in degrees.
     */
    //% blockId=mbhw_rotation block="micro:bit rotation (°) $kind"
    //% group="Motion" weight=79
    export function rotation(kind: MicrobitRotation): number {
        return _rotation(kind)
    }

    /**
     * Run code when the micro:bit is shaken, tilted, flipped or dropped.
     */
    //% blockId=mbhw_on_gesture block="on micro:bit $gesture"
    //% group="Motion" weight=78
    export function onGesture(gesture: MicrobitGesture, handler: () => void): void {
        control.onEvent(_gestureSource(gesture), gesture, handler)
    }

    /**
     * Is this gesture happening right now?
     */
    //% blockId=mbhw_is_gesture block="micro:bit is $gesture"
    //% group="Motion" weight=77
    export function isGesture(gesture: MicrobitGesture): boolean {
        _gestureSource(gesture) // makes sure the sensor runs at a suitable range
        return _currentGesture() == gesture
    }

    /**
     * Set the largest acceleration the accelerometer can measure.
     */
    //% blockId=mbhw_accel_range block="set micro:bit accelerometer range $range"
    //% group="Motion" weight=70 advanced=true
    export function setAccelerometerRange(range: MicrobitAccelerometerRange): void {
        _setAccelerometerRange(range)
    }

    // =========================================================================================
    // Compass
    // =========================================================================================

    const CALIBRATION_KEY = "#mbhw.compass"
    let calibrating = false

    function ensureCompassCalibrated(): void {
        if (!_isMicrobit() || _compassIsCalibrated())
            return
        const saved = settings.readBuffer(CALIBRATION_KEY)
        if (saved && saved.length == 28) {
            _compassSetCalibration(saved)
            return
        }
        calibrateCompass()
    }

    /**
     * Compass heading in degrees (0 = north, 90 = east). The first time it is used, and after
     * "calibrate compass", you are asked to tilt the micro:bit to calibrate it.
     */
    //% blockId=mbhw_compass_heading block="micro:bit compass heading (°)"
    //% group="Compass" weight=60
    export function compassHeading(): number {
        ensureCompassCalibrated()
        const h = _compassHeading()
        return h < 0 ? 0 : h
    }

    /**
     * Magnetic field in micro-tesla (µT) along an axis, or its total strength.
     */
    //% blockId=mbhw_magnetic_force block="micro:bit magnetic force (µT) $dimension"
    //% group="Compass" weight=59
    export function magneticForce(dimension: MicrobitDimension): number {
        return _magneticForce(dimension) / 1000
    }

    /**
     * Calibrate the compass: shows a 5x5 grid on the Arcade screen; tilt the micro:bit until every
     * square is filled. The result is saved on the micro:bit and reused next time.
     */
    //% blockId=mbhw_compass_calibrate block="calibrate micro:bit compass"
    //% group="Compass" weight=58
    export function calibrateCompass(): void {
        if (!_isMicrobit() || !_hasMotionSensor() || calibrating)
            return
        calibrating = true
        _compassClearCalibration()

        const visited: boolean[] = []
        for (let i = 0; i < 25; i++) visited.push(false)
        let samples = 0
        let cx = 2
        let cy = 2
        let blink = 0

        // same tilt thresholds as the micro:bit's own calibration game
        const cell = (v: number) => v < -680 ? 0 : v < -200 ? 1 : v > 680 ? 4 : v > 200 ? 3 : 2

        game.pushScene()
        scene.setBackgroundColor(15)
        scene.createRenderable(100, (target: Image, camera: scene.Camera) => {
            const size = 16
            const left = (screen.width - 5 * size) >> 1
            const top = 22
            target.printCenter("Tilt to fill the grid", 4, 1)
            for (let i = 0; i < 25; i++) {
                const x = left + (i % 5) * size
                const y = top + Math.idiv(i, 5) * size
                target.drawRect(x, y, size, size, 12)
                if (visited[i]) target.fillRect(x + 2, y + 2, size - 4, size - 4, 7)
            }
            if (blink < 3) {
                target.fillRect(left + cx * size + 4, top + cy * size + 4, size - 8, size - 8, 5)
            }
            target.printCenter("" + samples + " / 25", top + 5 * size + 4, 1)
        })

        while (samples < 25) {
            cx = cell(_acceleration(MicrobitDimension.X))
            cy = cell(_acceleration(MicrobitDimension.Y))
            const idx = cy * 5 + cx
            if (!visited[idx] && _compassRecordSample(samples)) {
                visited[idx] = true
                samples++
            }
            blink = (blink + 1) % 5
            pause(100)
        }

        const cal = _compassComputeCalibration(samples)
        if (cal.length == 28)
            settings.writeBuffer(CALIBRATION_KEY, cal)
        pause(500)
        game.popScene()
        calibrating = false
    }

    /**
     * Forget the saved compass calibration. The compass is calibrated again the next time it is used.
     */
    //% blockId=mbhw_compass_clear block="clear micro:bit compass calibration"
    //% group="Compass" weight=50 advanced=true
    export function clearCompassCalibration(): void {
        settings.remove(CALIBRATION_KEY)
        _compassClearCalibration()
    }

    // =========================================================================================
    // Environment
    // =========================================================================================

    /**
     * Temperature measured by the micro:bit's processor.
     */
    //% blockId=mbhw_temperature block="micro:bit temperature in $unit"
    //% group="Environment" weight=40
    export function temperature(unit: MicrobitTemperatureUnit): number {
        const c = _temperature()
        return unit == MicrobitTemperatureUnit.Celsius ? c : Math.round(c * 18 / 10 + 32)
    }

    /**
     * Light level from 0 (dark) to 255 (bright), measured with the micro:bit's LED matrix.
     * This turns the LED matrix on, which uses pins P3, P4, P6, P7 and P10.
     */
    //% blockId=mbhw_light_level block="micro:bit light level"
    //% group="Environment" weight=39
    export function lightLevel(): number {
        return _lightLevel()
    }

    // =========================================================================================
    // Sound (microphone)
    // =========================================================================================

    /**
     * Loudness heard by the micro:bit's microphone, from 0 (quiet) to 255 (loud).
     * The microphone LED next to the logo lights up while the microphone is on.
     */
    //% blockId=mbhw_sound_level block="micro:bit sound level"
    //% group="Sound" weight=30
    export function soundLevel(): number {
        return _soundLevel()
    }

    /**
     * Run code when the microphone hears a loud sound, or when it goes quiet.
     */
    //% blockId=mbhw_on_sound block="on micro:bit $sound sound"
    //% group="Sound" weight=29
    export function onSound(sound: MicrobitSound, handler: () => void): void {
        control.onEvent(_soundSource(), sound, handler)
    }

    /**
     * Set the level (0-255) that counts as a loud or a quiet sound.
     */
    //% blockId=mbhw_sound_threshold block="set micro:bit $sound sound threshold to $threshold"
    //% threshold.min=0 threshold.max=255 threshold.defl=128
    //% group="Sound" weight=28 advanced=true
    export function setSoundThreshold(sound: MicrobitSound, threshold: number): void {
        _setSoundThreshold(sound, threshold)
    }

    // =========================================================================================
    // Pins
    // =========================================================================================

    /**
     * Read a pin as digital: 0 (low) or 1 (high).
     */
    //% blockId=mbhw_digital_read block="micro:bit digital read pin $pin"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Pins" weight=20
    export function digitalReadPin(pin: MicrobitPin): number {
        return _digitalRead(pin)
    }

    /**
     * Set a pin to digital 0 (low) or 1 (high).
     */
    //% blockId=mbhw_digital_write block="micro:bit digital write pin $pin to $value"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% value.min=0 value.max=1
    //% group="Pins" weight=19
    export function digitalWritePin(pin: MicrobitPin, value: number): void {
        _digitalWrite(pin, value)
    }

    /**
     * Read an analog value from 0 to 1023 (0 V to 3.3 V).
     */
    //% blockId=mbhw_analog_read block="micro:bit analog read pin $pin"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=3
    //% group="Pins" weight=18
    export function analogReadPin(pin: MicrobitAnalogPin): number {
        return _analogRead(pin)
    }

    /**
     * Output a PWM signal; 0 is always off, 1023 is always on.
     */
    //% blockId=mbhw_analog_write block="micro:bit analog write pin $pin to $value"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% value.min=0 value.max=1023
    //% group="Pins" weight=17
    export function analogWritePin(pin: MicrobitPin, value: number): void {
        _analogWrite(pin, value)
    }

    /**
     * Set the PWM period of "analog write" on a pin, in microseconds.
     */
    //% blockId=mbhw_analog_period block="micro:bit analog set period pin $pin to (µs) $micros"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% micros.defl=20000
    //% group="Pins" weight=16 advanced=true
    export function analogSetPeriod(pin: MicrobitPin, micros: number): void {
        _analogSetPeriod(pin, micros)
    }

    /**
     * Move a servo connected to a pin to an angle (0-180°), or set a continuous servo's speed.
     */
    //% blockId=mbhw_servo_write block="micro:bit servo write pin $pin to $degrees"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% degrees.min=0 degrees.max=180 degrees.defl=90
    //% group="Pins" weight=15
    export function servoWritePin(pin: MicrobitPin, degrees: number): void {
        _servoWrite(pin, degrees)
    }

    /**
     * Set a servo pulse width in microseconds.
     */
    //% blockId=mbhw_servo_pulse block="micro:bit servo set pulse pin $pin to (µs) $micros"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% micros.defl=1500
    //% group="Pins" weight=14 advanced=true
    export function servoSetPulse(pin: MicrobitPin, micros: number): void {
        _servoSetPulse(pin, micros)
    }

    /**
     * Set the pull-up or pull-down resistor of an input pin.
     */
    //% blockId=mbhw_set_pull block="micro:bit set pull pin $pin to $pull"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Pins" weight=13 advanced=true
    export function setPull(pin: MicrobitPin, pull: MicrobitPinPull): void {
        _setPull(pin, pull)
    }

    /**
     * Run code when a pin's digital signal rises, falls, or completes a high or low pulse.
     * A pin reports either edges (rise/fall) or pulses, whichever was registered last.
     */
    //% blockId=mbhw_on_pin_event block="on micro:bit pin $pin $event"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Pins" weight=12 advanced=true
    export function onPinEvent(pin: MicrobitPin, event: MicrobitPinEvent, handler: () => void): void {
        const type = (event == MicrobitPinEvent.Rise || event == MicrobitPinEvent.Fall) ? 1 : 2
        control.onEvent(_pinEventSource(pin, type), event, handler)
    }

    /**
     * Can this pin be used? False if the Arcade screen or game buttons of this hardware use it
     * (the pin blocks ignore such pins), and always false in the simulator.
     */
    //% blockId=mbhw_pin_available block="micro:bit pin $pin is free"
    //% pin.fieldEditor="gridpicker" pin.fieldOptions.columns=4
    //% group="Pins" weight=11 advanced=true
    export function pinIsFree(pin: MicrobitPin): boolean {
        return _pinAvailable(pin)
    }

    // =========================================================================================
    // LED matrix
    // =========================================================================================

    /**
     * Turn on an LED of the micro:bit's 5x5 LED matrix.
     * The LED matrix uses pins P3, P4, P6, P7 and P10; don't use it if your shield needs them.
     */
    //% blockId=mbhw_led_plot block="micro:bit plot x $x y $y"
    //% x.min=0 x.max=4 y.min=0 y.max=4
    //% group="LED matrix" weight=10
    export function plot(x: number, y: number): void {
        _ledPlot(x, y, 255)
    }

    /**
     * Turn on an LED of the 5x5 matrix at a brightness from 0 to 255.
     */
    //% blockId=mbhw_led_plot_brightness block="micro:bit plot x $x y $y brightness $brightness"
    //% x.min=0 x.max=4 y.min=0 y.max=4 brightness.min=0 brightness.max=255 brightness.defl=255
    //% group="LED matrix" weight=9
    export function plotBrightness(x: number, y: number, brightness: number): void {
        _ledPlot(x, y, brightness)
    }

    /**
     * Turn off an LED of the 5x5 matrix.
     */
    //% blockId=mbhw_led_unplot block="micro:bit unplot x $x y $y"
    //% x.min=0 x.max=4 y.min=0 y.max=4
    //% group="LED matrix" weight=8
    export function unplot(x: number, y: number): void {
        _ledPlot(x, y, 0)
    }

    /**
     * Is an LED of the 5x5 matrix on?
     */
    //% blockId=mbhw_led_point block="micro:bit LED x $x y $y is on"
    //% x.min=0 x.max=4 y.min=0 y.max=4
    //% group="LED matrix" weight=7
    export function point(x: number, y: number): boolean {
        return _ledPoint(x, y) > 0
    }

    /**
     * Turn off all LEDs of the 5x5 matrix.
     */
    //% blockId=mbhw_led_clear block="micro:bit clear LEDs"
    //% group="LED matrix" weight=6
    export function clearLeds(): void {
        _ledClear()
    }

    /**
     * Set the overall brightness of the 5x5 LED matrix (0-255).
     */
    //% blockId=mbhw_led_brightness block="micro:bit set LED brightness $value"
    //% value.min=0 value.max=255 value.defl=255
    //% group="LED matrix" weight=5 advanced=true
    export function setLedBrightness(value: number): void {
        _ledSetBrightness(value)
    }

    /**
     * Turn the LED matrix driver on or off. Turning it off frees pins P3, P4, P6, P7 and P10.
     */
    //% blockId=mbhw_led_enable block="micro:bit LED matrix $on"
    //% on.shadow="toggleOnOff" on.defl=true
    //% group="LED matrix" weight=4 advanced=true
    export function setLedMatrixEnabled(on: boolean): void {
        _ledEnable(on)
    }

    // =========================================================================================
    // Other
    // =========================================================================================

    /**
     * True when the game runs on a micro:bit V2 (false in the simulator and on other Arcade hardware).
     */
    //% blockId=mbhw_is_microbit block="running on micro:bit"
    //% group="Other" weight=1 advanced=true
    export function isRunningOnMicrobit(): boolean {
        return _isMicrobit()
    }
}

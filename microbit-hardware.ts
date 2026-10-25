// arcade-microbit-hardware: blocks for the micro:bit V2's on-board hardware when it runs MakeCode Arcade
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

enum MicrobitLogoDirection {
    //% block="up"
    Up = 0,
    //% block="right"
    Right = 1,
    //% block="down"
    Down = 2,
    //% block="left"
    Left = 3
}

enum MicrobitLedFacing {
    //% block="toward the player"
    TowardPlayer = 0,
    //% block="away from the player"
    AwayFromPlayer = 1
}

enum MicrobitPlayMode {
    //% block="until done"
    UntilDone = 0,
    //% block="in background"
    InBackground = 1
}

enum MicrobitSoundExpression {
    //% block="giggle"
    Giggle,
    //% block="happy"
    Happy,
    //% block="hello"
    Hello,
    //% block="mysterious"
    Mysterious,
    //% block="sad"
    Sad,
    //% block="slide"
    Slide,
    //% block="soaring"
    Soaring,
    //% block="spring"
    Spring,
    //% block="twinkle"
    Twinkle,
    //% block="yawn"
    Yawn
}

enum MicrobitLogTimestamp {
    //% block="none"
    None = 0,
    //% block="milliseconds"
    Milliseconds = 1,
    //% block="seconds"
    Seconds = 10,
    //% block="minutes"
    Minutes = 600,
    //% block="hours"
    Hours = 36000,
    //% block="days"
    Days = 864000
}

enum MicrobitLogDelete {
    //% block="fast"
    Fast = 0,
    //% block="full"
    Full = 1
}

/**
 * Use the micro:bit V2's own sensors, buttons and pins in MakeCode Arcade.
 */
//% color="#D400D4" weight=90 icon="\uf2db" block="micro:bit"
//% groups='["Buttons", "Touch", "Motion", "Compass", "Environment", "Microphone", "Sound", "LED matrix", "Pins", "Data logging", "Other"]'
namespace microbit_hardware {

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
    //% shim=mbhw::setOrientation
    function _setOrientation(logo: number, away: boolean): void { }
    //% shim=mbhw::ledScroll
    function _ledScroll(text: string, interval: number, background: boolean): void { }
    //% shim=mbhw::ledPrint
    function _ledPrint(text: string, interval: number, background: boolean): void { }
    //% shim=mbhw::ledStopAnimation
    function _ledStopAnimation(): void { }
    //% shim=mbhw::logBeginRow
    function _logBeginRow(): number { return 0 }
    //% shim=mbhw::logData
    function _logData(key: string, value: string): number { return 0 }
    //% shim=mbhw::logEndRow
    function _logEndRow(): number { return 0 }
    //% shim=mbhw::logClear
    function _logClear(fullErase: boolean): void { }
    //% shim=mbhw::logSetTimeStamp
    function _logSetTimeStamp(format: number): void { }
    //% shim=mbhw::logSetSerialMirroring
    function _logSetSerialMirroring(on: boolean): void { }
    //% shim=mbhw::logIsFull
    function _logIsFull(): boolean { return false }
    //% shim=mbhw::logEventSource
    function _logEventSource(): number { return 0 }

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
     * Tell the extension how the micro:bit sits in your Arcade shield, so that motion, gestures
     * and the compass are measured relative to the screen. Look at the screen and note which way
     * the micro:bit's logo (the end opposite the gold pins) points, and whether its LEDs face you.
     * Most shields hold the micro:bit "logo up, toward the player", which is the default.
     */
    //% blockId=mbhw_orientation block="set micro:bit orientation: logo points $logo LEDs face $facing"
    //% group="Motion" weight=85
    export function setOrientation(logo: MicrobitLogoDirection, facing: MicrobitLedFacing): void {
        _setOrientation(logo, facing == MicrobitLedFacing.AwayFromPlayer)
    }

    /**
     * Acceleration in milli-g (1000 = 1g) along an axis of the micro:bit, or the total strength.
     * Axes follow the micro:bit board unless "set micro:bit orientation" says how it sits in the shield.
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
    // Microphone
    // =========================================================================================

    /**
     * Loudness heard by the micro:bit's microphone, from 0 (quiet) to 255 (loud).
     * The microphone LED next to the logo lights up while the microphone is on.
     */
    //% blockId=mbhw_sound_level block="micro:bit sound level"
    //% group="Microphone" weight=30
    export function soundLevel(): number {
        return _soundLevel()
    }

    /**
     * Run code when the microphone hears a loud sound, or when it goes quiet.
     */
    //% blockId=mbhw_on_sound block="on micro:bit $sound sound"
    //% group="Microphone" weight=29
    export function onSound(sound: MicrobitSound, handler: () => void): void {
        control.onEvent(_soundSource(), sound, handler)
    }

    /**
     * Set the level (0-255) that counts as a loud or a quiet sound.
     */
    //% blockId=mbhw_sound_threshold block="set micro:bit $sound sound threshold to $threshold"
    //% threshold.min=0 threshold.max=255 threshold.defl=128
    //% group="Microphone" weight=28 advanced=true
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
     * Show text on the 5x5 LEDs: one character is shown still, longer text scrolls.
     * "until done" waits for the text to finish; "in background" lets the game carry on.
     * @param interval milliseconds per scroll step, eg: 150
     */
    //% blockId=mbhw_led_show_string block="micro:bit show string $text $mode||interval (ms) $interval"
    //% text.defl="Hello!" interval.defl=150
    //% group="LED matrix" weight=12
    export function showString(text: string, mode: MicrobitPlayMode = MicrobitPlayMode.UntilDone, interval: number = 150): void {
        const background = mode == MicrobitPlayMode.InBackground
        if (!text) text = ""
        if (text.length <= 1) _ledPrint(text, 0, background)
        else _ledScroll(text, interval, background)
    }

    /**
     * Show a number on the 5x5 LEDs (scrolls if it has more than one digit).
     */
    //% blockId=mbhw_led_show_number block="micro:bit show number $value $mode||interval (ms) $interval"
    //% interval.defl=150
    //% group="LED matrix" weight=11
    export function showNumber(value: number, mode: MicrobitPlayMode = MicrobitPlayMode.UntilDone, interval: number = 150): void {
        showString("" + value, mode, interval)
    }

    /**
     * Stop text that is scrolling on the 5x5 LEDs.
     */
    //% blockId=mbhw_led_stop block="micro:bit stop LED animation"
    //% group="LED matrix" weight=3 advanced=true
    export function stopAnimation(): void {
        _ledStopAnimation()
    }

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
    // Sound expressions (played through Arcade's own sound system, so they also work in the
    // simulator and mix with game music)
    // =========================================================================================

    // The micro:bit's built-in sound expressions, copied from codal-microbit-v2
    // (SoundExpressions.cpp). Each comma-separated 72-digit frame is one sound effect.
    const EXPRESSIONS = [
        "010230988019008440044008881023001601003300240000000000000000000000000000,110232570087411440044008880352005901003300010000000000000000010000000000,310232729021105440288908880091006300000000240700020000000000003000000000,310232729010205440288908880091006300000000240700020000000000003000000000,310232729011405440288908880091006300000000240700020000000000003000000000",
        "010231992066911440044008880262002800001800020500000000000000010000000000,002322129029508440240408880000000400022400110000000000000000007500000000,000002129029509440240408880145000400022400110000000000000000007500000000",
        "310230673019702440118708881023012800000000240000000000000000000000000000,300001064001602440098108880000012800000100040000000000000000000000000000,310231064029302440098108881023012800000100040000000000000000000000000000",
        "400002390033100440240408880477000400022400110400000000000000008000000000,405512845385000440044008880000012803010500160000000000000000085000500015",
        "310232226070801440162408881023012800000100240000000000000000000000000000,310231623093602440093908880000012800000100240000000000000000000000000000",
        "105202325022302440240408881023012801020000110400000000000000010000000000,010232520091002440044008881023012801022400110400000000000000010000000000",
        "210234009530905440599908881023002202000400020250000000000000020000000000,402233727273014440044008880000003101024400030000000000000000000000000000",
        "306590037116312440058708880807003400000000240000000000000000050000000000,010230037116313440058708881023003100000000240000000000000000050000000000",
        "010180007672209440075608880855012800000000240000000000000000000000000000",
        "200002281133202440150008881023012801024100240400030000000000010000000000,005312520091002440044008880636012801022400110300000000000000010000000000,008220784019008440044008880681001600005500240000000000000000005000000000,004790784019008440044008880298001600000000240000000000000000005000000000,003210784019008440044008880108001600003300080000000000000000005000000000"
    ]

    // semitone offsets of the scales used by the micro:bit's arpeggio frames
    const SCALES = [
        [0, 2, 4, 5, 7, 9, 11],              // major
        [0, 2, 3, 5, 7, 8, 10],              // minor
        [0, 3, 6, 9],                        // diminished
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], // chromatic
        [0, 2, 4, 6, 8, 10]                  // whole tone
    ]

    function digits(frame: string, offset: number, length: number): number {
        return parseInt(frame.substr(offset, length)) || 0
    }

    function randomize(value: number, range: number): number {
        if (range <= 0) return value
        return Math.abs(value + Math.randomRange(-range, range))
    }

    function playFrame(frame: string): void {
        if (frame.length < 72) return
        const wave = digits(frame, 0, 1)
        const shape = digits(frame, 13, 2)
        const steps = Math.max(1, digits(frame, 30, 4))
        const fx = digits(frame, 34, 2)
        const freq = randomize(digits(frame, 5, 4), digits(frame, 44, 4))
        const endFreq = randomize(digits(frame, 18, 4), digits(frame, 48, 4))
        const startVol = Math.clamp(0, 1023, randomize(digits(frame, 1, 4), digits(frame, 52, 4))) >> 2
        const endVol = Math.clamp(0, 1023, randomize(digits(frame, 26, 4), digits(frame, 56, 4))) >> 2
        const duration = randomize(digits(frame, 9, 4), digits(frame, 60, 4))
        if (duration <= 0) return
        const waveShape = <WaveShape>Math.clamp(0, 4, wave)

        if (shape >= 8 && shape <= 17) {
            // arpeggio: `steps` notes from a scale, rising (even shapes) or falling (odd shapes)
            const scale = SCALES[(shape - 8) >> 1]
            const noteTime = Math.max(1, Math.idiv(duration, steps))
            for (let i = 0; i < steps; i++) {
                const step = (shape % 2 == 0) ? i : steps - 1 - i
                const semis = scale[step % scale.length] + 12 * Math.idiv(step, scale.length)
                const f = Math.round(freq * Math.pow(2, semis / 12))
                const v1 = startVol + Math.idiv((endVol - startVol) * i, steps)
                const v2 = startVol + Math.idiv((endVol - startVol) * (i + 1), steps)
                music.createSoundEffect(waveShape, f, f, v1, v2, noteTime,
                    SoundExpressionEffect.None, InterpolationCurve.Linear).play(music.PlaybackMode.UntilDone)
            }
            return
        }

        let interpolation = InterpolationCurve.Linear
        if (shape == 2 || shape == 5 || shape == 6) interpolation = InterpolationCurve.Curve
        else if (shape == 18) interpolation = InterpolationCurve.Logarithmic
        let effect = SoundExpressionEffect.None
        if (fx == 1) effect = SoundExpressionEffect.Vibrato
        else if (fx == 2) effect = SoundExpressionEffect.Tremolo
        else if (fx == 3) effect = SoundExpressionEffect.Warble
        music.createSoundEffect(waveShape, freq, shape == 0 ? freq : endFreq, startVol, endVol,
            duration, effect, interpolation).play(music.PlaybackMode.UntilDone)
    }

    function playFrames(data: string): void {
        for (const frame of data.split(","))
            playFrame(frame)
    }

    /**
     * Play one of the micro:bit's built-in sound expressions (giggle, happy, hello, ...).
     * They play through Arcade's sound output: the micro:bit speaker and/or the shield's speaker.
     */
    //% blockId=mbhw_play_expression block="micro:bit play sound $expression $mode"
    //% group="Sound" weight=26
    export function playSoundExpression(expression: MicrobitSoundExpression, mode: MicrobitPlayMode = MicrobitPlayMode.UntilDone): void {
        const data = EXPRESSIONS[expression]
        if (!data) return
        if (mode == MicrobitPlayMode.InBackground)
            control.runInParallel(() => playFrames(data))
        else
            playFrames(data)
    }

    // =========================================================================================
    // Data logging (MY_DATA.HTM on the MICROBIT drive, like MakeCode for micro:bit's data logger)
    // =========================================================================================

    /** A column name and the value to log in it. */
    export class ColumnValue {
        public value: string
        constructor(public column: string, value: any) {
            this.value = "" + value
        }
    }

    let logInitialized = false
    let logDisabled = false
    let logFullHandler: () => void = undefined

    function initLog(): void {
        if (logInitialized) return
        logInitialized = true
        if (!_isMicrobit()) return
        _logSetTimeStamp(MicrobitLogTimestamp.Seconds) // same default as MakeCode for micro:bit
        control.onEvent(_logEventSource(), 1 /* MICROBIT_LOG_EVT_LOG_FULL */, () => {
            logDisabled = true
            if (logFullHandler) logFullHandler()
        })
    }

    function logRow(data: ColumnValue[]): void {
        if (!data || !data.length) return
        initLog()
        if (logDisabled) return
        if (!_isMicrobit()) {
            // simulator: show the row in the console instead
            console.log(data.map(cv => cv.column + "=" + cv.value).join(", "))
            return
        }
        _logBeginRow()
        for (const cv of data)
            _logData(cv.column, cv.value)
        _logEndRow()
    }

    /**
     * A column and the value to store in it.
     */
    //% blockId=mbhw_create_cv block="column $column value $value"
    //% column.defl="x" value.shadow=math_number
    //% group="Data logging" weight=9 blockGap=8
    export function createCV(column: string, value: any): ColumnValue {
        return new ColumnValue(column, value)
    }

    /**
     * Add a row of data to the micro:bit's data log. Open MY_DATA.HTM on the MICROBIT drive to
     * see, chart or download it.
     */
    //% blockId=mbhw_log_data block="micro:bit log data $data1||$data2 $data3 $data4 $data5 $data6"
    //% data1.shadow=mbhw_create_cv data2.shadow=mbhw_create_cv data3.shadow=mbhw_create_cv
    //% data4.shadow=mbhw_create_cv data5.shadow=mbhw_create_cv data6.shadow=mbhw_create_cv
    //% inlineInputMode="variable" inlineInputModeLimit=1 expandableArgumentMode="enabled"
    //% group="Data logging" weight=10
    export function logData(data1: ColumnValue, data2?: ColumnValue, data3?: ColumnValue,
        data4?: ColumnValue, data5?: ColumnValue, data6?: ColumnValue): void {
        logRow([data1, data2, data3, data4, data5, data6].filter(cv => !!cv))
    }

    /**
     * Log a row from an array of column/value pairs.
     */
    export function logDataArray(data: ColumnValue[]): void {
        logRow(data)
    }

    /**
     * Set the column names of the data log (optional; columns are also added as data is logged).
     */
    //% blockId=mbhw_log_columns block="micro:bit set log columns $col1||$col2 $col3 $col4 $col5 $col6"
    //% col1.defl="x" inlineInputMode="variable" inlineInputModeLimit=1 expandableArgumentMode="enabled"
    //% group="Data logging" weight=8
    export function setColumnTitles(col1: string, col2?: string, col3?: string, col4?: string,
        col5?: string, col6?: string): void {
        logRow([col1, col2, col3, col4, col5, col6].filter(c => !!c).map(c => new ColumnValue(c, "")))
    }

    /**
     * Choose the unit of the time column added to each row, or turn it off.
     */
    //% blockId=mbhw_log_timestamp block="micro:bit log time stamp $format"
    //% group="Data logging" weight=7
    export function includeTimestamp(format: MicrobitLogTimestamp): void {
        initLog()
        _logSetTimeStamp(format)
    }

    /**
     * Run code when the data log is full. Nothing more is logged until the log is deleted.
     */
    //% blockId=mbhw_log_full block="on micro:bit log full"
    //% group="Data logging" weight=6
    export function onLogFull(handler: () => void): void {
        initLog()
        logFullHandler = handler
    }

    /**
     * Delete the data log. "fast" only marks it as deleted; "full" also erases the storage (slower).
     */
    //% blockId=mbhw_log_delete block="micro:bit delete log $mode"
    //% group="Data logging" weight=5
    export function deleteLog(mode: MicrobitLogDelete = MicrobitLogDelete.Fast): void {
        initLog()
        _logClear(mode == MicrobitLogDelete.Full)
        logDisabled = false
    }

    /**
     * Also send each logged row to the micro:bit's USB serial port.
     */
    //% blockId=mbhw_log_mirror block="micro:bit mirror log to serial $on"
    //% on.shadow="toggleOnOff"
    //% group="Data logging" weight=4 advanced=true
    export function mirrorToSerial(on: boolean): void {
        initLog()
        _logSetSerialMirroring(on)
    }

    /**
     * Is the data log full?
     */
    //% blockId=mbhw_log_is_full block="micro:bit log is full"
    //% group="Data logging" weight=3 advanced=true
    export function logIsFull(): boolean {
        initLog()
        return logDisabled || _logIsFull()
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

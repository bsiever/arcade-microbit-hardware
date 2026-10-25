// Auto-generated. Do not edit.
declare namespace mbhw {

    /** True when running on a micro:bit V2 Arcade build. */
    //% shim=mbhw::isMicrobit
    function isMicrobit(): boolean;

    /** True when the LSM303 motion sensor (accelerometer + compass) was found. */
    //% shim=mbhw::hasMotionSensor
    function hasMotionSensor(): boolean;

    /** Acceleration in milli-g. dim: 0=x 1=y 2=z 3=strength */
    //% shim=mbhw::acceleration
    function acceleration(dim: int32): int32;

    /** kind: 0=pitch 1=roll, degrees */
    //% shim=mbhw::rotation
    function rotation(kind: int32): int32;

    /** The gesture currently detected (ACCELEROMETER_EVT_* value, 0 = none). */
    //% shim=mbhw::currentGesture
    function currentGesture(): int32;

    /** Starts the accelerometer, adjusts its range for 3g/6g/8g gestures and returns the
     *  event source id for gestures (DEVICE_ID_GESTURE). */
    //% shim=mbhw::gestureSource
    function gestureSource(gesture: int32): int32;

    /** Range in g: 1, 2, 4, 8 */
    //% shim=mbhw::setAccelerometerRange
    function setAccelerometerRange(g: int32): void;

    /** Raw (calibration-free) heading is not exposed; this returns the tilt-compensated heading in
     *  degrees, or a negative value if no sensor is present. Calibration is driven from TypeScript. */
    //% shim=mbhw::compassHeading
    function compassHeading(): int32;

    /** Magnetic field in nano-tesla. dim: 0=x 1=y 2=z 3=strength */
    //% shim=mbhw::magneticForce
    function magneticForce(dim: int32): int32;

    /** True once a compass calibration has been applied. */
    //% shim=mbhw::compassIsCalibrated
    function compassIsCalibrated(): boolean;

    /** Forgets the current compass calibration. */
    //% shim=mbhw::compassClearCalibration
    function compassClearCalibration(): void;

    /** Stores the current RAW magnetometer reading as calibration sample `index` (0..24). */
    //% shim=mbhw::compassRecordSample
    function compassRecordSample(index: int32): boolean;

    /** Computes a calibration from the first `count` recorded samples, applies it and returns it
     *  as 7 int32 values: centre x,y,z, scale x,y,z, radius. Returns an empty buffer on failure. */
    //% shim=mbhw::compassComputeCalibration
    function compassComputeCalibration(count: int32): Buffer;

    /** Applies a calibration previously returned by compassComputeCalibration(). */
    //% shim=mbhw::compassSetCalibration
    function compassSetCalibration(data: Buffer): void;

    /** Temperature of the nRF52 die in degrees Celsius (what the micro:bit reports). */
    //% shim=mbhw::temperature
    function temperature(): int32;

    /** which: 0=A 1=B 2=A+B */
    //% shim=mbhw::buttonIsPressed
    function buttonIsPressed(which: int32): boolean;

    /** Creates the button driver (if needed) and returns its event source id. */
    //% shim=mbhw::buttonSource
    function buttonSource(which: int32): int32;

    /** mode: 0=resistive 1=capacitive. Works for P0, P1, P2 and the logo. */
    //% shim=mbhw::pinIsTouched
    function pinIsTouched(pin: int32, mode: int32): boolean;

    /** Switches the pin into touch mode and returns the event source id for its touch events. */
    //% shim=mbhw::touchSource
    function touchSource(pin: int32, mode: int32): int32;

    /** Sound level 0 (quiet) .. 255 (loud). */
    //% shim=mbhw::soundLevel
    function soundLevel(): int32;

    /** Starts the microphone, keeps it listening and returns the sound event source id. */
    //% shim=mbhw::soundSource
    function soundSource(): int32;

    /** which: 2=loud(high) 1=quiet(low); value 0..255 */
    //% shim=mbhw::setSoundThreshold
    function setSoundThreshold(which: int32, value: int32): void;

    /** True if the pin exists and is not used by the Arcade screen or buttons on this hardware. */
    //% shim=mbhw::pinAvailable
    function pinAvailable(pin: int32): boolean;

    /** Digital read (0/1). */
    //% shim=mbhw::digitalRead
    function digitalRead(pin: int32): int32;

    /** Digital write (0/1). */
    //% shim=mbhw::digitalWrite
    function digitalWrite(pin: int32, value: int32): void;

    /** 0..1023, or 0 if the pin has no analog input. */
    //% shim=mbhw::analogRead
    function analogRead(pin: int32): int32;

    /** PWM output, 0..1023. */
    //% shim=mbhw::analogWrite
    function analogWrite(pin: int32, value: int32): void;

    /** PWM period in microseconds. */
    //% shim=mbhw::analogSetPeriod
    function analogSetPeriod(pin: int32, micros: int32): void;

    /** Servo angle 0..180 degrees. */
    //% shim=mbhw::servoWrite
    function servoWrite(pin: int32, degrees: int32): void;

    /** Servo pulse width in microseconds. */
    //% shim=mbhw::servoSetPulse
    function servoSetPulse(pin: int32, micros: int32): void;

    /** pull: 0=down 1=up 2=none */
    //% shim=mbhw::setPull
    function setPull(pin: int32, pull: int32): void;

    /** Enables edge (type=1) or pulse (type=2) events on the pin; returns the event source id. */
    //% shim=mbhw::pinEventSource
    function pinEventSource(pin: int32, type: int32): int32;

    /** Sets one LED of the 5x5 matrix (brightness 0..255). Starts the LED matrix driver. */
    //% shim=mbhw::ledPlot
    function ledPlot(x: int32, y: int32, brightness: int32): void;

    /** Brightness (0..255) of one LED of the 5x5 matrix. */
    //% shim=mbhw::ledPoint
    function ledPoint(x: int32, y: int32): int32;

    /** Turns all LEDs of the 5x5 matrix off. */
    //% shim=mbhw::ledClear
    function ledClear(): void;

    /** Overall LED matrix brightness 0..255. */
    //% shim=mbhw::ledSetBrightness
    function ledSetBrightness(value: int32): void;

    /** Turns the LED matrix driver on or off. Off releases the column pins P3 P4 P6 P7 P10
     *  for other uses (the timer stays reserved). */
    //% shim=mbhw::ledEnable
    function ledEnable(on: boolean): void;

    /** Light level 0..255 measured with the LED matrix. Starts the LED matrix driver. */
    //% shim=mbhw::lightLevel
    function lightLevel(): int32;
}

// Auto-generated. Do not edit. Really.

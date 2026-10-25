// Native (C++) layer for the arcade-microbit-hardware extension.
//
// MakeCode Arcade runs on the micro:bit V2 (hardware variants hw---n3 and hw---gdk) WITHOUT
// creating the CODAL `MicroBit uBit` object. The Arcade runtime only brings up the message bus,
// the system timer, the screen, the mixer and whatever pins/peripherals a library asks for.
// As a result the micro:bit's own peripherals (motion sensor, compass, microphone, buttons,
// touch logo, LED matrix, ADC, ...) are never instantiated.
//
// This file instantiates those drivers lazily (only when a block that needs them is used), using
// the same CODAL classes and the same settings as codal-microbit-v2's MicroBit.cpp.
//
// Every exported function is compiled for every Arcade hardware variant. On anything that is not a
// micro:bit V2 build the bodies compile to harmless stubs (see MBHW_NATIVE), so adding this
// extension never breaks downloads to other Arcade boards.
//
// The TypeScript side (microbit.ts) declares each function with `//% shim=mbhw::name` and a
// TypeScript body; the body is what runs in the browser simulator.

#include "pxt.h"

#if defined(ARCADE_MBIT_CODAL) && defined(NRF52833)
#define MBHW_NATIVE 1
#else
#define MBHW_NATIVE 0
#endif

#if MBHW_NATIVE
#include "NRF52Pin.h"
#include "NRF52ADC.h"
#include "NRF52TouchSensor.h"
#include "NRFLowLevelTimer.h"
#include "LSM303Accelerometer.h"
#include "LSM303Magnetometer.h"
#include "LevelDetector.h"
#include "LevelDetectorSPL.h"
#include "TouchButton.h"
#include "NRF52LedMatrix.h"
#include <math.h>
#endif

// Event-bus ids for components created here. Chosen to avoid the ids used by the Arcade
// runtime (DEVICE_ID_FIRST_BUTTON = 4000+, DEVICE_ID_MICROPHONE = 3001, ...).
#define MBHW_ID_BUTTON_A 3200
#define MBHW_ID_BUTTON_B 3201
#define MBHW_ID_BUTTON_AB 3202
#define MBHW_ID_SOUND 3210
#define MBHW_ID_LEDMATRIX 3220

namespace mbhw {

#if MBHW_NATIVE

// ---------------------------------------------------------------------------------------------
// micro:bit V2 pin map (nRF52833 pin numbers, as used by pxt::getPin()).
// ---------------------------------------------------------------------------------------------
#define MB_PIN_BUTTON_A P0_14
#define MB_PIN_BUTTON_B P0_23
#define MB_PIN_LOGO P1_4
#define MB_PIN_INT_SDA P0_16
#define MB_PIN_INT_SCL P0_8
#define MB_PIN_MOTION_IRQ P0_25
#define MB_PIN_MIC P0_5
#define MB_PIN_RUN_MIC P0_20

// Edge-connector pins + the logo that the blocks are allowed to touch.
static bool isUserPin(int p) {
    switch (p) {
    case P0_2:  // P0
    case P0_3:  // P1
    case P0_4:  // P2
    case P0_31: // P3
    case P0_28: // P4
    case P0_14: // P5 (button A)
    case P1_5:  // P6
    case P0_11: // P7
    case P0_10: // P8
    case P0_9:  // P9
    case P0_30: // P10
    case P0_23: // P11 (button B)
    case P0_12: // P12
    case P0_17: // P13
    case P0_1:  // P14
    case P0_13: // P15
    case P1_2:  // P16
    case P0_26: // P19
    case P1_0:  // P20
    case P1_4:  // logo
        return true;
    default:
        return false;
    }
}

// Pins the Arcade hardware variant has assigned to the screen or to GPIO game buttons.
// Touching them from user code (even just reading, which reconfigures the pin as an input)
// would break the display or the controls, so the pin blocks ignore them.
// hw---n3: P8 P13 P14 P15 P16 P19 (screen).  hw---gdk: P1-P5 P8-P16 (screen, buttons, backlight).
// The button-multiplexer pins of older n3 shields (P9, P20) are not listed: shields with the
// "smart" display (most current ones) turn the multiplexer off and leave those pins free.
static const int reservedPinKeys[] = {
    CFG_PIN_DISPLAY_SCK, CFG_PIN_DISPLAY_MOSI, CFG_PIN_DISPLAY_MISO, CFG_PIN_DISPLAY_DC,
    CFG_PIN_DISPLAY_CS,  CFG_PIN_DISPLAY_RST,  CFG_PIN_DISPLAY_BL,   CFG_PIN_BTN_LEFT,
    CFG_PIN_BTN_RIGHT,   CFG_PIN_BTN_UP,       CFG_PIN_BTN_DOWN,     CFG_PIN_BTN_A,
    CFG_PIN_BTN_B,       CFG_PIN_BTN_MENU};

static bool reservedByArcade(int p) {
    for (unsigned i = 0; i < sizeof(reservedPinKeys) / sizeof(reservedPinKeys[0]); i++) {
        int v = pxt::getConfig(reservedPinKeys[i], -1);
        if (v < 0)
            continue;
        v &= 0xffff;           // strip button polarity flags
        if (v >= DEV_NUM_PINS) // multiplexed/virtual buttons (1000+)
            continue;
        if (v == p)
            return true;
    }
    return false;
}

static DevicePin *userPin(int p) {
    if (!isUserPin(p) || reservedByArcade(p))
        return NULL;
    return pxt::getPin(p);
}

// ---------------------------------------------------------------------------------------------
// Shared resources: ADC, touch sensor, internal I2C
// ---------------------------------------------------------------------------------------------
static NRF52ADC *adc;
static NRF52TouchSensor *touchSensor;

// The ADC is shared by analog pins and the microphone. Creating it also fixes the core
// `pins.analogRead` blocks, because NRF52Pin::adc is static and was NULL in Arcade.
static NRF52ADC *ensureADC() {
    if (!adc) {
        auto t = (NRFLowLevelTimer *)pxt::allocateTimer();
        adc = new NRF52ADC(*t, 91); // same sample period as MicroBit.cpp
        NRF52Pin::adc = adc;
    }
    return adc;
}

static void ensureTouchSensor() {
    if (!touchSensor) {
        auto t = (NRFLowLevelTimer *)pxt::allocateTimer();
        touchSensor = new NRF52TouchSensor(*t);
        NRF52Pin::touchSensor = touchSensor;
    }
}

static codal::I2C *internalI2C() {
    static codal::I2C *i2c;
    if (!i2c) {
        i2c = pxt::getI2C(pxt::getPin(MB_PIN_INT_SDA), pxt::getPin(MB_PIN_INT_SCL));
        if (i2c)
            i2c->setFrequency(400000);
    }
    return i2c;
}

// ---------------------------------------------------------------------------------------------
// Motion sensor (LSM303AGR accelerometer + magnetometer)
// ---------------------------------------------------------------------------------------------
static bool motionProbed;
static LSM303Accelerometer *acc;
static LSM303Magnetometer *mag;

static void probeMotion() {
    if (motionProbed)
        return;
    motionProbed = true;

    auto i2c = internalI2C();
    if (!i2c)
        return;

    // Same configuration as MicroBitAccelerometer::autoDetect().
    static CoordinateSpace space(SIMPLE_CARTESIAN, true, COORDINATE_SPACE_ROTATED_0);
    auto irq = pxt::getPin(MB_PIN_MOTION_IRQ);
    irq->getDigitalValue();
    irq->setPull(PullMode::Up);
    irq->setActiveLo();

    if (LSM303Accelerometer::isDetected(*i2c, LSM303_A_DEFAULT_ADDR)) {
        acc = new LSM303Accelerometer(*i2c, *irq, space, LSM303_A_DEFAULT_ADDR);
        mag = new LSM303Magnetometer(*i2c, *irq, space, LSM303_M_DEFAULT_ADDR);
        mag->setAccelerometer(*acc);
        DMESG("mbhw: LSM303 found");
    } else {
        // Not an LSM303-based board (e.g. Calliope mini 3) - motion blocks return 0.
        DMESG("mbhw: no LSM303");
    }
}

static Accelerometer *getAcc() {
    probeMotion();
    if (acc)
        acc->requestUpdate(); // first call enables the sensor and its idle-time polling
    return acc;
}

static Compass *getMag() {
    probeMotion();
    if (mag)
        mag->requestUpdate();
    return mag;
}

// ---------------------------------------------------------------------------------------------
// Compass calibration math (ported from codal-microbit-v2 MicroBitCompassCalibrator.cpp, MIT,
// Lancaster University). The interactive part of calibration is done in TypeScript so it can
// use the Arcade screen instead of the 5x5 LED matrix.
// ---------------------------------------------------------------------------------------------
#define MBHW_CAL_MAX_SAMPLES 25
#define MBHW_CAL_INCREMENT 200
static Sample3D calSamples[MBHW_CAL_MAX_SAMPLES];

static float calMeasureScore(Sample3D &c, Sample3D *data, int samples) {
    float minD, maxD;
    minD = maxD = c.dSquared(data[0]);
    for (int i = 1; i < samples; i++) {
        float d = c.dSquared(data[i]);
        if (d < minD)
            minD = d;
        if (d > maxD)
            maxD = d;
    }
    return maxD - minD;
}

static Sample3D calApproximateCentre(Sample3D *data, int samples) {
    Sample3D c, t;
    Sample3D centre = {0, 0, 0};
    Sample3D best = {0, 0, 0};

    for (int i = 0; i < samples; i++) {
        centre.x += data[i].x;
        centre.y += data[i].y;
        centre.z += data[i].z;
    }
    centre.x = centre.x / samples;
    centre.y = centre.y / samples;
    centre.z = centre.z / samples;

    c = centre;
    float score = calMeasureScore(c, data, samples);

    // hill climb (bounded, so a bad data set cannot hang the program)
    for (int iter = 0; iter < 2000; iter++) {
        for (int x = -MBHW_CAL_INCREMENT; x <= MBHW_CAL_INCREMENT; x += MBHW_CAL_INCREMENT)
            for (int y = -MBHW_CAL_INCREMENT; y <= MBHW_CAL_INCREMENT; y += MBHW_CAL_INCREMENT)
                for (int z = -MBHW_CAL_INCREMENT; z <= MBHW_CAL_INCREMENT; z += MBHW_CAL_INCREMENT) {
                    t = c;
                    t.x += x;
                    t.y += y;
                    t.z += z;
                    float s = calMeasureScore(t, data, samples);
                    if (s < score) {
                        score = s;
                        best = t;
                    }
                }
        if (best.x == c.x && best.y == c.y && best.z == c.z)
            break;
        c = best;
    }
    return c;
}

static CompassCalibration calSpherify(Sample3D centre, Sample3D *data, int samples) {
    CompassCalibration result;
    float radius = 0;
    float scale = 0.0f;
    float weightX = 0.0f, weightY = 0.0f, weightZ = 0.0f;

    for (int i = 0; i < samples; i++) {
        int d = sqrtf((float)centre.dSquared(data[i]));
        if (d > radius)
            radius = d;
    }

    for (int i = 0; i < samples; i++) {
        float d = sqrtf(centre.dSquared(data[i]));
        if (d <= 0)
            continue;
        float s = (radius / d) - 1;
        if (scale < s)
            scale = s;
        float dx = (data[i].x - centre.x);
        float dy = (data[i].y - centre.y);
        float dz = (data[i].z - centre.z);
        weightX += s * fabsf(dx / d);
        weightY += s * fabsf(dy / d);
        weightZ += s * fabsf(dz / d);
    }

    float wmag = sqrtf((weightX * weightX) + (weightY * weightY) + (weightZ * weightZ));
    if (wmag <= 0)
        wmag = 1;

    result.scale.x = (int)(1024 * (1.0f + scale * (weightX / wmag)));
    result.scale.y = (int)(1024 * (1.0f + scale * (weightY / wmag)));
    result.scale.z = (int)(1024 * (1.0f + scale * (weightZ / wmag)));
    result.centre.x = centre.x;
    result.centre.y = centre.y;
    result.centre.z = centre.z;
    result.radius = radius;
    return result;
}

static Buffer calibrationToBuffer(const CompassCalibration &c) {
    int32_t v[7] = {c.centre.x, c.centre.y, c.centre.z, c.scale.x, c.scale.y, c.scale.z, c.radius};
    return mkBuffer((const uint8_t *)v, sizeof(v));
}

// ---------------------------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------------------------
static Button *btnA, *btnB;
static MultiButton *btnAB;

static Button *mkButton(int pin, int id) {
    // The micro:bit buttons have external pull-ups. PullMode::Up matches what the Arcade
    // controller code uses on boards that share these pins (e.g. hw---gdk), so the two
    // drivers never fight over the pull configuration.
    return new Button(*pxt::getPin(pin), id, DEVICE_BUTTON_ALL_EVENTS, ACTIVE_LOW, PullMode::Up);
}

static AbstractButton *getButton(int which) {
    if (!btnA)
        btnA = mkButton(MB_PIN_BUTTON_A, MBHW_ID_BUTTON_A);
    if (!btnB)
        btnB = mkButton(MB_PIN_BUTTON_B, MBHW_ID_BUTTON_B);
    if (which == 0)
        return btnA;
    if (which == 1)
        return btnB;
    if (!btnAB) {
        btnAB = new MultiButton(MBHW_ID_BUTTON_A, MBHW_ID_BUTTON_B, MBHW_ID_BUTTON_AB);
        // Same trick as MicroBit.cpp: once A+B is in use, A and B only send simple events
        // and the multibutton decides who gets the click.
        btnA->setEventConfiguration(DEVICE_BUTTON_SIMPLE_EVENTS);
        btnB->setEventConfiguration(DEVICE_BUTTON_SIMPLE_EVENTS);
        btnAB->setEventConfiguration(DEVICE_BUTTON_ALL_EVENTS);
    }
    return btnAB;
}

// ---------------------------------------------------------------------------------------------
// Microphone
// ---------------------------------------------------------------------------------------------
static LevelDetectorSPL *soundLevelDetector;

static LevelDetectorSPL *getSound() {
    if (!soundLevelDetector) {
        auto a = ensureADC();
        auto micPin = pxt::getPin(MB_PIN_MIC);
        auto runmic = pxt::getPin(MB_PIN_RUN_MIC);

        // Same pipeline settings as MicroBitAudio.
        NRF52ADCChannel *mic = a->getChannel(*micPin, false);
        if (!mic)
            return NULL;
        mic->setSampleRate(11000);
        mic->setGain(7, 0);

        runmic->setDigitalValue(1); // powers the mic (also lights the mic LED)
        runmic->setHighDrive(true);
        a->activateChannel(mic);
        mic->setStartDelay(1);

        soundLevelDetector =
            new LevelDetectorSPL(mic->output, 85.0f, 65.0f, 16.0f, 35.0f, MBHW_ID_SOUND);
        soundLevelDetector->setUnit(LEVEL_DETECTOR_SPL_8BIT);
    }
    return soundLevelDetector;
}

// ---------------------------------------------------------------------------------------------
// LED matrix (also the light sensor)
// ---------------------------------------------------------------------------------------------
static NRF52LEDMatrix *ledMatrix;
static const MatrixPoint ledMatrixPositions[5 * 5] = {
    {0, 0}, {0, 1}, {0, 2}, {0, 3}, {0, 4}, {1, 0}, {1, 1}, {1, 2}, {1, 3},
    {1, 4}, {2, 0}, {2, 1}, {2, 2}, {2, 3}, {2, 4}, {3, 0}, {3, 1}, {3, 2},
    {3, 3}, {3, 4}, {4, 0}, {4, 1}, {4, 2}, {4, 3}, {4, 4}};
static Pin *ledRowPins[5];
static Pin *ledColPins[5];
static MatrixMap *ledMap;

static NRF52LEDMatrix *getLeds() {
    if (!ledMatrix) {
        // TIMER4 is not part of the pool pxt::allocateTimer() hands out, so it is free.
        if (NRF_TIMER4->INTENSET) {
            DMESG("mbhw: TIMER4 busy");
            return NULL;
        }
        static const int rows[5] = {P0_21, P0_22, P0_15, P0_24, P0_19};
        static const int cols[5] = {P0_28, P0_11, P0_31, P1_5, P0_30}; // P4 P7 P3 P6 P10
        for (int i = 0; i < 5; i++) {
            if (reservedByArcade(cols[i])) {
                // e.g. hw---gdk uses P3/P4 for buttons and P10 for the backlight
                DMESG("mbhw: LED matrix pins used by Arcade");
                return NULL;
            }
        }
        for (int i = 0; i < 5; i++) {
            auto r = pxt::getPin(rows[i]);
            auto c = pxt::getPin(cols[i]);
            r->setHighDrive(true);
            c->setHighDrive(true);
            ledRowPins[i] = r;
            ledColPins[i] = c;
        }
        ledMap = new MatrixMap{5, 5, 5, 5, ledRowPins, ledColPins, ledMatrixPositions};
        auto t = new NRFLowLevelTimer(NRF_TIMER4, TIMER4_IRQn);
        NVIC_SetPriority(TIMER4_IRQn, 3); // as in MicroBit.cpp
        ledMatrix = new NRF52LEDMatrix(*t, *ledMap, MBHW_ID_LEDMATRIX,
                                       DisplayMode::DISPLAY_MODE_GREYSCALE);
    }
    return ledMatrix;
}

#endif // MBHW_NATIVE

// =============================================================================================
// Exported functions. Keep the signatures in sync with shims.d.ts / microbit.ts.
// =============================================================================================

/** True when running on a micro:bit V2 Arcade build. */
//%
bool isMicrobit() {
#if MBHW_NATIVE
    return true;
#else
    return false;
#endif
}

/** True when the LSM303 motion sensor (accelerometer + compass) was found. */
//%
bool hasMotionSensor() {
#if MBHW_NATIVE
    probeMotion();
    return acc != NULL;
#else
    return false;
#endif
}

// ---------------------------------------------------------------------------------- accelerometer

/** Acceleration in milli-g. dim: 0=x 1=y 2=z 3=strength */
//%
int acceleration(int dim) {
#if MBHW_NATIVE
    auto a = getAcc();
    if (!a)
        return 0;
    switch (dim) {
    case 0:
        return a->getX();
    case 1:
        return a->getY();
    case 2:
        return a->getZ();
    default: {
        float x = a->getX(), y = a->getY(), z = a->getZ();
        return (int)sqrtf(x * x + y * y + z * z);
    }
    }
#else
    return 0;
#endif
}

/** kind: 0=pitch 1=roll, degrees */
//%
int rotation(int kind) {
#if MBHW_NATIVE
    auto a = getAcc();
    if (!a)
        return 0;
    return kind == 0 ? a->getPitch() : a->getRoll();
#else
    return 0;
#endif
}

/** The gesture currently detected (ACCELEROMETER_EVT_* value, 0 = none). */
//%
int currentGesture() {
#if MBHW_NATIVE
    auto a = getAcc();
    return a ? a->getGesture() : 0;
#else
    return 0;
#endif
}

/** Starts the accelerometer, adjusts its range for 3g/6g/8g gestures and returns the
 *  event source id for gestures (DEVICE_ID_GESTURE). */
//%
int gestureSource(int gesture) {
#if MBHW_NATIVE
    auto a = getAcc();
    if (a) {
        if (gesture == ACCELEROMETER_EVT_3G && a->getRange() < 3)
            a->setRange(4);
        else if ((gesture == ACCELEROMETER_EVT_6G || gesture == ACCELEROMETER_EVT_8G) &&
                 a->getRange() < 6)
            a->setRange(8);
    }
    return DEVICE_ID_GESTURE;
#else
    return 13;
#endif
}

/** Range in g: 1, 2, 4, 8 */
//%
void setAccelerometerRange(int g) {
#if MBHW_NATIVE
    auto a = getAcc();
    if (a)
        a->setRange(g);
#endif
}

// ---------------------------------------------------------------------------------- compass

/** Raw (calibration-free) heading is not exposed; this returns the tilt-compensated heading in
 *  degrees, or a negative value if no sensor is present. Calibration is driven from TypeScript. */
//%
int compassHeading() {
#if MBHW_NATIVE
    auto m = getMag();
    if (!m)
        return -1;
    return m->heading();
#else
    return 0;
#endif
}

/** Magnetic field in nano-tesla. dim: 0=x 1=y 2=z 3=strength */
//%
int magneticForce(int dim) {
#if MBHW_NATIVE
    auto m = getMag();
    if (!m)
        return 0;
    switch (dim) {
    case 0:
        return m->getX();
    case 1:
        return m->getY();
    case 2:
        return m->getZ();
    default:
        return m->getFieldStrength();
    }
#else
    return 0;
#endif
}

/** True once a compass calibration has been applied. */
//%
bool compassIsCalibrated() {
#if MBHW_NATIVE
    auto m = getMag();
    return m ? m->isCalibrated() != 0 : false;
#else
    return false;
#endif
}

/** Forgets the current compass calibration. */
//%
void compassClearCalibration() {
#if MBHW_NATIVE
    auto m = getMag();
    if (m)
        m->clearCalibration();
#endif
}

/** Stores the current RAW magnetometer reading as calibration sample `index` (0..24). */
//%
bool compassRecordSample(int index) {
#if MBHW_NATIVE
    auto m = getMag();
    if (!m || index < 0 || index >= MBHW_CAL_MAX_SAMPLES)
        return false;
    calSamples[index] = m->getSample(RAW);
    return true;
#else
    return false;
#endif
}

/** Computes a calibration from the first `count` recorded samples, applies it and returns it
 *  as 7 int32 values: centre x,y,z, scale x,y,z, radius. Returns an empty buffer on failure. */
//%
Buffer compassComputeCalibration(int count) {
#if MBHW_NATIVE
    auto m = getMag();
    if (!m || count < 4 || count > MBHW_CAL_MAX_SAMPLES)
        return mkBuffer(NULL, 0);
    CompassCalibration cal = calSpherify(calApproximateCentre(calSamples, count), calSamples, count);
    m->setCalibration(cal);
    return calibrationToBuffer(cal);
#else
    return mkBuffer(NULL, 0);
#endif
}

/** Applies a calibration previously returned by compassComputeCalibration(). */
//%
void compassSetCalibration(Buffer data) {
#if MBHW_NATIVE
    auto m = getMag();
    if (!m || !data || data->length < 28)
        return;
    int32_t v[7];
    memcpy(v, data->data, sizeof(v));
    CompassCalibration cal;
    cal.centre.x = v[0];
    cal.centre.y = v[1];
    cal.centre.z = v[2];
    cal.scale.x = v[3];
    cal.scale.y = v[4];
    cal.scale.z = v[5];
    cal.radius = v[6];
    m->setCalibration(cal);
#endif
}

// ---------------------------------------------------------------------------------- thermometer

/** Temperature of the nRF52 die in degrees Celsius (what the micro:bit reports). */
//%
int temperature() {
#if MBHW_NATIVE
    // Direct TEMP peripheral access, like MicroBitThermometer when Bluetooth is off.
    NRF_TEMP->EVENTS_DATARDY = 0;
    NRF_TEMP->TASKS_START = 1;
    uint32_t start = system_timer_current_time();
    while (NRF_TEMP->EVENTS_DATARDY == 0) {
        if (system_timer_current_time() - start > 10)
            break;
    }
    NRF_TEMP->EVENTS_DATARDY = 0;
    int t = (int)NRF_TEMP->TEMP;
    NRF_TEMP->TASKS_STOP = 1;
    return t / 4; // register is in 0.25 C steps
#else
    return 21;
#endif
}

// ---------------------------------------------------------------------------------- buttons

/** which: 0=A 1=B 2=A+B */
//%
bool buttonIsPressed(int which) {
#if MBHW_NATIVE
    if (which < 0 || which > 2)
        return false;
    return getButton(which)->isPressed() != 0;
#else
    return false;
#endif
}

/** Creates the button driver (if needed) and returns its event source id. */
//%
int buttonSource(int which) {
#if MBHW_NATIVE
    if (which < 0 || which > 2)
        return 0;
    return getButton(which)->id;
#else
    return MBHW_ID_BUTTON_A + which;
#endif
}

// ---------------------------------------------------------------------------------- touch

/** mode: 0=resistive 1=capacitive. Works for P0, P1, P2 and the logo. */
//%
bool pinIsTouched(int pin, int mode) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (!p)
        return false;
    if (mode == 1)
        ensureTouchSensor();
    return p->isTouched(mode == 1 ? TouchMode::Capacitative : TouchMode::Resistive) > 0;
#else
    return false;
#endif
}

/** Switches the pin into touch mode and returns the event source id for its touch events. */
//%
int touchSource(int pin, int mode) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (!p)
        return 0;
    if (mode == 1)
        ensureTouchSensor();
    p->isTouched(mode == 1 ? TouchMode::Capacitative : TouchMode::Resistive);
    return p->id;
#else
    return 100 + pin;
#endif
}

// ---------------------------------------------------------------------------------- microphone

/** Sound level 0 (quiet) .. 255 (loud). */
//%
int soundLevel() {
#if MBHW_NATIVE
    auto s = getSound();
    if (!s)
        return 0;
    int v = (int)s->getValue();
    return v < 0 ? 0 : (v > 255 ? 255 : v);
#else
    return 0;
#endif
}

/** Starts the microphone, keeps it listening and returns the sound event source id. */
//%
int soundSource() {
#if MBHW_NATIVE
    auto s = getSound();
    if (s)
        s->listenerAdded();
    return MBHW_ID_SOUND;
#else
    return MBHW_ID_SOUND;
#endif
}

/** which: 2=loud(high) 1=quiet(low); value 0..255 */
//%
void setSoundThreshold(int which, int value) {
#if MBHW_NATIVE
    auto s = getSound();
    if (!s)
        return;
    if (which == 2)
        s->setHighThreshold(value);
    else
        s->setLowThreshold(value);
#endif
}

// ---------------------------------------------------------------------------------- pins

/** True if the pin exists and is not used by the Arcade screen or buttons on this hardware. */
//%
bool pinAvailable(int pin) {
#if MBHW_NATIVE
    return userPin(pin) != NULL;
#else
    return false;
#endif
}

/** Digital read (0/1). */
//%
int digitalRead(int pin) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    return p ? p->getDigitalValue() : 0;
#else
    return 0;
#endif
}

/** Digital write (0/1). */
//%
void digitalWrite(int pin, int value) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (p)
        p->setDigitalValue(value ? 1 : 0);
#endif
}

/** 0..1023, or 0 if the pin has no analog input. */
//%
int analogRead(int pin) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (!p)
        return 0;
    ensureADC();
    int v = p->getAnalogValue();
    return v < 0 ? 0 : v;
#else
    return 0;
#endif
}

/** PWM output, 0..1023. */
//%
void analogWrite(int pin, int value) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (p)
        p->setAnalogValue(value < 0 ? 0 : (value > 1023 ? 1023 : value));
#endif
}

/** PWM period in microseconds. */
//%
void analogSetPeriod(int pin, int micros) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (p && micros > 0)
        p->setAnalogPeriodUs(micros);
#endif
}

/** Servo angle 0..180 degrees. */
//%
void servoWrite(int pin, int degrees) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (p)
        p->setServoValue(degrees);
#endif
}

/** Servo pulse width in microseconds. */
//%
void servoSetPulse(int pin, int micros) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (p)
        p->setServoPulseUs(micros);
#endif
}

/** pull: 0=down 1=up 2=none */
//%
void setPull(int pin, int pull) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (!p)
        return;
    p->setPull(pull == 0 ? PullMode::Down : (pull == 1 ? PullMode::Up : PullMode::None));
#endif
}

/** Enables edge (type=1) or pulse (type=2) events on the pin; returns the event source id. */
//%
int pinEventSource(int pin, int type) {
#if MBHW_NATIVE
    auto p = userPin(pin);
    if (!p)
        return 0;
    p->eventOn(type == 2 ? DEVICE_PIN_EVENT_ON_PULSE : DEVICE_PIN_EVENT_ON_EDGE);
    return p->id;
#else
    return 100 + pin;
#endif
}

// ---------------------------------------------------------------------------------- LED matrix

/** Sets one LED of the 5x5 matrix (brightness 0..255). Starts the LED matrix driver. */
//%
void ledPlot(int x, int y, int brightness) {
#if MBHW_NATIVE
    auto m = getLeds();
    if (m && x >= 0 && x < 5 && y >= 0 && y < 5)
        m->image.setPixelValue(x, y, brightness < 0 ? 0 : (brightness > 255 ? 255 : brightness));
#endif
}

/** Brightness (0..255) of one LED of the 5x5 matrix. */
//%
int ledPoint(int x, int y) {
#if MBHW_NATIVE
    auto m = getLeds();
    if (m && x >= 0 && x < 5 && y >= 0 && y < 5)
        return m->image.getPixelValue(x, y);
    return 0;
#else
    return 0;
#endif
}

/** Turns all LEDs of the 5x5 matrix off. */
//%
void ledClear() {
#if MBHW_NATIVE
    auto m = getLeds();
    if (m)
        m->clear();
#endif
}

/** Overall LED matrix brightness 0..255. */
//%
void ledSetBrightness(int value) {
#if MBHW_NATIVE
    auto m = getLeds();
    if (m)
        m->setBrightness(value < 0 ? 0 : (value > 255 ? 255 : value));
#endif
}

/** Turns the LED matrix driver on or off. Off releases the column pins P3 P4 P6 P7 P10
 *  for other uses (the timer stays reserved). */
//%
void ledEnable(bool on) {
#if MBHW_NATIVE
    if (!on && !ledMatrix)
        return;
    auto m = getLeds();
    if (!m)
        return;
    if (on)
        m->enable();
    else
        m->disable();
#endif
}

/** Light level 0..255 measured with the LED matrix. Starts the LED matrix driver. */
//%
int lightLevel() {
#if MBHW_NATIVE
    auto m = getLeds();
    return m ? m->readLightLevel() : 0;
#else
    return 127;
#endif
}

} // namespace mbhw

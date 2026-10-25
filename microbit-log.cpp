// Data logging for the arcade-microbit-hardware extension (micro:bit V2 only).
//
// Uses codal-microbit-v2's MicroBitLog, which stores rows in the USB interface chip's flash; they
// show up as MY_DATA.HTM on the MICROBIT drive, exactly like MakeCode for micro:bit's data logger.
//
// This file deliberately does NOT include pxt.h: pxt's platform.h defines pin-name macros
// (P0_0, P0_1, ...) that collide with the micro:bit headers MicroBitLog needs. microbit-hw.cpp
// calls the functions below instead.

#if defined(ARCADE_MBIT_CODAL) && defined(NRF52833)

#include "MicroBitIO.h"
#include "MicroBitI2C.h"
#include "MicroBitPowerManager.h"
#include "MicroBitUSBFlashManager.h"
#include "MicroBitLog.h"
#include "NRF52Serial.h"
#include <stddef.h>
#include <new>

using namespace codal;

namespace mbhwlog {

static MicroBitLog *dataLog;

NRF52I2C *createInternalI2C(NRF52Pin &sda, NRF52Pin &scl) {
    return new MicroBitI2C(sda, scl);
}

// MicroBitPowerManager and MicroBitUSBFlashManager take a MicroBitIO&, but only ever use its
// `irq1` member (the interrupt line shared by the interface chip and the motion sensor, P0.25).
// A real MicroBitIO would create a second set of pin objects that take over the GPIO interrupt
// routing of every pin from the Arcade runtime. So instead they get a block of memory shaped
// like a MicroBitIO in which only `irq1` is constructed. This relies on those two classes using
// nothing but io.irq1, which holds for codal-microbit-v2 v0.3.x.
static MicroBitIO &fakeIO() {
    static uint8_t storage[sizeof(MicroBitIO)] __attribute__((aligned(8)));
    static bool done;
    if (!done) {
        done = true;
#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Winvalid-offsetof"
        const size_t irqOffset = offsetof(MicroBitIO, irq1);
#pragma GCC diagnostic pop
        NRF52Pin *irq1 = new (storage + irqOffset) NRF52Pin(ID_PIN_IRQ1, P0_25, PIN_CAPABILITY_AD);
        // The line is open-drain, active low, shared with the motion sensor. Configure it the
        // way MicroBitAccelerometer::autoDetect() does, or isActive() would report the idle
        // (high) line as a pending request and the power manager would poll the interface chip
        // continuously.
        irq1->getDigitalValue();
        irq1->setPull(PullMode::Up);
        irq1->setActiveLo();
    }
    return *reinterpret_cast<MicroBitIO *>(storage);
}

void init(NRF52I2C &i2c, NRFLowLevelTimer &timer, NRF52Pin &tx, NRF52Pin &rx) {
    if (dataLog)
        return;
    // i2c was created by createInternalI2C(), so it really is a MicroBitI2C.
    MicroBitI2C &mi2c = static_cast<MicroBitI2C &>(i2c);
    MicroBitIO &io = fakeIO();
    auto power = new MicroBitPowerManager(mi2c, io, timer);
    auto flash = new MicroBitUSBFlashManager(mi2c, io, *power);
    // USB serial (interface chip UART), used when "mirror to serial" is on.
    auto serial = new NRF52Serial(tx, rx, NRF_UARTE0);
    dataLog = new MicroBitLog(*flash, *power, *serial);
}

int beginRow() { return dataLog ? dataLog->beginRow() : DEVICE_INVALID_STATE; }

int logData(const char *key, int keyLen, const char *value, int valueLen) {
    if (!dataLog)
        return DEVICE_INVALID_STATE;
    return dataLog->logData(ManagedString(key, (int16_t)keyLen),
                            ManagedString(value, (int16_t)valueLen));
}

int endRow() { return dataLog ? dataLog->endRow() : DEVICE_INVALID_STATE; }

void clear(bool fullErase) {
    if (dataLog)
        dataLog->clear(fullErase);
}

void setTimeStamp(int format) {
    if (dataLog)
        dataLog->setTimeStamp((TimeStampFormat)format);
}

void setSerialMirroring(bool on) {
    if (dataLog)
        dataLog->setSerialMirroring(on);
}

bool isFull() { return dataLog ? dataLog->isFull() : false; }

int eventSource() { return MICROBIT_ID_LOG; }

} // namespace mbhwlog

#endif

// Hardware smoke test for arcade-microbit-hardware.
// Download to a micro:bit V2 in an Arcade shield. The screen shows sensor values (refreshed
// every 250 ms); micro:bit events show up as speech bubbles. In the simulator values read 0/false.
//   controller A: calibrate the compass (then the heading is shown)
//   controller B: show a smiley on the 5x5 LEDs and read the light level
//   controller up/down: scroll text / play a sound expression
//   controller left/right: log a row of data / delete the log (see MY_DATA.HTM on the MICROBIT drive)
//   micro:bit button A+B: cycle the shield orientation setting (logo up/right/down/left)

let status = sprites.create(img`
    . . . . . . . .
    . . 1 1 1 1 . .
    . 1 1 1 1 1 1 .
    . 1 1 1 1 1 1 .
    . 1 1 1 1 1 1 .
    . 1 1 1 1 1 1 .
    . . 1 1 1 1 . .
    . . . . . . . .
`, SpriteKind.Player)
status.setPosition(150, 110)

function report(msg: string) {
    status.sayText(msg, 1000, false)
}

microbit_hardware.onButton(MicrobitButton.A, MicrobitButtonEvent.Click, () => report("A"))
microbit_hardware.onButton(MicrobitButton.B, MicrobitButtonEvent.Click, () => report("B"))
let logo = 0
microbit_hardware.onButton(MicrobitButton.AB, MicrobitButtonEvent.Click, () => {
    logo = (logo + 1) % 4
    microbit_hardware.setOrientation(logo, MicrobitLedFacing.TowardPlayer)
    report("logo dir " + logo)
})
microbit_hardware.onTouch(MicrobitTouchPin.Logo, MicrobitTouchEvent.Pressed, () => report("logo"))
microbit_hardware.onGesture(MicrobitGesture.Shake, () => report("shake"))
microbit_hardware.onGesture(MicrobitGesture.ScreenDown, () => report("face down"))
microbit_hardware.onSound(MicrobitSound.Loud, () => report("loud!"))
microbit_hardware.onPinEvent(MicrobitPin.P1, MicrobitPinEvent.Rise, () => report("P1 rise"))

let calibrated = false
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    microbit_hardware.calibrateCompass()
    calibrated = true
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    microbit_hardware.clearLeds()
    microbit_hardware.plot(1, 1)
    microbit_hardware.plot(3, 1)
    microbit_hardware.plot(0, 3)
    microbit_hardware.plot(4, 3)
    for (let x = 1; x <= 3; x++) microbit_hardware.plot(x, 4)
    report("light " + microbit_hardware.lightLevel())
})

controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    microbit_hardware.showString("Arcade", MicrobitPlayMode.InBackground)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    microbit_hardware.playSoundExpression(MicrobitSoundExpression.Giggle, MicrobitPlayMode.InBackground)
})
microbit_hardware.setColumnTitles("x", "y", "z")
controller.right.onEvent(ControllerButtonEvent.Pressed, function () {
    microbit_hardware.logData(
        microbit_hardware.createCV("x", microbit_hardware.acceleration(MicrobitDimension.X)),
        microbit_hardware.createCV("y", microbit_hardware.acceleration(MicrobitDimension.Y)),
        microbit_hardware.createCV("z", microbit_hardware.acceleration(MicrobitDimension.Z)))
    report("logged")
})
controller.left.onEvent(ControllerButtonEvent.Pressed, function () {
    microbit_hardware.deleteLog(MicrobitLogDelete.Fast)
    report("log deleted")
})
microbit_hardware.onLogFull(() => report("log full"))

let lines: string[] = []
game.onUpdateInterval(250, function () {
    lines = [
        "on micro:bit: " + microbit_hardware.isRunningOnMicrobit(),
        "acc " + microbit_hardware.acceleration(MicrobitDimension.X) + " " +
        microbit_hardware.acceleration(MicrobitDimension.Y) + " " +
        microbit_hardware.acceleration(MicrobitDimension.Z),
        "pitch " + microbit_hardware.rotation(MicrobitRotation.Pitch) +
        " roll " + microbit_hardware.rotation(MicrobitRotation.Roll),
        "mag " + Math.round(microbit_hardware.magneticForce(MicrobitDimension.Strength)) + " uT" +
        (calibrated ? "  hdg " + microbit_hardware.compassHeading() : ""),
        "temp " + microbit_hardware.temperature(MicrobitTemperatureUnit.Celsius) + " C",
        "sound " + microbit_hardware.soundLevel(),
        "A " + microbit_hardware.buttonIsPressed(MicrobitButton.A) +
        " B " + microbit_hardware.buttonIsPressed(MicrobitButton.B) +
        " logo " + microbit_hardware.isTouched(MicrobitTouchPin.Logo),
        "P0 analog " + microbit_hardware.analogReadPin(MicrobitAnalogPin.P0) +
        " P1 " + microbit_hardware.digitalReadPin(MicrobitPin.P1),
        "A:cal B:light ^:text v:sound >:log"
    ]
})

game.onPaint(function () {
    for (let i = 0; i < lines.length; i++)
        screen.print(lines[i], 2, 2 + i * 10, 1)
})

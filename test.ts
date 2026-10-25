// Hardware smoke test for arcade-microbit-hardware.
// Download to a micro:bit V2 in an Arcade shield. The screen shows sensor values (refreshed
// every 250 ms); micro:bit events show up as speech bubbles. In the simulator values read 0/false.
//   controller A: calibrate the compass (then the heading is shown)
//   controller B: show a smiley on the 5x5 LEDs and read the light level

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

microbit.onButton(MicrobitButton.A, MicrobitButtonEvent.Click, () => report("A"))
microbit.onButton(MicrobitButton.B, MicrobitButtonEvent.Click, () => report("B"))
microbit.onButton(MicrobitButton.AB, MicrobitButtonEvent.Click, () => report("A+B"))
microbit.onTouch(MicrobitTouchPin.Logo, MicrobitTouchEvent.Pressed, () => report("logo"))
microbit.onGesture(MicrobitGesture.Shake, () => report("shake"))
microbit.onGesture(MicrobitGesture.ScreenDown, () => report("face down"))
microbit.onSound(MicrobitSound.Loud, () => report("loud!"))
microbit.onPinEvent(MicrobitPin.P1, MicrobitPinEvent.Rise, () => report("P1 rise"))

let calibrated = false
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    microbit.calibrateCompass()
    calibrated = true
})

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    microbit.clearLeds()
    microbit.plot(1, 1)
    microbit.plot(3, 1)
    microbit.plot(0, 3)
    microbit.plot(4, 3)
    for (let x = 1; x <= 3; x++) microbit.plot(x, 4)
    report("light " + microbit.lightLevel())
})

let lines: string[] = []
game.onUpdateInterval(250, function () {
    lines = [
        "on micro:bit: " + microbit.isRunningOnMicrobit(),
        "acc " + microbit.acceleration(MicrobitDimension.X) + " " +
        microbit.acceleration(MicrobitDimension.Y) + " " +
        microbit.acceleration(MicrobitDimension.Z),
        "pitch " + microbit.rotation(MicrobitRotation.Pitch) +
        " roll " + microbit.rotation(MicrobitRotation.Roll),
        "mag " + Math.round(microbit.magneticForce(MicrobitDimension.Strength)) + " uT" +
        (calibrated ? "  hdg " + microbit.compassHeading() : ""),
        "temp " + microbit.temperature(MicrobitTemperatureUnit.Celsius) + " C",
        "sound " + microbit.soundLevel(),
        "A " + microbit.buttonIsPressed(MicrobitButton.A) +
        " B " + microbit.buttonIsPressed(MicrobitButton.B) +
        " logo " + microbit.isTouched(MicrobitTouchPin.Logo),
        "P0 analog " + microbit.analogReadPin(MicrobitAnalogPin.P0) +
        " P1 " + microbit.digitalReadPin(MicrobitPin.P1),
        "ctrl A: calibrate  B: light"
    ]
})

game.onPaint(function () {
    for (let i = 0; i < lines.length; i++)
        screen.print(lines[i], 2, 2 + i * 10, 1)
})

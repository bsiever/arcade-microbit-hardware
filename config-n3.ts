// Only compiled for the hw---n3 hardware variant (see "fileDependencies" in pxt.json).
//
// Arcade's own "edge-connector" extension (pins.P0 ... pins.P20) looks each pin up by a config
// key and crashes on a pin the hardware variant does not define. hw---n3 only defines
// P0, P1, P2, so this file adds the rest of the micro:bit V2 edge connector.
// (Pins the variant already defines are left out: TypeScript does not allow redeclaring them.)
namespace config {
    export const PIN_P3 = DAL.P0_31
    export const PIN_P4 = DAL.P0_28
    export const PIN_P5 = DAL.P0_14
    export const PIN_P6 = DAL.P1_5
    export const PIN_P7 = DAL.P0_11
    export const PIN_P8 = DAL.P0_10
    export const PIN_P9 = DAL.P0_9
    export const PIN_P10 = DAL.P0_30
    export const PIN_P11 = DAL.P0_23
    export const PIN_P12 = DAL.P0_12
    export const PIN_P13 = DAL.P0_17
    export const PIN_P14 = DAL.P0_1
    export const PIN_P15 = DAL.P0_13
    export const PIN_P16 = DAL.P1_2
    export const PIN_P19 = DAL.P0_26
    export const PIN_P20 = DAL.P1_0
}

# PCD8544

Kaluma library for PCD8544, a.k.a Nokia 5110 (Monochrome LCD Display)

![pcd8544](https://github.com/niklauslee/pcd8544/blob/main/images/pcd8544.jpg?raw=true)

You can get Nokia 5110 LCD displays from belows:

- [Nokia 5110 LCD (from Adafruit)](https://www.adafruit.com/product/338)

# Wiring

Here is a wiring example for `SPI0`.

| Raspberry Pi Pico | PCD8544 (Nokia 5110) |
| ----------------- | -------------------- |
| 3V3               | VCC                  |
| GND               | GND                  |
| GP19 (SPI0 TX)    | DIN                  |
| GP18 (SPI0 CLK)   | CLK                  |
| GP20              | DC                   |
| GP21              | RST                  |
| GP17              | CE (CS)              |
| GP22              | BL (LED)             |

![wiring](https://github.com/niklauslee/pcd8544/blob/main/images/wiring.png?raw=true)

# Install

```sh
npm i https://github.com/niklauslee/pcd8544
```

# Usage

You can initialize PCD8544 driver using SPI interface as below:

```js
const {PCD8544} = require('pcd8544');
const pcd8544 = new PCD8544();

pcd8544.setup(board.spi(0), {dc: 20, cs: 17, rst: 21, bl: 22});
const gc = pcd8544.getContext();
// Use Graphics APIs
// gc.drawRect(0, 0, width, height);
// gc.display();
```

# API

## Class: PCD8544

A class for PCD8544 driver communicating with SPI interface.

### new PCD8544()

Create an instance of PCD8544 driver.

### pcd8544.setup(spi[, options])

- **`spi`** `<SPI>` An instance of `SPI` to communicate.
- **`options`** `<object>` Options for initialization.
  - **`dc`** `<number>` Pin number for DC. Default `-1`.
  - **`cs`** `<number>` Pin number for CS. Default `-1`.
  - **`rst`** `<number>` Pin number for RST. Default `-1`.
  - **`bl`** `<number>` Pin number for BL (Backlight). Default `-1`.
  - **`bias`** `<number>` Bias value. Default `0x04`.
  - **`contrast`** `<number>` Contrast value. Default `0x3F`.
  - **`rotation`** `<number>` Rotation of screen. One of `0` (0 degree), `1` (90 degree in clockwise), `2` (180 degree in clockwise), and `3` (270 degree in clockwise). Default: `0`.

Setup PCD8544 driver for a given SPI bus and options.

### pcd8544.getContext()

- **Returns**: `<BufferedGraphicsContext>` An instance of buffered graphic context for PCD8544.

### pcd8544.setBias(bias)

- **`bias`** `<number>` Bias value.

Set bias of the display.

### pcd8544.setContrast(contrast)

- **`contrast`** `<number>` Contrast value.

Set contrast of the display.

### pcd8544.setBacklight(value)

- **`value`** `<number>` `HIGH` or `LOW`.

Turn on/off the backlight.

# Examples

* `example.js` (84x48 resolution)

/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

const { BufferedGraphicsContext } = __webpack_require__(2);

/**
 * PCD8544 class
 */
class PCD8544 {
  /**
   * Setup PCD8544 for SPI connection
   * @param {SPI} spi
   * @param {Object} options
   *   .dc {number=-1}
   *   .cs {number=-1}
   *   .rst {number=-1}
   *   .bl {number=-1}
   *   .bias {number=0x04}
   *   .contrast {number=0x3F}
   *   .rotation {number=0}
   */
  setup(spi, options) {
    this.width = 84;
    this.height = 48;
    this.spi = spi;
    options = Object.assign(
      {
        dc: -1,
        cs: -1,
        rst: -1,
        bl: -1,
        bias: 0x04,
        contrast: 0x3f,
        rotation: 0,
      },
      options
    );
    this.dc = options.dc;
    this.cs = options.cs;
    this.rst = options.rst;
    this.bl = options.bl;
    this.bias = options.bias;
    this.contrast = options.contrast;
    this.rotation = options.rotation;
    this.context = null;
    if (this.dc > -1) pinMode(this.dc, OUTPUT);
    if (this.cs > -1) pinMode(this.cs, OUTPUT);
    if (this.rst > -1) pinMode(this.rst, OUTPUT);
    if (this.bl > -1) pinMode(this.bl, OUTPUT);
    this.reset();
    delay(50);
    var cmds = new Uint8Array([
      0x20 | 0x01, // fnset | extended
      0x80 | this.contrast, // set contrast
      0x10 | this.bias, // set bias
      0x04 | 0x02, // temp control
      0x20, // fnset normal
      0x08 | 0x04, // set display to normal
    ]);
    this.sendCommands(cmds);
    delay(50);
  }

  reset() {
    if (this.cs > -1) digitalWrite(this.cs, LOW);
    if (this.dc > -1) digitalWrite(this.dc, LOW);
    if (this.rst > -1) {
      digitalWrite(this.rst, LOW);
      delay(10);
      digitalWrite(this.rst, HIGH);
    }
    if (this.cs > -1) digitalWrite(this.cs, HIGH);
  }

  setBias(bias) {
    var cmds = new Uint8Array([
      0x20 | 0x01, // fnset | extended
      0x10 | bias, // set bias
      0x20, // fnset normal
    ]);
    this.sendCommands(cmds);
  }

  setContrast(contrast) {
    var cmds = new Uint8Array([
      0x20 | 0x01, // fnset | extended
      0x80 | contrast, // set contrast
      0x20, // fnset normal
    ]);
    this.sendCommands(cmds);
  }

  sendCommands(cmds) {
    if (this.dc > -1) digitalWrite(this.dc, LOW); // cmd
    if (this.cs > -1) digitalWrite(this.cs, LOW); // select
    this.spi.send(cmds);
    if (this.cs > -1) digitalWrite(this.cs, HIGH); // deselect
  }

  sendData(buffer) {
    if (this.dc > -1) digitalWrite(this.dc, HIGH); // data
    if (this.cs > -1) digitalWrite(this.cs, LOW); // select
    this.spi.send(buffer);
    if (this.cs > -1) digitalWrite(this.cs, HIGH); // deselect
  }

  getContext() {
    if (!this.context) {
      this.context = new BufferedGraphicsContext(this.width, this.height, {
        rotation: this.rotation,
        bpp: 1,
        display: (buffer) => {
          var cmds = new Uint8Array([
            0x40, // set y-addr
            0x80, // set x-addr
          ]);
          this.sendCommands(cmds);
          this.sendData(buffer);
        },
      });
    }
    return this.context;
  }

  setBacklight(val) {
    if (this.bl > -1) {
      digitalWrite(this.bl, val);
    }
  }
}

exports.PCD8544 = PCD8544;


/***/ }),
/* 2 */
/***/ ((module) => {

"use strict";
module.exports = require("graphics");

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const font = __webpack_require__(4);
const logo = __webpack_require__(5);

/**
 * Perform mono graphic showcase
 * @param {GraphicContext} gc
 */
function showcase(gc, interval) {
  // start
  gc.clearScreen();
  gc.setFontColor(1);
  gc.drawText(0, 0, "Graphics Examples");
  gc.display();
  delay(interval);

  // pixels
  gc.clearScreen();
  for (let x = 0; x < gc.getWidth(); x += 5) {
    for (let y = 0; y < gc.getHeight(); y += 5) {
      gc.setPixel(x, y, 1);
    }
  }
  gc.display();
  delay(interval);

  // lines
  gc.clearScreen();
  gc.setColor(1);
  for (let x = 0; x < gc.getWidth(); x += 5) {
    gc.drawLine(0, 0, x, gc.getHeight() - 1);
    gc.drawLine(gc.getWidth() - 1, 0, x, gc.getHeight() - 1);
  }
  gc.display();
  delay(interval);

  // rectangles
  gc.clearScreen();
  gc.setColor(1);
  for (let x = 0; x < gc.getWidth(); x += 5) {
    if (x * 2 < Math.min(gc.getHeight(), gc.getWidth())) {
      gc.drawRect(x, x, gc.getWidth() - x * 2, gc.getHeight() - x * 2);
    }
  }
  gc.display();
  delay(interval);

  // filled rectangles
  gc.clearScreen();
  gc.setFillColor(1);
  for (let x = 0; x < gc.getWidth(); x += 10) {
    for (let y = 0; y < gc.getWidth(); y += 10) {
      if (((x + y) / 10) % 2 === 0) {
        gc.fillRect(x, y, 10, 10);
      }
    }
  }
  gc.display();
  delay(interval);

  // circles
  gc.clearScreen();
  gc.setFillColor(1);
  for (let x = 0; x < gc.getWidth(); x += 30) {
    for (let y = 0; y < gc.getWidth(); y += 30) {
      gc.drawCircle(x + 15, y + 15, 14);
      gc.fillCircle(x + 15, y + 15, 8);
    }
  }
  gc.display();
  delay(interval);

  // round rectangles
  gc.clearScreen();
  gc.setFillColor(1);
  for (let x = 0; x < gc.getWidth(); x += 30) {
    for (let y = 0; y < gc.getWidth(); y += 20) {
      gc.drawRoundRect(x, y, 28, 18, 5);
      gc.fillRoundRect(x + 3, y + 3, 22, 12, 4);
    }
  }
  gc.display();
  delay(interval);

  // font
  gc.clearScreen();
  gc.setFontColor(1);
  gc.drawText(
    0,
    0,
    "ABCDEFGHIJKLMN\nOPQRSTUVWXYZ\nabcdefghijklmn\nopqrstuvwxyz\n0123456789\n~!@#$%^&*()-=_+\n[]{}\\|:;'<>/?.,"
  );
  gc.display();
  delay(interval);

  // font scale
  gc.clearScreen();
  gc.setFontColor(1);
  gc.setFontScale(3, 3);
  gc.drawText(
    0,
    0,
    "ABCDEFGHIJKLMN\nOPQRSTUVWXYZ\nabcdefghijklmn\nopqrstuvwxyz\n0123456789\n~!@#$%^&*()-=_+\n[]{}\\|:;'<>/?.,"
  );
  gc.display();
  gc.setFontScale(1, 1);
  delay(interval);

  // custom font
  gc.clearScreen();
  gc.setFontColor(1);
  gc.setFont(font);
  gc.setFontScale(1, 1);
  gc.drawText(0, 0, 'Custom Font\n"Lee Sans"\nVariable-width Font');
  gc.display();
  delay(interval);

  // bitmap (logo)
  gc.clearScreen();
  gc.setColor(1);
  let x = Math.floor((gc.getWidth() - logo.width) / 2);
  let y = Math.floor((gc.getHeight() - logo.height) / 2);
  gc.drawBitmap(x, y, logo);
  gc.display();
}

module.exports = showcase;


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = {
  bitmap: atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgACAAIAAgACAAAAAgAAAAAAAAACgAKAAAAAAAAAAAAAAAAAAAAAAAAAAJAAkAP8AJAAkAP8AJAAkAAAAAAAAACAAcACoAKAAcAAoAKgAcAAgAAAAAABhAJIAlABoABYAKQBJAIYAAAAAAAAAMABIAEgAcACKAIoAhAB6AAAAAAAAAIAAgAAAAAAAAAAAAAAAAAAAAAAAAABgAIAAgACAAIAAgACAAGAAAAAAAAAAwAAgACAAIAAgACAAIADAAAAAAAAAAAAAIAAgAPgAIABQAAAAAAAAAAAAAAAAACAAIAD4ACAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQABAAIAAAAAAAAAAAAAAAAAA+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAEAAQACAAIABAAEAAgACAAAAAAAAAAHAAiACIAJgAqADIAIgAcAAAAAAAAAAgAGAAoAAgACAAIAAgACAAAAAAAAAAcACIAAgAEAAgAEAAgAD4AAAAAAAAAHAAiAAIAHAACAAIAIgAcAAAAAAAAAAYACgASACIAPwACAAIAAgAAAAAAAAA+ACAAIAA8AAIAAgAiABwAAAAAAAAAHAAiACAAPAAiACIAIgAcAAAAAAAAAD8AAQABAAIABAAIAAgACAAAAAAAAAAcACIAIgAcACIAIgAiABwAAAAAAAAAHAAiACIAIgAeAAIAIgAcAAAAAAAAAAAAAAAgAAAAAAAAACAAAAAAAAAAAAAAAAAAEAAAAAAAAAAQACAAAAAAAAAABAAIABAAIAAgABAACAAEAAAAAAAAAAAAAAA+AAAAAAA+AAAAAAAAAAAAAAAgABAACAAEAAQACAAQACAAAAAAAAAAHAAiAAIABAAIAAgAAAAIAAAAAAAAAA8AEIAmQClAKUAnwBAAD4AAAAAAAAAEAAQACgAKABEAHwAggCCAAAAAAAAAPAAiACIAPAAiACIAIgA8AAAAAAAAAA4AEQAgACAAIAAgABEADgAAAAAAAAA8ACIAIQAhACEAIQAiADwAAAAAAAAAPwAgACAAPgAgACAAIAA/AAAAAAAAAD8AIAAgAD4AIAAgACAAIAAAAAAAAAAOABEAIAAgACcAIQARAA4AAAAAAAAAIQAhACEAPwAhACEAIQAhAAAAAAAAACAAIAAgACAAIAAgACAAIAAAAAAAAAAEAAQABAAEAAQABAAkABgAAAAAAAAAIQAiACQAOAAkACIAIQAhAAAAAAAAACAAIAAgACAAIAAgACAAPgAAAAAAAAAggDGAKoAkgCSAIIAggCCAAAAAAAAAIIAwgCiAJIAigCGAIIAggAAAAAAAAA4AEQAggCCAIIAggBEADgAAAAAAAAA+ACEAIQAhAD4AIAAgACAAAAAAAAAADgARACCAIIAkgCKAEQAOgAAAAAAAAD4AIQAhAD4AJAAiACEAIQAAAAAAAAAeACEAIAAeAAEAAQAhAB4AAAAAAAAAP4AEAAQABAAEAAQABAAEAAAAAAAAACCAIIAggCCAIIAggBEADgAAAAAAAAAggCCAEQARAAoACgAEAAQAAAAAAAAAIAggCBEQERAKoAqgBEAEQAAAAAAAACCAEQAKAAQACgARACCAIIAAAAAAAAAggBEACgAEAAQABAAEAAQAAAAAAAAAPwABAAIABAAIABAAIAA/AAAAAAAAADgAIAAgACAAIAAgACAAOAAAAAAAAAAgACAAEAAQAAgACAAEAAQAAAAAAAAAOAAIAAgACAAIAAgACAA4AAAAAAAAAAgAFAAiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD4AAAAAAAAAIAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwAAgAeACIAHQAAAAAAAAAgACAAIAA8ACIAIgAiADwAAAAAAAAAAAAAAAAAHAAiACAAIgAcAAAAAAAAAAIAAgACAB4AIgAiACIAHgAAAAAAAAAAAAAAAAAcACIAPgAgAB4AAAAAAAAADAAQABAAPAAQABAAEAAQAAAAAAAAAAAAAAAAABwAIgAiACIAHgACABwAAAAgACAAIAA8ACIAIgAiACIAAAAAAAAAAAAgAAAAIAAgACAAIAAgAAAAAAAAAAAACAAAAAgACAAIAAgACAAwAAAAAAAgACAAIAAiACQAOAAkACIAAAAAAAAAMAAQABAAEAAQABAAEAAQAAAAAAAAAAAAAAAAAD8AJIAkgCSAJIAAAAAAAAAAAAAAAAA8ACIAIgAiACIAAAAAAAAAAAAAAAAAHAAiACIAIgAcAAAAAAAAAAAAAAAAADwAIgAiACIAPAAgACAAAAAAAAAAAAAeACIAIgAiAB4AAgACAAAAAAAAAAAALAAwACAAIAAgAAAAAAAAAAAAAAAAAB4AIAAcAAIAPAAAAAAAAAAAABAAEAA+ABAAEAAQAA4AAAAAAAAAAAAAAAAAIgAiACIAIgAeAAAAAAAAAAAAAAAAACIAIgAUABQACAAAAAAAAAAAAAAAAAAggCCAFQAVAAoAAAAAAAAAAAAAAAAAIgAUAAgAFAAiAAAAAAAAAAAAAAAAACIAIgAiACIAHgACABwAAAAAAAAAAAA+AAQACAAQAD4AAAAAAAAACAAQABAAEAAgABAAEAAQAAgAAAAAACAAIAAgACAAIAAgACAAIAAAAAAAAAAgABAAEAAQAAgAEAAQABAAIAAAAAAAAAAZACYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"),
  glyphs: atob("BQgGAQgCAwIECAgJBQkGCAgJBwgIAQICAwgEAwgEBQYGBQYGAgkDBQUGAQgCBAgFBQgGAwgEBQgGBQgGBggHBQgGBQgGBggHBQgGBQgGAQcCAggDBAgFBQYGBAgFBQgGCAgJBwgIBQgGBggHBggHBggHBggHBggHBggHAQgCBAgFBggHBQgGBwgIBwgIBwgIBggHBwgIBggHBggHBwgIBwgIBwgICwgMBwgIBwgIBggHAwgEBAgFAwgEBQMGBQgGAgIDBggHBQgGBQgGBQgGBQgGBAgFBQoGBQgGAQgCAwkEBQgGAggDBwgIBQgGBQgGBQoGBQoGBAgFBQgGBQgGBQgGBQgGBwgIBQgGBQoGBQgGAwkEAQgCAwkEBgMHAQEC"),
  width: 11,
  height: 11,
  first: 32,
  last: 127,
  advanceX: 11,
  advanceY: 11
}


/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"width":39,"height":32,"bpp":1,"data":"AAAAAgAAHwAHAAA/8B+AAP//OIAB///wwAf//+DgD///4HA////wcH////P4//////z//////v////wA//////D/////8P/////A+OBgP4DwwDAAAPDwMAAA8cAeAADxwA4AAPAADgAA8A4AAAD4GYAAAHgw4AAAOBBgAAAcECAAAB4IYAAADwhgAAAHgOAAAAfPwAAAAP8AAAAAHAAAAA=="}');

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/**
 * Example for PCD8544 LCD driver
 */

const { PCD8544 } = __webpack_require__(1);
const showcase = __webpack_require__(3);

const pcd8544 = new PCD8544();
pcd8544.setup(board.spi(0), {
  dc: 20,
  cs: 17,
  rst: 21,
  bl: 22,
});

const gc = pcd8544.getContext();
showcase(gc, 3000);

})();

/******/ })()
;
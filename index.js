const { BufferedGraphicsContext } = require("graphics");

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

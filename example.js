/**
 * Example for PCD8544 LCD driver
 */

const { PCD8544 } = require("./index");
const showcase = require("./gc-mono-showcase");

const pcd8544 = new PCD8544();
pcd8544.setup(board.spi(0), {
  dc: 20,
  cs: 17,
  rst: 21,
  bl: 22,
});

const gc = pcd8544.getContext();
showcase(gc, 3000);

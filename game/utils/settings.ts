export abstract class Settings {
  static readonly cameraEasing = 0.06;

  static readonly tileSize = 32;

  static readonly transitionDuration = 500;

  static readonly yPixelsNumber = 250;

  static cameraOffset = {
    x: 0,
    y: 0,
  };

  static debug = false;

  static ratio = 0;

  static scene = {
    columns: 0,
    rows: 0,

    width: 1000,
    height: 1000,
  };
}

import { Dimensions } from './dimensions';

class pixelratio {
  get() {
    // returns the pixel density
    return Dimensions.get('window').scale;
  }
  getPixelSizeForLayoutSize(size) {
    // check orientation for scaling calc
    const diff =
      Dimensions.get('window').width - Dimensions.get('window').height;
    const currentScreen =
      diff < 1
        ? Dimensions.get('window').width
        : Dimensions.get('window').height;
    const baseScreen = 640; // iPhone 5
    const ratio = currentScreen / baseScreen;
    return Math.round(ratio * size);
  }
}

const PixelRatio = new pixelratio();

export { PixelRatio };

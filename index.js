import { RasterManager } from './lib/rastermanager';
import { Component } from './lib/component';
import { View } from './lib/view';
import { Animated } from './lib/animated';
import { Events , EventEmitter } from './lib/events';
import { Button } from './lib/button';
import { Text } from './lib/text';
import { Image } from './lib/image';
import { NativeModules } from './lib/nativemodules';
import { Dimensions } from './lib/dimensions';
import { ScrollView } from './lib/scrollview';
import { LinearGradient } from './lib/lineargradient';

import { DOMRaster } from './lib/rasters/dom';
import { WKRaster } from './lib/rasters/wkwebview';

if (window.SyrBridge || (window.webkit && window.webkit.messageHandlers)) {
  RasterManager.setRaster(WKRaster);
}  else {
  RasterManager.setRaster(DOMRaster);
}

const Render = RasterManager.render;

export {
  Component,
  Render,
  RasterManager,
  View,
  Animated,
  Events,
  Button,
  Text,
  Image,
  NativeModules,
  Dimensions,
  EventEmitter,
  ScrollView,
  LinearGradient
};
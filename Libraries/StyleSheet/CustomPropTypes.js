/**
 * Copyright (c) 2020-present, ColynDeng.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule CustomPropTypes
 * @flow
 */
'use strict';

var ReactPropTypes = require('prop-types');

var CustomPropTypes = {
  hitSlop: ReactPropTypes.object,
  pointerEvents: ReactPropTypes.string,
  onLayout: ReactPropTypes.bool,
  accessible: ReactPropTypes.bool,
  accessibilityRole: ReactPropTypes.string,
  accessibilityLabel: ReactPropTypes.string,
  accessibilityState: ReactPropTypes.object,
  accessibilityActions: ReactPropTypes.array,
  accessibilityValue: ReactPropTypes.object,
  accessibilityLiveRegion: ReactPropTypes.string,
  importantForAccessibility: ReactPropTypes.string,
  collapsable: ReactPropTypes.bool,
  removeClippedSubviews: ReactPropTypes.bool,
  needsOffscreenAlphaCompositing: ReactPropTypes.bool,
  nativeID: ReactPropTypes.string,
  testID: ReactPropTypes.string,
  renderToHardwareTextureAndroid: ReactPropTypes.bool,
  /**
   *
   * @platform ios
   */
  onMagicTap: ReactPropTypes.bool,
  onAccessibilityTap: ReactPropTypes.bool,
  onAccessibilityAction: ReactPropTypes.bool,
  shouldRasterizeIOS: ReactPropTypes.bool,
  accessibilityIgnoresInvertColors: ReactPropTypes.bool,
  accessibilityViewIsModal: ReactPropTypes.bool,
  contentInset: ReactPropTypes.object,
  scrollIndicatorInsets: ReactPropTypes.object,
  capInsets: ReactPropTypes.object,
  /**
   * @deprecated
   */
  accessibilityComponentType: ReactPropTypes.string,
};

module.exports = CustomPropTypes;

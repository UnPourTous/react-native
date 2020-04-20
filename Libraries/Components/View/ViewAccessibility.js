/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ViewAccessibility
 * @flow
 */
'use strict';

export type AccessibilityTrait =
  'none' |
  'button' |
  'link' |
  'header' |
  'search' |
  'image' |
  'selected' |
  'plays' |
  'key' |
  'text' |
  'summary' |
  'disabled' |
  'frequentUpdates' |
  'startsMedia' |
  'adjustable' |
  'allowsDirectInteraction' |
  'pageTurn';

export type AccessibilityComponentType =
  'none' |
  'button' |
  'checkbox' |
  'radiobutton' |
  'switch' |
  'checked' |
  'disabled' |
  'radiobutton_checked' |
  'radiobutton_unchecked';

export type AccessibilityRole =
  | 'none'
  | 'button'
  | 'link'
  | 'search'
  | 'image'
  | 'keyboardkey'
  | 'text'
  | 'adjustable'
  | 'imagebutton'
  | 'header'
  | 'summary';

export type CurrentViewState = 'selected' | 'disabled';

export type CurrentViewStates =
  | CurrentViewState
  | $ReadOnlyArray<CurrentViewState>;

module.exports = {
  AccessibilityTraits: [
    'none',
    'button',
    'link',
    'header',
    'search',
    'image',
    'selected',
    'plays',
    'key',
    'text',
    'summary',
    'disabled',
    'frequentUpdates',
    'startsMedia',
    'adjustable',
    'allowsDirectInteraction',
    'pageTurn',
  ],
  AccessibilityComponentTypes: [
    'none',
    'button',
    'checkbox',
    'radiobutton',
    'switch',
    'checked',
    'disabled',
    'radiobutton_checked',
    'radiobutton_unchecked',
  ],
  AccessibilityRoles: [
    'none',
    'button',
    'link',
    'search',
    'image',
    'keyboardkey',
    'text',
    'adjustable',
    'imagebutton',
    'header',
    'summary',
  ],
  CurrentViewStates: ['selected', 'disabled'],
};

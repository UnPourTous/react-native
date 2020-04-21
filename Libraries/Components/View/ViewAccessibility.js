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

import type {SyntheticEvent} from 'CoreEventTypes';

// This must be kept in sync with the AccessibilityRolesMask in RCTViewManager.m
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
  | 'summary'
  | 'alert'
  | 'checkbox'
  | 'combobox'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'scrollbar'
  | 'spinbutton'
  | 'switch'
  | 'tab'
  | 'tablist'
  | 'timer'
  | 'toolbar';

// the info associated with an accessibility action
export type AccessibilityActionInfo = $ReadOnly<{
  name: string,
  label?: string,
}>;

// The info included in the event sent to onAccessibilityAction
export type AccessibilityActionEvent = SyntheticEvent<
  $ReadOnly<{
    actionName: string,
  }>,
>;

export type AccessibilityState = {
  disabled?: boolean,
  selected?: boolean,
  checked?: ?boolean | 'mixed',
  busy?: boolean,
  expanded?: boolean,
};

export type AccessibilityValue = $ReadOnly<{|
  /**
   * The minimum value of this component's range. (should be an integer)
   */
  min?: number,

  /**
   * The maximum value of this component's range. (should be an integer)
   */
  max?: number,

  /**
   * The current value of this component's range. (should be an integer)
   */
  now?: number,

  /**
   * A textual description of this component's value. (will override minimum, current, and maximum if set)
   */
  text?: string,
|}>;

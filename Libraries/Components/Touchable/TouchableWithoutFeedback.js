/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule TouchableWithoutFeedback
 * @flow
 */
'use strict';

const DeprecatedEdgeInsetsPropType = require('../../DeprecatedPropTypes/DeprecatedEdgeInsetsPropType');
const React = require('React');
const PropTypes = require('prop-types');
const TimerMixin = require('react-timer-mixin');
const Touchable = require('Touchable');

const createReactClass = require('create-react-class');
const ensurePositiveDelayProps = require('ensurePositiveDelayProps');
const warning = require('fbjs/lib/warning');

const {
  DeprecatedAccessibilityRoles,
} = require('../../DeprecatedPropTypes/DeprecatedViewAccessibility');

export type Event = Object;

import {EdgeInsetsProp} from '../../StyleSheet/EdgeInsetsPropType';
import type {
  AccessibilityRole,
  AccessibilityState,
  AccessibilityActionInfo,
  AccessibilityActionEvent,
  AccessibilityValue,
} from '../View/ViewAccessibility';

const PRESS_RETENTION_OFFSET = {top: 20, left: 20, right: 20, bottom: 30};

const OVERRIDE_PROPS = [
  'accessibilityLabel',
  'accessibilityHint',
  'accessibilityIgnoresInvertColors',
  'accessibilityRole',
  'accessibilityState',
  'accessibilityActions',
  'onAccessibilityAction',
  'accessibilityValue',
  'importantForAccessibility',
  'accessibilityLiveRegion',
  'accessibilityViewIsModal',
  'hitSlop',
  'nativeID',
  'onBlur',
  'onFocus',
  'onLayout',
  'testID',
];

export type Props = $ReadOnly<{|
  accessibilityActions?: ?$ReadOnlyArray<AccessibilityActionInfo>,
  accessibilityIgnoresInvertColors?: ?boolean,
  accessibilityLabel?: ?Stringish,
  accessibilityRole?: ?AccessibilityRole,
  accessibilityState?: ?AccessibilityState,
  accessibilityValue?: ?AccessibilityValue,
  accessible?: ?boolean,
  accessibilityLiveRegion?: ?('none' | 'polite' | 'assertive'),
  accessibilityViewIsModal?: ?boolean,
  children?: ?React.Node,
  delayLongPress?: ?number,
  delayPressIn?: ?number,
  delayPressOut?: ?number,
  disabled?: ?boolean,
  hitSlop?: ?EdgeInsetsProp,
  importantForAccessibility?: ?('auto' | 'yes' | 'no' | 'no-hide-descendants'),
  nativeID?: ?string,
  onLayout?: ?Function,
  onLongPress?: ?Function,
  onPress?: ?Function,
  onPressIn?: ?Function,
  onPressOut?: ?Function,
  onAccessibilityAction?: ?(event: AccessibilityActionEvent) => void,
  pressRetentionOffset?: ?EdgeInsetsProp,
  rejectResponderTermination?: ?boolean,
  testID?: ?string,
|}>;

/**
 * Do not use unless you have a very good reason. All elements that
 * respond to press should have a visual feedback when touched.
 *
 * TouchableWithoutFeedback supports only one child.
 * If you wish to have several child components, wrap them in a View.
 */
const TouchableWithoutFeedback = ((createReactClass({
  displayName: 'TouchableWithoutFeedback',
  mixins: [TimerMixin, Touchable.Mixin],

  propTypes: {
    accessible: PropTypes.bool,
    accessibilityLabel: PropTypes.node,
    accessibilityIgnoresInvertColors: PropTypes.bool,
    accessibilityRole: PropTypes.oneOf(DeprecatedAccessibilityRoles),
    accessibilityState: PropTypes.object,
    accessibilityActions: PropTypes.array,
    onAccessibilityAction: PropTypes.func,
    accessibilityValue: PropTypes.object,
    /**
     * Indicates to accessibility services whether the user should be notified
     * when this view changes. Works for Android API >= 19 only.
     *
     * @platform android
     *
     * See http://facebook.github.io/react-native/docs/view.html#accessibilityliveregion
     */
    accessibilityLiveRegion: (PropTypes.oneOf([
      'none',
      'polite',
      'assertive',
    ]): React$PropType$Primitive<'none' | 'polite' | 'assertive'>),
    /**
     * Controls how view is important for accessibility which is if it
     * fires accessibility events and if it is reported to accessibility services
     * that query the screen. Works for Android only.
     *
     * @platform android
     *
     * See http://facebook.github.io/react-native/docs/view.html#importantforaccessibility
     */
    importantForAccessibility: (PropTypes.oneOf([
      'auto',
      'yes',
      'no',
      'no-hide-descendants',
    ]): React$PropType$Primitive<
      'auto' | 'yes' | 'no' | 'no-hide-descendants',
      >),
    /**
     * A value indicating whether VoiceOver should ignore the elements
     * within views that are siblings of the receiver.
     * Default is `false`.
     *
     * @platform ios
     *
     * See http://facebook.github.io/react-native/docs/view.html#accessibilityviewismodal
     */
    accessibilityViewIsModal: PropTypes.bool,
    /**
     * If true, disable all interactions for this component.
     */
    disabled: PropTypes.bool,
    /**
     * Called when the touch is released, but not if cancelled (e.g. by a scroll
     * that steals the responder lock).
     */
    onPress: PropTypes.func,
    /**
    * Called as soon as the touchable element is pressed and invoked even before onPress.
    * This can be useful when making network requests.
    */
    onPressIn: PropTypes.func,
    /**
    * Called as soon as the touch is released even before onPress.
    */
     onPressOut: PropTypes.func,
    /**
     * Invoked on mount and layout changes with
     *
     *   `{nativeEvent: {layout: {x, y, width, height}}}`
     */
    onLayout: PropTypes.func,

    onLongPress: PropTypes.func,

    nativeID: PropTypes.string,
    testID: PropTypes.string,

    /**
     * Delay in ms, from the start of the touch, before onPressIn is called.
     */
    delayPressIn: PropTypes.number,
    /**
     * Delay in ms, from the release of the touch, before onPressOut is called.
     */
    delayPressOut: PropTypes.number,
    /**
     * Delay in ms, from onPressIn, before onLongPress is called.
     */
    delayLongPress: PropTypes.number,
    /**
     * When the scroll view is disabled, this defines how far your touch may
     * move off of the button, before deactivating the button. Once deactivated,
     * try moving it back and you'll see that the button is once again
     * reactivated! Move it back and forth several times while the scroll view
     * is disabled. Ensure you pass in a constant to reduce memory allocations.
     */
    pressRetentionOffset: DeprecatedEdgeInsetsPropType,
    /**
     * This defines how far your touch can start away from the button. This is
     * added to `pressRetentionOffset` when moving off of the button.
     * ** NOTE **
     * The touch area never extends past the parent view bounds and the Z-index
     * of sibling views always takes precedence if a touch hits two overlapping
     * views.
     */
    hitSlop: DeprecatedEdgeInsetsPropType,
  },

  getInitialState: function() {
    return this.touchableGetInitialState();
  },

  componentDidMount: function() {
    ensurePositiveDelayProps(this.props);
  },

  componentWillReceiveProps: function(nextProps: Object) {
    ensurePositiveDelayProps(nextProps);
  },

  /**
   * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
   * defined on your component.
   */
  touchableHandlePress: function(e: Event) {
    this.props.onPress && this.props.onPress(e);
  },

  touchableHandleActivePressIn: function(e: Event) {
    this.props.onPressIn && this.props.onPressIn(e);
  },

  touchableHandleActivePressOut: function(e: Event) {
    this.props.onPressOut && this.props.onPressOut(e);
  },

  touchableHandleLongPress: function(e: Event) {
    this.props.onLongPress && this.props.onLongPress(e);
  },

  touchableGetPressRectOffset: function(): typeof PRESS_RETENTION_OFFSET {
    return this.props.pressRetentionOffset || PRESS_RETENTION_OFFSET;
  },

  touchableGetHitSlop: function(): ?Object {
    return this.props.hitSlop;
  },

  touchableGetHighlightDelayMS: function(): number {
    return this.props.delayPressIn || 0;
  },

  touchableGetLongPressDelayMS: function(): number {
    return this.props.delayLongPress === 0 ? 0 :
      this.props.delayLongPress || 500;
  },

  touchableGetPressOutDelayMS: function(): number {
    return this.props.delayPressOut || 0;
  },

  render: function(): React.Element<any> {
    // Note(avik): remove dynamic typecast once Flow has been upgraded
    // $FlowFixMe(>=0.41.0)
    const child = React.Children.only(this.props.children);
    let children = child.props.children;
    warning(
      !child.type || child.type.displayName !== 'Text',
      'TouchableWithoutFeedback does not work well with Text children. Wrap children in a View instead. See ' +
      ((child._owner && child._owner.getName && child._owner.getName()) || '<unknown>')
    );
    if (Touchable.TOUCH_TARGET_DEBUG && child.type && child.type.displayName === 'View') {
      children = React.Children.toArray(children);
      children.push(Touchable.renderDebugView({color: 'red', hitSlop: this.props.hitSlop}));
    }
    const style = (Touchable.TOUCH_TARGET_DEBUG && child.type && child.type.displayName === 'Text') ?
      [child.props.style, {color: 'red'}] :
      child.props.style;

    const overrides = {};
    for (const prop of OVERRIDE_PROPS) {
      if (this.props[prop] !== undefined) {
        overrides[prop] = this.props[prop];
      }
    }

    return (React: any).cloneElement(child, {
      ...overrides,
      accessible: this.props.accessible !== false,
      onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
      onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
      onResponderGrant: this.touchableHandleResponderGrant,
      onResponderMove: this.touchableHandleResponderMove,
      onResponderRelease: this.touchableHandleResponderRelease,
      onResponderTerminate: this.touchableHandleResponderTerminate,
      style,
      children,
    });
  }
}): any): React.ComponentType<Props>);

module.exports = TouchableWithoutFeedback;

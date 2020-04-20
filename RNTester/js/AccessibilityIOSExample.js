/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 * @providesModule AccessibilityIOSExample
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AccessibilityInfo,
  Text,
  View,
} = ReactNative;

const RNTesterBlock = require('./RNTesterBlock');

type Props = $ReadOnly<{||}>;
class AccessibilityIOSExample extends React.Component<Props> {
  render() {
    return (
      <RNTesterBlock title="Accessibility iOS APIs">
        <View
          onAccessibilityTap={() => alert('onAccessibilityTap success')}
          accessible={true}>
          <Text>
            Accessibility normal tap example
          </Text>
        </View>
        <View onMagicTap={() => alert('onMagicTap success')}
              accessible={true}>
          <Text>
            Accessibility magic tap example
          </Text>
        </View>
      </RNTesterBlock>
    );
  }
}

exports.title = 'AccessibilityIOS';
exports.description = 'iOS specific Accessibility APIs';
exports.examples = [
  {
    title: 'iOS Accessibility elements',
    render(): React.Element<any> {
      return <AccessibilityIOSExample />;
    },
  },
];

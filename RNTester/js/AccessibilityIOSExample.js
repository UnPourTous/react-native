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
  Text,
  View,
  Alert,
  TouchableWithoutFeedback
} = ReactNative;

const RNTesterBlock = require('./RNTesterBlock');

type Props = $ReadOnly<{||}>;
class AccessibilityIOSExample extends React.Component<Props> {
  render() {
    return (
      <RNTesterBlock title="Accessibility iOS APIs">
        <View style={{paddingVertical: 20, backgroundColor: 'red'}} accessible={true} accessibilityPenetrated={true}>
          <TouchableWithoutFeedback>
            <View style={{ paddingVertical: 20, backgroundColor: 'green'}}>
              <Text>First Inner Element</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback>
            <View style={{ paddingVertical: 20, marginTop: 20, backgroundColor: 'yellow'}}>
              <Text>Second Inner Element</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View
          onAccessibilityAction={event => {
            if (event.nativeEvent.actionName === 'activate') {
              Alert.alert('Alert', 'onAccessibilityTap success');
            }
          }}
          accessible={true}
          accessibilityActions={[{name: 'activate'}]}>
          <Text>
            Accessibility normal tap example
          </Text>
        </View>
        <View
          onAccessibilityAction={event => {
            if (event.nativeEvent.actionName === 'magicTap') {
              Alert.alert('Alert', 'onMagicTap success');
            }
          }}
          accessible={true}
          accessibilityActions={[{name: 'magicTap'}]}>
          <Text>
            Accessibility magic tap example
          </Text>
        </View>
        <View accessibilityElementsHidden={true}>
          <Text>
            This view's children are hidden from the accessibility tree
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

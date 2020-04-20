/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AccessibilityAndroidExample
 */
'use strict';

var React = require('react');
var ReactNative = require('react-native');
var {
  AccessibilityInfo,
  StyleSheet,
  Text,
  View,
  ToastAndroid,
  TouchableWithoutFeedback,
} = ReactNative;

var RNTesterBlock = require('./RNTesterBlock');
var RNTesterPage = require('./RNTesterPage');

var importantForAccessibilityValues = ['auto', 'yes', 'no', 'no-hide-descendants'];

class AccessibilityAndroidExample extends React.Component {
  state = {
    count: 0,
    backgroundImportantForAcc: 0,
    forgroundImportantForAcc: 0,
  };

  _addOne = () => {
    this.setState({
      count: ++this.state.count,
    });
  };

  _changeBackgroundImportantForAcc = () => {
    this.setState({
      backgroundImportantForAcc: (this.state.backgroundImportantForAcc + 1) % 4,
    });
  };

  _changeForgroundImportantForAcc = () => {
    this.setState({
      forgroundImportantForAcc: (this.state.forgroundImportantForAcc + 1) % 4,
    });
  };

  render() {
    return (
      <RNTesterPage title={'Accessibility Android APIs'}>
        <RNTesterBlock title="LiveRegion">
          <TouchableWithoutFeedback onPress={this._addOne}>
            <View style={styles.embedded}>
              <Text>Click me</Text>
            </View>
          </TouchableWithoutFeedback>
          <Text accessibilityLiveRegion="polite">
            Clicked {this.state.count} times
          </Text>
        </RNTesterBlock>

        <RNTesterBlock title="Overlapping views and importantForAccessibility property">
          <View style={styles.container}>
            <View
              style={{
                position: 'absolute',
                left: 10,
                top: 10,
                right: 10,
                height: 100,
                backgroundColor: 'green'}}
              accessible={true}
              accessibilityLabel="First layout"
              importantForAccessibility={
                importantForAccessibilityValues[this.state.backgroundImportantForAcc]}>
              <View accessible={true}>
                <Text style={{fontSize: 25}}>
                  Hello
                </Text>
              </View>
            </View>
            <View
              style={{
                position: 'absolute',
                left: 10,
                top: 25,
                right: 10,
                height: 110,
                backgroundColor: 'yellow', opacity: 0.5}}
              accessible={true}
              accessibilityLabel="Second layout"
              importantForAccessibility={
                importantForAccessibilityValues[this.state.forgroundImportantForAcc]}>
              <View accessible={true}>
                <Text style={{fontSize: 20}}>
                  world
                </Text>
              </View>
            </View>
          </View>
          <TouchableWithoutFeedback onPress={this._changeBackgroundImportantForAcc}>
            <View style={styles.embedded}>
              <Text>
                Change importantForAccessibility for background layout.
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View accessible={true}>
            <Text>
              Background layout importantForAccessibility
            </Text>
            <Text>
              {importantForAccessibilityValues[this.state.backgroundImportantForAcc]}
            </Text>
          </View>
          <TouchableWithoutFeedback onPress={this._changeForgroundImportantForAcc}>
            <View style={styles.embedded}>
              <Text>
                Change importantForAccessibility for forground layout.
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <View accessible={true}>
            <Text>
              Forground layout importantForAccessibility
            </Text>
            <Text>
              {importantForAccessibilityValues[this.state.forgroundImportantForAcc]}
            </Text>
          </View>
        </RNTesterBlock>

      </RNTesterPage>
    );
  }
}

var styles = StyleSheet.create({
   embedded: {
    backgroundColor: 'yellow',
    padding:10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    height:150,
  },
});

exports.title = 'AccessibilityAndroid';
exports.description = 'Android specific Accessibility APIs.';
exports.examples = [
  {
    title: 'Accessibility elements',
    render(): React.Element<typeof AccessibilityAndroidExample> {
      return <AccessibilityAndroidExample />;
    },
  },
];

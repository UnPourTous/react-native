/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "ParagraphProps.h"

#include <fabric/attributedstring/textValuesConversions.h>
#include <fabric/core/propsConversions.h>
#include <fabric/debug/DebugStringConvertibleItem.h>
#include <fabric/text/propsConversions.h>

namespace facebook {
namespace react {

void ParagraphProps::apply(const RawProps &rawProps) {
  ViewProps::apply(rawProps);
  BaseTextProps::apply(rawProps);

  // Paragraph Attributes
  applyRawProp(rawProps, "numberOfLines", paragraphAttributes_.maximumNumberOfLines);
  applyRawProp(rawProps, "ellipsizeMode", paragraphAttributes_.ellipsizeMode);
  applyRawProp(rawProps, "adjustsFontSizeToFit", paragraphAttributes_.adjustsFontSizeToFit);
  applyRawProp(rawProps, "minimumFontSize", paragraphAttributes_.minimumFontSize);
  applyRawProp(rawProps, "maximumFontSize", paragraphAttributes_.maximumFontSize);

  // Other Props
  applyRawProp(rawProps, "selectable", isSelectable_);
}

#pragma mark - Getters

ParagraphAttributes ParagraphProps::getParagraphAttributes() const {
  return paragraphAttributes_;
}

bool ParagraphProps::getIsSelectable() const {
  return isSelectable_;
}

#pragma mark - DebugStringConvertible

SharedDebugStringConvertibleList ParagraphProps::getDebugProps() const {
  SharedDebugStringConvertibleList list = {};

  // View Props
  auto &&viewPropsList = ViewProps::getDebugProps();
  std::move(viewPropsList.begin(), viewPropsList.end(), std::back_inserter(list));

  // Paragraph Props
  auto &&paragraphAttributePropsList = paragraphAttributes_.getDebugProps();
  std::move(paragraphAttributePropsList.begin(), paragraphAttributePropsList.end(), std::back_inserter(list));

  // Base Text Props
  auto &&baseTextPropsList = BaseTextProps::getDebugProps();
  std::move(baseTextPropsList.begin(), baseTextPropsList.end(), std::back_inserter(list));

  return list;
}

} // namespace react
} // namespace facebook

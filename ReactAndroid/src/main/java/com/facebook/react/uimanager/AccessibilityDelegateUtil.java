// Copyright (c) 2004-present, Facebook, Inc.

// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

package com.facebook.react.uimanager;

import android.annotation.TargetApi;
import android.os.Build;
import android.support.v4.view.AccessibilityDelegateCompat;
import android.support.v4.view.ViewCompat;
import android.support.v4.view.accessibility.AccessibilityNodeInfoCompat;
import android.view.View;
import android.view.accessibility.AccessibilityNodeInfo;
import com.facebook.react.bridge.ReadableArray;
import javax.annotation.Nullable;

/**
 * Utility class that handles the addition of a "role" for accessibility to either a View or
 * AccessibilityNodeInfo.
 */

public class AccessibilityDelegateUtil {

  /**
   * These roles are defined by Google's TalkBack screen reader, and this list should be kept up to
   * date with their implementation. Details can be seen in their source code here:
   *
   * <p>https://github.com/google/talkback/blob/master/utils/src/main/java/Role.java
   */

  public enum AccessibilityRole {
    NONE(null),
    BUTTON("android.widget.Button"),
    LINK("android.widget.Button"),
    SEARCH("android.widget.EditText"),
    IMAGE("android.widget.ImageView"),
    IMAGEBUTTON("android.widget.ImageView"),
    KEYBOARDKEY("android.inputmethodservice.Keyboard$Key"),
    TEXT("android.widget.ViewGroup"),
    ADJUSTABLE("android.widget.SeekBar"),
    SUMMARY("android.widget.ViewGroup"),
    HEADER("android.widget.ViewGroup");

    @Nullable private final String mValue;

    AccessibilityRole(String type) {
      mValue = type;
    }

    @Nullable
    public String getValue() {
      return mValue;
    }

    public static AccessibilityRole fromValue(String value) {
      for (AccessibilityRole role : AccessibilityRole.values()) {
        if (role.getValue() != null && role.getValue().equals(value)) {
          return role;
        }
      }
      return AccessibilityRole.NONE;
    }
  }

  private AccessibilityDelegateUtil() {
    // No instances
  }

  public static void setDelegate(final View view) {
    // if a view already has an accessibility delegate, replacing it could cause problems,
    // so leave it alone.
    if (!ViewCompat.hasAccessibilityDelegate(view)) {
      ViewCompat.setAccessibilityDelegate(
        view,
        new AccessibilityDelegateCompat() {
          @Override
          public void onInitializeAccessibilityNodeInfo(
            View host, AccessibilityNodeInfoCompat info) {
            super.onInitializeAccessibilityNodeInfo(host, info);
            AccessibilityRole accessibilityRole = getAccessibilityRole((String) view.getTag(R.id.accessibility_role));
            setRole(info, accessibilityRole, view.getContext());
          }
        });
    }
  }

  public static void setRole(AccessibilityNodeInfoCompat nodeInfo, final AccessibilityRole role) {
    nodeInfo.setClassName(role.getValue());
    if (role.equals(AccessibilityRole.LINK)) {
      nodeInfo.setRoleDescription("Link");
    }
    if (role.equals(AccessibilityRole.SEARCH)) {
      nodeInfo.setRoleDescription("Search Field");
    }
    if (role.equals(AccessibilityRole.IMAGE)) {
      nodeInfo.setRoleDescription("Image");
    }
    if (role.equals(AccessibilityRole.IMAGEBUTTON)) {
      nodeInfo.setRoleDescription("Button Image");
      nodeInfo.setClickable(true);
    }
    if (role.equals(AccessibilityRole.ADJUSTABLE)) {
      nodeInfo.setRoleDescription("Adjustable");
    }
  }

  /**
   * Method for setting accessibilityRole on view properties.
   */
  public static AccessibilityRole getAccessibilityRole(String role) {
    if (role == null) {
      return AccessibilityRole.NONE;
    }
    return AccessibilityRole.valueOf(role.toUpperCase());
  }
}

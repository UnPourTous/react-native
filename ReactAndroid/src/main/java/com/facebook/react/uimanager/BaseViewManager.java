// Copyright 2004-present Facebook. All Rights Reserved.

package com.facebook.react.uimanager;

import android.graphics.Color;
import android.text.TextUtils;
import android.os.Build;
import android.view.View;
import android.view.ViewParent;

import java.util.ArrayList;
import java.util.HashMap;

import com.facebook.react.R;
import com.facebook.react.bridge.Dynamic;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.ReactAccessibilityDelegate;
import com.facebook.react.uimanager.ReactAccessibilityDelegate.AccessibilityRole;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.uimanager.util.ReactFindViewUtil;
import java.util.Locale;

import javax.annotation.Nonnull;
import java.util.Map;
import javax.annotation.Nullable;

/**
 * Base class that should be suitable for the majority of subclasses of {@link ViewManager}.
 * It provides support for base view properties such as backgroundColor, opacity, etc.
 */
public abstract class BaseViewManager<T extends View, C extends LayoutShadowNode>
    extends ViewManager<T, C> {

  private static final String PROP_BACKGROUND_COLOR = ViewProps.BACKGROUND_COLOR;
  private static final String PROP_TRANSFORM = "transform";
  private static final String PROP_ELEVATION = "elevation";
  private static final String PROP_Z_INDEX = "zIndex";
  private static final String PROP_RENDER_TO_HARDWARE_TEXTURE = "renderToHardwareTextureAndroid";
  private static final String PROP_ACCESSIBILITY_LABEL = "accessibilityLabel";
  private static final String PROP_ACCESSIBILITY_LIVE_REGION = "accessibilityLiveRegion";
  private static final String PROP_ACCESSIBILITY_ROLE = "accessibilityRole";
  private static final String PROP_ACCESSIBILITY_STATES = "accessibilityStates";
  private static final String PROP_ACCESSIBILITY_STATE = "accessibilityState";
  private static final String PROP_ACCESSIBILITY_ACTIONS = "accessibilityActions";
  private static final String PROP_IMPORTANT_FOR_ACCESSIBILITY = "importantForAccessibility";

  // DEPRECATED
  private static final String PROP_ROTATION = "rotation";
  private static final String PROP_SCALE_X = "scaleX";
  private static final String PROP_SCALE_Y = "scaleY";
  private static final String PROP_TRANSLATE_X = "translateX";
  private static final String PROP_TRANSLATE_Y = "translateY";

  private static final int PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX = 2;
  private static final float CAMERA_DISTANCE_NORMALIZATION_MULTIPLIER = 5;

  /**
   * Used to locate views in end-to-end (UI) tests.
   */
  public static final String PROP_TEST_ID = "testID";
  public static final String PROP_NATIVE_ID = "nativeID";

  private static MatrixMathHelper.MatrixDecompositionContext sMatrixDecompositionContext =
      new MatrixMathHelper.MatrixDecompositionContext();
  private static double[] sTransformDecompositionArray = new double[16];

  public static final HashMap<String, Integer> sStateDescription = new HashMap<String, Integer>();
  static {
      sStateDescription.put("busy", R.string.state_busy_description);
      sStateDescription.put("expanded", R.string.state_expanded_description);
      sStateDescription.put("collapsed", R.string.state_collapsed_description);
  }

  // State definition constants -- must match the definition in
  // ViewAccessibility.js. These only include states for which there
  // is no native support in android.

  private static final String STATE_CHECKED = "checked"; // Special case for mixed state checkboxes
  private static final String STATE_BUSY = "busy";
  private static final String STATE_EXPANDED = "expanded";
  private static final String STATE_MIXED = "mixed";

  @ReactProp(name = PROP_BACKGROUND_COLOR, defaultInt = Color.TRANSPARENT, customType = "Color")
  public void setBackgroundColor(T view, int backgroundColor) {
    view.setBackgroundColor(backgroundColor);
  }

  @ReactProp(name = PROP_TRANSFORM)
  public void setTransform(T view, ReadableArray matrix) {
    if (matrix == null) {
      resetTransformProperty(view);
    } else {
      setTransformProperty(view, matrix);
    }
  }

  @ReactProp(name = ViewProps.OPACITY, defaultFloat = 1.f)
  public void setOpacity(T view, float opacity) {
    view.setAlpha(opacity);
  }

  @ReactProp(name = PROP_ELEVATION)
  public void setElevation(T view, float elevation) {
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
      view.setElevation(PixelUtil.toPixelFromDIP(elevation));
    }
    // Do nothing on API < 21
  }

  @ReactProp(name = PROP_Z_INDEX)
  public void setZIndex(T view, float zIndex) {
    int integerZIndex = Math.round(zIndex);
    ViewGroupManager.setViewZIndex(view, integerZIndex);
    ViewParent parent = view.getParent();
    if (parent != null && parent instanceof ReactZIndexedViewGroup) {
      ((ReactZIndexedViewGroup) parent).updateDrawingOrder();
    }
  }

  @ReactProp(name = PROP_RENDER_TO_HARDWARE_TEXTURE)
  public void setRenderToHardwareTexture(T view, boolean useHWTexture) {
    view.setLayerType(useHWTexture ? View.LAYER_TYPE_HARDWARE : View.LAYER_TYPE_NONE, null);
  }

  @ReactProp(name = PROP_TEST_ID)
  public void setTestId(T view, String testId) {
    view.setTag(R.id.react_test_id, testId);

    // temporarily set the tag and keyed tags to avoid end to end test regressions
    view.setTag(testId);
  }

  @ReactProp(name = PROP_NATIVE_ID)
  public void setNativeId(T view, String nativeId) {
    view.setTag(R.id.view_tag_native_id, nativeId);
    ReactFindViewUtil.notifyViewRendered(view);
  }

  @ReactProp(name = PROP_ACCESSIBILITY_LABEL)
  public void setAccessibilityLabel(T view, String accessibilityLabel) {
    view.setTag(R.id.accessibility_label, accessibilityLabel);
    updateViewContentDescription(view);
  }

  @ReactProp(name = PROP_ACCESSIBILITY_ROLE)
  public void setAccessibilityRole(T view, String accessibilityRole) {
    if (accessibilityRole == null) {
      return;
    }
    view.setTag(R.id.accessibility_role, AccessibilityRole.fromValue(accessibilityRole));
  }

  @ReactProp(name = PROP_ACCESSIBILITY_STATES)
  public void setViewStates(T view, ReadableArray accessibilityStates) {
    if (accessibilityStates == null) {
      return;
    }
    view.setTag(R.id.accessibility_states, accessibilityStates);
    view.setSelected(false);
    view.setEnabled(true);
    boolean shouldUpdateContentDescription = false;
    for (int i = 0; i < accessibilityStates.size(); i++) {
      String state = accessibilityStates.getString(i);
      if (sStateDescription.containsKey(state)) {
        shouldUpdateContentDescription = true;
      }
      if (state.equals("selected")) {
        view.setSelected(true);
      } else if (state.equals("disabled")) {
        view.setEnabled(false);
      }
    }
    if (shouldUpdateContentDescription) {
      updateViewContentDescription(view);
    }
  }

  @ReactProp(name = PROP_ACCESSIBILITY_STATE)
  public void setViewState(@Nonnull T view, @Nullable ReadableMap accessibilityState) {
    if (accessibilityState == null) {
      return;
    }
    view.setTag(R.id.accessibility_state, accessibilityState);
    view.setSelected(false);
    view.setEnabled(true);

    // For states which don't have corresponding methods in
    // AccessibilityNodeInfo, update the view's content description
    // here

    final ReadableMapKeySetIterator i = accessibilityState.keySetIterator();
    while (i.hasNextKey()) {
      final String state = i.nextKey();
      if (state.equals(STATE_BUSY) || state.equals(STATE_EXPANDED) ||
          (state.equals(STATE_CHECKED) && accessibilityState.getType(STATE_CHECKED) == ReadableType.String)) {
        updateViewContentDescription(view);
        break;
      }
    }
  }

  private void updateViewContentDescription(@Nonnull T view) {
    final String accessibilityLabel = (String) view.getTag(R.id.accessibility_label);
    final ReadableArray accessibilityStates = (ReadableArray) view.getTag(R.id.accessibility_states);
    final ReadableMap accessibilityState = (ReadableMap) view.getTag(R.id.accessibility_state);
    final ArrayList<String> contentDescription = new ArrayList<String>();
    if (accessibilityLabel != null) {
      contentDescription.add(accessibilityLabel);
    }
    if (accessibilityStates != null) {
      for (int i = 0; i < accessibilityStates.size(); i++) {
        final String state = accessibilityStates.getString(i);
        if (sStateDescription.containsKey(state)) {
          contentDescription.add(view.getContext().getString(sStateDescription.get(state)));
        }
      }
    }
    if (accessibilityState != null) {
      final ReadableMapKeySetIterator i = accessibilityState.keySetIterator();
      while (i.hasNextKey()) {
        final String state = i.nextKey();
        final Dynamic value = accessibilityState.getDynamic(state);
        if (state.equals(STATE_CHECKED) && value.getType() == ReadableType.String && value.asString().equals(STATE_MIXED)) {
          contentDescription.add(view.getContext().getString(R.string.state_mixed_description));
        } else if (state.equals(STATE_BUSY) && value.getType() == ReadableType.Boolean && value.asBoolean()) {
          contentDescription.add(view.getContext().getString(R.string.state_busy_description));
        } else if (state.equals(STATE_EXPANDED) && value.getType() == ReadableType.Boolean) {
          contentDescription.add(view.getContext().getString(value.asBoolean() ? R.string.state_expanded_description : R.string.state_collapsed_description));
        }
      }
    }
    if (contentDescription.size() > 0) {
      view.setContentDescription(TextUtils.join(", ", contentDescription));
    }
  }

  @ReactProp(name = PROP_ACCESSIBILITY_ACTIONS)
  public void setAccessibilityActions(T view, ReadableArray accessibilityActions) {
    if (accessibilityActions == null) {
      return;
    }

    view.setTag(R.id.accessibility_actions, accessibilityActions);
  }

  @ReactProp(name = PROP_IMPORTANT_FOR_ACCESSIBILITY)
  public void setImportantForAccessibility(T view, String importantForAccessibility) {
    if (importantForAccessibility == null || importantForAccessibility.equals("auto")) {
      view.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_AUTO);
    } else if (importantForAccessibility.equals("yes")) {
      view.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_YES);
    } else if (importantForAccessibility.equals("no")) {
      view.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO);
    } else if (importantForAccessibility.equals("no-hide-descendants")) {
      view.setImportantForAccessibility(View.IMPORTANT_FOR_ACCESSIBILITY_NO_HIDE_DESCENDANTS);
    }
  }

  @Deprecated
  @ReactProp(name = PROP_ROTATION)
  public void setRotation(T view, float rotation) {
    view.setRotation(rotation);
  }

  @Deprecated
  @ReactProp(name = PROP_SCALE_X, defaultFloat = 1f)
  public void setScaleX(T view, float scaleX) {
    view.setScaleX(scaleX);
  }

  @Deprecated
  @ReactProp(name = PROP_SCALE_Y, defaultFloat = 1f)
  public void setScaleY(T view, float scaleY) {
    view.setScaleY(scaleY);
  }

  @Deprecated
  @ReactProp(name = PROP_TRANSLATE_X, defaultFloat = 0f)
  public void setTranslateX(T view, float translateX) {
    view.setTranslationX(PixelUtil.toPixelFromDIP(translateX));
  }

  @Deprecated
  @ReactProp(name = PROP_TRANSLATE_Y, defaultFloat = 0f)
  public void setTranslateY(T view, float translateY) {
    view.setTranslationY(PixelUtil.toPixelFromDIP(translateY));
  }

  @ReactProp(name = PROP_ACCESSIBILITY_LIVE_REGION)
  public void setAccessibilityLiveRegion(T view, String liveRegion) {
    if (Build.VERSION.SDK_INT >= 19) {
      if (liveRegion == null || liveRegion.equals("none")) {
        view.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_NONE);
      } else if (liveRegion.equals("polite")) {
        view.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_POLITE);
      } else if (liveRegion.equals("assertive")) {
        view.setAccessibilityLiveRegion(View.ACCESSIBILITY_LIVE_REGION_ASSERTIVE);
      }
    }
  }

  private static void setTransformProperty(View view, ReadableArray transforms) {
    TransformHelper.processTransform(transforms, sTransformDecompositionArray);
    MatrixMathHelper.decomposeMatrix(sTransformDecompositionArray, sMatrixDecompositionContext);
    view.setTranslationX(
        PixelUtil.toPixelFromDIP((float) sMatrixDecompositionContext.translation[0]));
    view.setTranslationY(
        PixelUtil.toPixelFromDIP((float) sMatrixDecompositionContext.translation[1]));
    view.setRotation((float) sMatrixDecompositionContext.rotationDegrees[2]);
    view.setRotationX((float) sMatrixDecompositionContext.rotationDegrees[0]);
    view.setRotationY((float) sMatrixDecompositionContext.rotationDegrees[1]);
    view.setScaleX((float) sMatrixDecompositionContext.scale[0]);
    view.setScaleY((float) sMatrixDecompositionContext.scale[1]);

    double[] perspectiveArray = sMatrixDecompositionContext.perspective;

    if (perspectiveArray.length > PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX) {
      float invertedCameraDistance = (float) perspectiveArray[PERSPECTIVE_ARRAY_INVERTED_CAMERA_DISTANCE_INDEX];
      if (invertedCameraDistance == 0) {
        // Default camera distance, before scale multiplier (1280)
        invertedCameraDistance = 0.00078125f;
      }
      float cameraDistance = -1 / invertedCameraDistance;
      float scale = DisplayMetricsHolder.getScreenDisplayMetrics().density;

      // The following converts the matrix's perspective to a camera distance
      // such that the camera perspective looks the same on Android and iOS
      float normalizedCameraDistance = scale * cameraDistance * CAMERA_DISTANCE_NORMALIZATION_MULTIPLIER;
      view.setCameraDistance(normalizedCameraDistance);

    }
  }

  private static void resetTransformProperty(View view) {
    view.setTranslationX(PixelUtil.toPixelFromDIP(0));
    view.setTranslationY(PixelUtil.toPixelFromDIP(0));
    view.setRotation(0);
    view.setRotationX(0);
    view.setRotationY(0);
    view.setScaleX(1);
    view.setScaleY(1);
    view.setCameraDistance(0);
  }

  private void updateViewAccessibility(@Nonnull T view) {
    ReactAccessibilityDelegate.setDelegate(view);
  }

  @Override
  protected void onAfterUpdateTransaction(@Nonnull T view) {
    super.onAfterUpdateTransaction(view);
    updateViewAccessibility(view);
  }

  @Override
  public @Nullable Map<String, Object> getExportedCustomDirectEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
          .put("performAction", MapBuilder.of("registrationName", "onAccessibilityAction"))
          .build();
  }
}

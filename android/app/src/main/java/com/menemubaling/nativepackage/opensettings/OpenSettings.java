package com.menemubaling.nativepackage.opensettings;

import android.content.Intent;
import android.provider.Settings;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.Map;
import java.util.HashMap;

public class OpenSettings extends ReactContextBaseJavaModule {
	private static final String DURATION = "SHORT";
	private ReactContext reactContext;

	public OpenSettings(ReactApplicationContext context) {
		super(context);
		this.reactContext = context;
	}

	@Override
	public String getName() {
		return "RNSettings";
	}

	@ReactMethod
	public void openAccessBility() {
		final Intent i = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
		reactContext.startActivity(i);
	}
}
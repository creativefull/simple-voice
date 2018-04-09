package com.menemubaling;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.rnfs.RNFSPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.wenkesj.voice.VoicePackage;
import com.rpt.reactnativecheckpackageinstallation.CheckPackageInstallationPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.wix.reactnativekeyboardinput.KeyboardInputPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNFSPackage(),
            new KeyboardInputPackage(MainApplication.this, true),
            new WebViewBridgePackage(),
            new VoicePackage(),
            new CheckPackageInstallationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}

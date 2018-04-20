package com.menemubaling;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.imagepicker.ImagePickerPackage;
import io.rumors.reactnativesettings.RNSettingsPackage;
import cl.json.RNSharePackage;
import net.no_mad.tts.TextToSpeechPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.wix.autogrowtextinput.AutoGrowTextInputPackage;
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
import cl.json.ShareApplication;

public class MainApplication extends Application implements ShareApplication, ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new ImagePickerPackage(),
            new RNSettingsPackage(),
            new RNSharePackage(),
            new TextToSpeechPackage(),
            new BlurViewPackage(),
            new AutoGrowTextInputPackage(),
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

  @Override
  public String getFileProviderAuthority() {
    return "com.menemubaling.provider";
  }
}

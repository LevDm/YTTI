
YTAT\android\app\src\main\res\mipmap-...
replace
all icons, splash  .png
============================================================================================================
YTAT\android\app\src\main\res\values\strings.xml
replace ??????????
<string name="expo_splash_screen_status_bar_translucent" translatable="false">true</string>
============================================================================================================
YTAT\android\app\src\main\AndroidManifest.xml
add
<activity android:name=".MainApplication" 
    android:resizeableActivity="false"
/>

delete
<application
    ...
    android:roundIcon="@mipmap/ic_launcher_round"
    ...
>
</application>
============================================================================================================
YTAT\android\app\src\main\res\mipmap-anydpi-v26\ic_launcher.xml
add
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    ...mipmap/
    <monochrome android:drawable="@drawable/ic_launcher_monochrome"/>
</adaptive-icon>
============================================================================================================
C:\Users\ADMIN\YTAT\android\app\src\main\res\drawable\splashscreen.xml
add
...
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  ...
  <item>
    <bitmap android:gravity="center" android:src="@drawable/splashscreen_image"/>
  </item>
</layer-list>
============================================================================================================
YTAT\android\app\src\main\res\values\styles.xml
add
<style name="Theme.App.SplashScreen" parent="AppTheme">
    ...
    <item name="android:windowIsTranslucent">true</item>
</style>
add
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
  ...
  <item name="android:colorEdgeEffect">#606060</item>
<style>
============================================================================================================
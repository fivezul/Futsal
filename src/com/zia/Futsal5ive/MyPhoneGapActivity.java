package com.zia.Futsal5ive;

import org.apache.cordova.Config;
import org.apache.cordova.DroidGap;
import android.os.Bundle;

public class MyPhoneGapActivity extends DroidGap {
	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		super.setIntegerProperty("splashscreen", R.drawable.m74byg);
		super.loadUrl(Config.getStartUrl(), 10000);
		super.loadUrl("file:///android_asset/www/index.html");
	}
}

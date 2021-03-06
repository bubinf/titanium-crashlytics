/**
 * This file was auto-generated by the Titanium Module SDK helper for Android
 * Appcelerator Titanium Mobile
 * Copyright (c) 2009-2017 by Appcelerator, Inc. All Rights Reserved.
 * Licensed under the terms of the Apache Public License
 * Please see the LICENSE included with this distribution for details.
 *
 */
package ti.crashlytics;

import org.appcelerator.kroll.KrollModule;
import org.appcelerator.kroll.annotations.Kroll;

import org.appcelerator.kroll.common.TiConfig;
import org.appcelerator.titanium.TiApplication;

import android.app.Activity;

import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;

@Kroll.module(name="TitaniumCrashlytics", id="ti.crashlytics")
public class TitaniumCrashlyticsModule extends KrollModule
{

	// Standard Debugging variables

	private static final String LCAT = "TitaniumCrashlyticsModule";
	private static final boolean DBG = TiConfig.LOGD;

	public TitaniumCrashlyticsModule()
	{
		super();
	}

	@Kroll.method
    public void init() {
		Fabric.with(TiApplication.getAppRootOrCurrentActivity(), new Crashlytics());
	}

	// Methods

	@Kroll.method
	public void crash()
	{
		Crashlytics.getInstance().crash();
	}

	@Kroll.method
	public void log(String message)
	{
		Crashlytics.log(message);
	}

	@Kroll.method
	public void throwException()
	{
		try {
			throw new RuntimeException("This is a crash");
		} catch (RuntimeException e) {
			Crashlytics.logException(e);
		}
	}

	@Kroll.method
	public void throwCustomException(String message, String myline, String sourceNameAndroid, String lineSource, String javascriptStack)
	{
		Log.d(message);
		Throwable barT = new Throwable(message);
		String[] lines = javascriptStack.split("\\r?\\n");
		int count = 0;
		StackTraceElement[] stackTarray = new StackTraceElement[lines.length];

	   	for (String lineStack : lines) {

		   	StackTraceElement stackNew = new StackTraceElement(sourceNameAndroid, lineStack, lineSource,  Integer.parseInt(myline));
		   	stackTarray[count] = stackNew;

	   	}

		barT.setStackTrace(stackTarray);

		try {
			throw new RuntimeException(message, barT);
		} catch (RuntimeException e) {
			Crashlytics.logException(e);
		}
	}

	@Kroll.setProperty
	public void setUserIdentifier(String userIdentifier) {
		Crashlytics.setUserIdentifier(userIdentifier);
	}

	@Kroll.setProperty
	public void setUserName(String userName) {
		Crashlytics.setUserName(userName);
	}

	@Kroll.setProperty
	public void setUserEmail(String userEmail) {
		Crashlytics.setUserEmail(userEmail);
	}
}

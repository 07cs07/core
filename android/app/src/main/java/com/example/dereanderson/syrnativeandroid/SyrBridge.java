package com.example.dereanderson.syrnativeandroid;

import android.annotation.SuppressLint;
import android.content.Context;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.lang.reflect.Array;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;

/**
 * Syr Project
 * https://syr.js.org
 * Created by Derek Anderson on 1/8/18.
 */


public class SyrBridge {

    public SyrRaster mRaster;
    public HashMap<String, String> bootParams = new HashMap<String,String>();

    static private Handler uiHandler = new Handler(Looper.getMainLooper());
    private Context mContext;
    private WebView mBridgedBrowser;
    private HandlerThread thread = new HandlerThread("SyrWebViewThread");
    private Handler webViewHandler;

    /** Instantiate the interface and set the context */
    SyrBridge(Context c) { mContext = c; }

    public void setRaster(SyrRaster raster) {
        mRaster = raster;
    }

    /** Recieve message from the SyrBridge */
    @JavascriptInterface
    public void message(String message) {
        try {
            JSONObject jsonObject = new JSONObject(message);
            String messageType = jsonObject.getString("type");

            if(messageType.equals("gui")) {
                mRaster.parseAST(jsonObject);
            } else if(messageType.equals("animation")) {
                mRaster.setupAnimation(jsonObject);
            }

        } catch (Throwable tx) {
            tx.printStackTrace();
        }
    }

    public void loadBundle() {

        thread.start();
        webViewHandler = new Handler(thread.getLooper());

        final SyrBridge self = this;
        webViewHandler.post(new Runnable() {
            @SuppressLint("JavascriptInterface")
            @Override
            public void run() {
                mBridgedBrowser = new WebView(mContext);
                mBridgedBrowser.addJavascriptInterface(self, "SyrBridge");

                // if the url is changes from it's initial loadURL then cancel
                mBridgedBrowser.setWebViewClient(new WebViewClient(){
                    public boolean shouldOverrideUrlLoading(WebView view, String url) {
                        Log.i("bridgebrowser", "navigating");
                        mRaster.clearRootView();
                        return false;
                    }
                });

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
                    WebView.setWebContentsDebuggingEnabled(true);
                }

                WebSettings webSettings = mBridgedBrowser.getSettings();
                webSettings.setJavaScriptEnabled(true);

                JSONArray jsArray = new JSONArray(mRaster.exportedMethods);
                String exportedMethods = jsArray.toString();
                String exportedMethodString = null;

                try {
                    exportedMethodString = URLEncoder.encode(exportedMethods, "UTF-8");
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }

                String screenDensity = Float.toString(mContext.getResources().getDisplayMetrics().density);
                String loadURL = String.format("http://10.0.2.2:8080?window_height=%s&window_width=%s&screen_density=%s&platform=android&platform_version=%s&exported_methods=%s",
                        bootParams.get("height"),
                        bootParams.get("width"),
                        screenDensity,
                        Build.VERSION.SDK_INT,
                        exportedMethodString);

                mBridgedBrowser.loadUrl(loadURL);

            }
        });
    }

    public void sendEvent(HashMap<String, String> event) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            JSONObject message = new JSONObject(event);
            sendImmediate(message);
        }
    }

    public void sendImmediate(JSONObject message) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            String msg = message.toString();
            final String eventJS = String.format("SyrEvents.emit(%s);", msg);
            webViewHandler.post(new Runnable() {
                @SuppressLint("JavascriptInterface")
                @Override
                public void run() {
                    mBridgedBrowser.evaluateJavascript(eventJS, null);
                }
            });
        }
    }
}

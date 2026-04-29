package com.stepquest.app;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

public class MainActivity extends Activity implements SensorEventListener {
    private static final int REQUEST_ACTIVITY_RECOGNITION = 42;
    private static final String GAME_URL = "https://step-quest-503q.onrender.com/";

    private WebView webView;
    private SensorManager sensorManager;
    private Sensor stepCounter;
    private float lastCounter = -1;
    private boolean listening = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        sensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
        if (sensorManager != null) {
            stepCounter = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        }

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);

        webView.addJavascriptInterface(new StepBridge(), "AndroidStepQuest");
        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                injectNativeReady();
            }
        });
        webView.loadUrl(GAME_URL);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (listening) {
            startStepCounter();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (sensorManager != null) {
            sensorManager.unregisterListener(this);
        }
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != Sensor.TYPE_STEP_COUNTER) return;

        float current = event.values[0];
        if (lastCounter < 0) {
            lastCounter = current;
            sendStatus("Sensor nativo pronto. Caminhe normalmente.");
            return;
        }

        int delta = Math.round(current - lastCounter);
        lastCounter = current;

        if (delta > 0 && delta <= 20) {
            sendNativeSteps(delta, Math.round(current));
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {
    }

    private boolean hasActivityPermission() {
        return Build.VERSION.SDK_INT < Build.VERSION_CODES.Q ||
            checkSelfPermission(Manifest.permission.ACTIVITY_RECOGNITION) == PackageManager.PERMISSION_GRANTED;
    }

    private void requestActivityPermission() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            requestPermissions(new String[] { Manifest.permission.ACTIVITY_RECOGNITION }, REQUEST_ACTIVITY_RECOGNITION);
        }
    }

    private void startStepCounter() {
        if (stepCounter == null || sensorManager == null) {
            sendStatus("Este celular nao possui sensor nativo de passos.");
            return;
        }

        if (!hasActivityPermission()) {
            requestActivityPermission();
            return;
        }

        listening = true;
        sensorManager.unregisterListener(this);
        boolean ok = sensorManager.registerListener(this, stepCounter, SensorManager.SENSOR_DELAY_NORMAL);
        sendStatus(ok ? "Sensor nativo iniciado. Caminhe com o celular." : "Nao consegui iniciar o sensor nativo.");
    }

    private void sendNativeSteps(int delta, int rawTotal) {
        final String js =
            "window.StepQuestNativeSteps && window.StepQuestNativeSteps.addSteps(" + delta + "," + rawTotal + ");";
        webView.post(() -> webView.evaluateJavascript(js, null));
    }

    private void sendStatus(String text) {
        final String safe = text.replace("\\", "\\\\").replace("'", "\\'");
        final String js =
            "window.StepQuestNativeSteps && window.StepQuestNativeSteps.setStatus('" + safe + "');";
        webView.post(() -> webView.evaluateJavascript(js, null));
    }

    private void injectNativeReady() {
        final String js =
            "window.__STEP_QUEST_ANDROID__ = true;" +
            "window.dispatchEvent(new CustomEvent('native-pedometer-ready'));";
        webView.post(() -> webView.evaluateJavascript(js, null));
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQUEST_ACTIVITY_RECOGNITION) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                startStepCounter();
            } else {
                sendStatus("Permissao de atividade fisica negada.");
            }
        }
    }

    public class StepBridge {
        @JavascriptInterface
        public void startStepCounter() {
            runOnUiThread(MainActivity.this::startStepCounter);
        }

        @JavascriptInterface
        public boolean hasNativeStepCounter() {
            return stepCounter != null;
        }
    }
}

package com.electra_app_user;

import android.app.Activity;
import android.content.Intent;
import android.speech.RecognizerIntent;
import android.speech.tts.TextToSpeech;
import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.util.ArrayList;
import java.util.Locale;

public class SpeechModule extends ReactContextBaseJavaModule {
    private static final int SPEECH_REQUEST_CODE = 1001;
    private Promise speechPromise;
    private TextToSpeech tts;
    private ReactApplicationContext reactContext;

    private final ActivityEventListener activityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
            if (requestCode == SPEECH_REQUEST_CODE) {
                if (resultCode == Activity.RESULT_OK && data != null) {
                    ArrayList<String> results = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                    if (results != null && !results.isEmpty() && speechPromise != null) {
                        speechPromise.resolve(results.get(0));
                        speechPromise = null;
                    }
                } else {
                    if (speechPromise != null) {
                        speechPromise.reject("CANCELLED", "Reconhecimento cancelado");
                        speechPromise = null;
                    }
                }
            }
        }
    };

    public SpeechModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        context.addActivityEventListener(activityEventListener);

        tts = new TextToSpeech(context, status -> {
            if (status == TextToSpeech.SUCCESS) {
                tts.setLanguage(new Locale("pt", "BR"));
                tts.setSpeechRate(0.9f);
                tts.setPitch(1.1f);
            }
        });
    }

    @NonNull
    @Override
    public String getName() {
        return "SpeechModule";
    }

    @ReactMethod
    public void startListening(Promise promise) {
        Activity activity = getCurrentActivity();
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Activity não encontrada");
            return;
        }
        speechPromise = promise;
        Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "pt-BR");
        intent.putExtra(RecognizerIntent.EXTRA_PROMPT, "Fale com a ELECTRA...");
        intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);
        activity.startActivityForResult(intent, SPEECH_REQUEST_CODE);
    }

    @ReactMethod
    public void speak(String text, Promise promise) {
        if (tts != null) {
            tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "electra_tts");
            promise.resolve(true);
        } else {
            promise.reject("TTS_ERROR", "TTS não inicializado");
        }
    }

    @ReactMethod
    public void stop(Promise promise) {
        if (tts != null) tts.stop();
        promise.resolve(true);
    }
}

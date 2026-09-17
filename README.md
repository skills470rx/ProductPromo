# ProductPromo V5 Android

Native Android application for creating vertical product promo videos offline.

## Build

```bash
gradle :app:assembleDebug
```

Debug APK: `app/build/outputs/apk/debug/app-debug.apk`

## Export pipeline

- Native Java UI; no WebView.
- `MediaCodec` encodes the 720x1280, 30 fps video as H.264/AVC using a surface input.
- `MediaCodec` encodes AAC-LC audio, and `MediaMuxer` writes both tracks into a real MP4 container.
- AAC/M4A music tracks are passed through with `MediaExtractor`; MP3 and other audio codecs are decoded with `MediaExtractor` + `MediaCodec` and re-encoded as AAC-LC before muxing.
- The completed file is inserted into `MediaStore` under `Movies/ProductPromo` and shared with the Android Share Sheet.
- Rendering runs offline, reports progress, and can be cancelled.

The original HTML/CSS/JavaScript prototype is preserved in [`web-prototype/`](web-prototype/).
It is reference material only and is not used by the Android app. The final encoder does not use browser `MediaRecorder` and does not rename WebM files to MP4.
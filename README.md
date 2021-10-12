# Mic bug in Snapchat with multiple outputs

This repository is for a bug report with Snapchat as of Tuesday, October
12, 2021. The problem is as follows:

-   Suppose you want multiple Audio Output assets in order to
    enqueue multiple `Float32Array`s at different positions in 3D space. Using
    spatial audio, this makes it possible to explore sound by physically moving.
    This works in Lens Studio's simulator, but it does not work on mobile or
    Spectacles (2021).
-   If there is only one Audio Output asset used in the lens, the Audio from
    Microphone asset works as desired.
-   If there are two or more Audio Output assets used in the lens, the Audio
    from Microphone asset malfunctions. Specifically, calling
    `getAudioFrame()` returns a vector with `x = 0`, indicating no audio
    was received from the mic. The mic should not depend on the number of
    output assets, but for some reason, this problem only occurs in this
    circumstance.

This repository makes it possible to reproduce this bug. In
`Public/MicController.js`, whenever the user taps the screen, a recording
begins and the following _should_ be logged:

```
[MicController.js:25] Locked recording
[MicController.js:58] Tapped screen, starting mic
[MicController.js:34] Got audio frame with shape: X
...
[MicController.js:34] Got audio frame with shape: X
[MicController.js:55] Done recording
[MicController.js:45] Unlocked recording
```

Unfortunately, the output above is only produced in the Lens Studio simulator.
On an iPhone 7 and an iPad Pro 12.9", the following gets logged in the debug
tools:

```
[MicController.js:25] Locked recording
[MicController.js:58] Tapped screen, starting mic
```

## Running

1. Open `snap-bug-mic.lsproj` in Lens Studio.
2. Send to Snapchat and run on a phone. Logs show the incorrect log
   described above.

## Fixing the script

Interestingly, it is possible to make the mic work on mobile by making a
simple change:

1. Open `snap-bug-mic.lsproj` in Lens Studio.
2. Click `MicController` in the Objects pane.
3. Change `Output 2` to `Audio Output` to match `Output 1`.
4. Send to Snapchat and run on a phone. Logs show the full correct log
   described above.

Unfortunately, this fix is not really a fix because the whole point of this
report is to show that we cannot use multiple outputs.

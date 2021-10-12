// -----JS CODE-----
// @input Asset.AudioTrackAsset audioInput
// @input Asset.AudioTrackAsset Output1
// @input Asset.AudioTrackAsset Output2
// @input int sampleRate = 44100

var mic = script.audioInput.control;
if (!mic.isOfType("Provider.MicrophoneAudioProvider")) {
    print("Warning: LoopController does not have a mic provider");
}

mic.start();
mic.sampleRate = script.sampleRate;
var isRecording = false;

var tempFrame = new Float32Array(mic.maxFrameSize);

// Returns whether recording has successfully begun.
// Will return false if something is already recording.
// time should be in seconds
// onEnd should be a callback function
var record = function(time, onEnd) {
    if (isRecording) return false;
    isRecording = true;
    print("Locked recording");

    var recording = new Float32Array(Math.floor(script.sampleRate * time));
    var recordingLength = 0;

    var updateEvent = script.createEvent("UpdateEvent");

    updateEvent.bind(function(eventData) {
        var shape = mic.getAudioFrame(tempFrame);
        if (shape.x > 0) print("Got audio frame with shape: " + shape.x)
        var i = 0;
        while (i < shape.x && recordingLength < recording.length) {
            recording[recordingLength++] = tempFrame[i++];
        }
        
        if (recordingLength === recording.length) {
            // Load the track appropriately
            script.removeEvent(updateEvent);
            onEnd(recording);
            isRecording = false;
            print("Unlocked recording");
        }
    });

    // Indicate that it is recording
    return true;
};

script.createEvent("TapEvent").bind(function() {
    var started = record(1, function() {
        print("Done recording");
    });
    
    if (started) print("Tapped screen, starting mic");
    else print("Tapped screen, recording is already in progress");
});
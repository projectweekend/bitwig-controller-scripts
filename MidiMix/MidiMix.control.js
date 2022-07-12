loadAPI(17);

const MANUFAC = "Akai";
const NAME = "MidiMix";
const SCRIPT_VER = "0.1";
const SCRIPT_ID = "09fd3aa5-38d4-4383-9937-b51e7837f730";
const SCRIPT_AUTH = "clownshoes";
const TRACK_COUNT = 8;
const SEND_COUNT = 2;
const MASTER_SLIDER_MIDI_CHAN = 8;
const TRACK_LEVEL_CC = 7;
const TRACK_PAN_CC = 10;
const TRACK_FX1_CC = 85;
const TRACK_FX2_CC = 86;
const TRACK_REC_ARM_CC = 89;
const TRACK_MUTE_CC = 87;
const TRACK_SOLO_CC = 88;
const CC_MAX_VALUE = 127;

host.setShouldFailOnDeprecatedUse(true);
host.defineController(MANUFAC, NAME, SCRIPT_VER, SCRIPT_ID, SCRIPT_AUTH);
host.defineMidiPorts(1,0);


function initMainTrackControls(hardwareSurface, midiIn, mainTrackBank) {
   for (let i = 0; i < TRACK_COUNT; i++) {
      var track = mainTrackBank.getItemAt(i);
      var trackSendBank = track.sendBank();

      var slider = hardwareSurface.createHardwareSlider("Slider for track " + i);
      slider.setAdjustValueMatcher(midiIn.createAbsoluteCCValueMatcher(i, TRACK_LEVEL_CC));
      track.volume().addBinding(slider);

      var panKnob = hardwareSurface.createAbsoluteHardwareKnob("Pan knob for track " + i);
      panKnob.setAdjustValueMatcher(midiIn.createAbsoluteCCValueMatcher(i, TRACK_PAN_CC));
      track.pan().addBinding(panKnob);

      var fx1Knob = hardwareSurface.createAbsoluteHardwareKnob("FX1 knob for track " + i);
      fx1Knob.setAdjustValueMatcher(midiIn.createAbsoluteCCValueMatcher(i, TRACK_FX1_CC));
      trackSendBank.getItemAt(0).addBinding(fx1Knob);

      var fx2Knob = hardwareSurface.createAbsoluteHardwareKnob("FX2 knob for track " + i);
      fx2Knob.setAdjustValueMatcher(midiIn.createAbsoluteCCValueMatcher(i, TRACK_FX2_CC));
      trackSendBank.getItemAt(1).addBinding(fx2Knob);

      var recArmButton = hardwareSurface.createHardwareButton("Rec arm button for track " + i);
      recArmButton.pressedAction().setActionMatcher(midiIn.createCCActionMatcher(i, TRACK_REC_ARM_CC, CC_MAX_VALUE));
      track.arm().toggleAction().addBinding(recArmButton.pressedAction());

      var muteButton = hardwareSurface.createHardwareButton("Mute button for track " + i);
      muteButton.pressedAction().setActionMatcher(midiIn.createCCActionMatcher(i, TRACK_MUTE_CC, CC_MAX_VALUE));
      track.mute().toggleAction().addBinding(muteButton.pressedAction());

      var soloButton = hardwareSurface.createHardwareButton("Solo button for track " + i);
      soloButton.pressedAction().setActionMatcher(midiIn.createCCActionMatcher(i, TRACK_SOLO_CC, CC_MAX_VALUE));
      track.solo().toggleAction().addBinding(soloButton.pressedAction());
   }   
}

function initMasterTrackLevelSlider(hardwareSurface, midiIn) {
   var slider = hardwareSurface.createHardwareSlider("slider" + MASTER_SLIDER_MIDI_CHAN);
   slider.setAdjustValueMatcher(midiIn.createAbsoluteCCValueMatcher(MASTER_SLIDER_MIDI_CHAN, 7));
   var masterTrack = host.createMasterTrack(TRACK_COUNT);
   masterTrack.volume().addBinding(slider);
}


function init() {
   println("MidiMix initialized!");
   var mainTrackBank = host.createMainTrackBank(TRACK_COUNT, SEND_COUNT, TRACK_COUNT);
   var midiIn = host.getMidiInPort(0);
   var midiMix = host.createHardwareSurface();

   // midiIn.setMidiCallback(midiMessageCallback);
   initMainTrackControls(midiMix, midiIn, mainTrackBank);
   initMasterTrackLevelSlider(midiMix, midiIn);
}


// function midiMessageCallback(statusByte, data1, data2) {
//    printMidi(statusByte, data1, data2);
//    println("Midi Channel: " + MIDIChannel(statusByte));   
// }


function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}
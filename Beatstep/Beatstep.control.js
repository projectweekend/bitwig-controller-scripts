loadAPI(17);
load("constants.js");
load("../core.js");


// Remove this if you want to be able to use deprecated methods without causing script to stop.
// This is useful during development.
host.setShouldFailOnDeprecatedUse(true);

host.defineController("Arturia", "Beatstep", "0.1", "f32783f3-2ab7-4d84-86b4-e748297de1e0", "clownshoes");

host.defineMidiPorts(1, 0);


function init() {
   var midiIn = host.getMidiInPort(0);
   var hdwSurface = host.createHardwareSurface();

   var keys = hdwSurface.createPianoKeyboard("Beatstep Pads", 16, 0, 0);
   keys.setMidiIn(midiIn);
   keys.setNoteInput(midiIn.createNoteInput("Beatstep Pads", null));   

   var bindCtrlBtn = btnPressedActionBinder(hdwSurface, midiIn, CTRL_MIDI_CHAN, "Btn");
   var bindCtrlKnob = relativeKnobActionBinder(hdwSurface, midiIn, CTRL_MIDI_CHAN, "Knob");
   
   var transport = host.createTransport();
   var cursorTrack = host.createCursorTrack(CURSOR_TRACK_NAME, CURSOR_TRACK_NAME, 3, 0, true);
   var cursorTrackSendBank = cursorTrack.sendBank();

   var cursorDevice = cursorTrack.createCursorDevice();
   cursorDevice.position().addValueObserver((val) => {
      cursorDevice.isRemoteControlsSectionVisible().set(true);
   });
   
   var cursorRemoteCtrlsPage = cursorDevice.createCursorRemoteControlsPage(REMOTE_PARAMETER_COUNT);

   bindCtrlBtn(3, transport.stopAction());
   bindCtrlKnob(7, cursorTrack.volume());
   bindCtrlBtn(9, transport.playAction());
   bindCtrlKnob(10, cursorTrack.pan());
   bindCtrlKnob(11, cursorTrackSendBank.getItemAt(0));
   bindCtrlKnob(12, cursorTrackSendBank.getItemAt(1));
   bindCtrlKnob(13, cursorTrackSendBank.getItemAt(2));   
   bindCtrlKnob(60, cursorTrack);
   bindCtrlKnob(61, cursorDevice);
   bindCtrlKnob(62, cursorRemoteCtrlsPage);
   [52, 53, 54, 55, 56, 57, 58, 59].forEach((cc, idx) => {
      var param = cursorRemoteCtrlsPage.getParameter(idx);
      param.setIndication(true);      
      bindCtrlKnob(cc, param);
   });   

   host.getMidiInPort(0).setMidiCallback((status, data1, data2) => {
      var midiChanNum = MIDIChannel(status);
      var message = "MIDI CHAN: " + midiChanNum + " CC:" + data1 + " VAL:" + data2;
      println(message);
   });

   // 0 - editing
   // 1 - project
   // 2 - panel mgmt
   // 3 - zooming
   // 4 - note editor
   // 5 - arranger
   // 6 - multi-sample
   // 7 - general and useful actions
   // 8 - help
   // 9 - 
   // 10 - navigation
   // 11 - file
   // 12 - selection
   // 13 - comping
   // 14 - text editing
   // 15 - browser
   // 16 - mixer 
   // 17 - window mgmt
   // 18 - detail editor
   // 19 - clip launcher 
   // var app = host.createApplication();
   // printActionsForCategory(7, app);
   // printActionsForCategory(8, app);
   println("Beatstep initialized!");
}

function flush() {
   // TODO: Flush any output to your controller here.
}

function exit() {

}
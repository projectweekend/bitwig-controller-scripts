function printActionsForCategory(categoryNum, app) {
    var actionCategories = app.getActionCategories();
    const actionCat = actionCategories[categoryNum];
    println("---------");
    println(actionCat.getId() + "-" + actionCat.getName());
    println("---------");
    var actions = actionCat.getActions();
    for (let n = 0; n < actions.length; n++) {
       const action = actions[n];
       const message = n + " ID: " + action.getId() + " TEXT: " + action.getMenuItemText();
       println(message);
    }
 }
 
 
 function btnPressedActionBinder(hdwSurface, midiIn, midiChanNum, identSuffix) {
    var ident = 0;
    return (cc, bindableAction) => {
       var id = "btn_" + ident + "_" + cc + "_" + identSuffix;
       var btn = hdwSurface.createHardwareButton(id);
       btn.pressedAction().setActionMatcher(midiIn.createCCActionMatcher(midiChanNum, cc, BUTTON_PRESSED_VAL));
       bindableAction.addBinding(btn.pressedAction());
       ident += 1;
       return btn;
    };
 }
 
 
 function relativeKnobActionBinder(hdwSurface, midiIn, midiChanNum, identSuffix) {
    var ident = 0;
    return (cc, bindableAction) => {
       var id = "knob_" + ident + "_" + cc + "_" + identSuffix;
       var knob = hdwSurface.createRelativeHardwareKnob(id);
       knob.setAdjustValueMatcher(midiIn.createRelativeBinOffsetCCValueMatcher(midiChanNum, cc, FULL_KNOB_ROTATION_VALUE));
       bindableAction.addBinding(knob);
       ident += 1;
       return knob;
    };   
 }
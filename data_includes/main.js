// This is a PCIbex implementation of the English phoneme categorization task, inspired by Lab 1 in Colin Phillips' Psycholinguistics I class.
// The present version was co-developed by Emily Knick and Brian Dillon in May 2023. It implements the Visual Analog Scale task of Apfelbaum et al. (2022)

// The stimuli were created by Emily Knick. If you use the stimuli, please credit Emily directly.

PennController.ResetPrefix(null) // Shorten command names (keep this)
PennController.DebugOff()

// Resources are hosted as ZIP files on a distant server

Sequence("check","instructions","modelD","modelT",
            randomize("main.trial") ,
           randomize("main.trial") ,
           randomize("main.trial") ,
            randomize("main.trial") ,
            randomize("main.trial") ,
            randomize("main.trial") ,
            randomize("main.trial") ,
            randomize("main.trial") ,
            randomize("main.trial") ,
            randomize("main.trial") ,
             "send" , "end" )

// Headphone check: from https://www.pcibex.net/forums/topic/html-code-with-embedded-script/
// The Farm's jQuery library is outdated, we need to polyfill a couple methods
jQuery.prototype.on = function(...args) { return jQuery.prototype.bind.apply(this, args); }
jQuery.prototype.prop = function(...args) { return jQuery.prototype.attr.apply(this, args); }

// Let's dynamically load the HeadphoneCheck script
var HeadphoneCheckScriptTag = document.createElement("script");
HeadphoneCheckScriptTag.src = "https://s3.amazonaws.com/mcd-headphone-check/v1.0/src/HeadphoneCheck.min.js";
document.head.appendChild( HeadphoneCheckScriptTag );

newTrial(
    newButton("check", "Click here to do a headphone check before starting")
        .print()
    ,
    // This Canvas will contain the test itself
    newCanvas("headphonecheck", 500,500)
        .print()
    ,
    // The HeadphoneCheck module fills the element whose id is "hc-container"
    newFunction( () => getCanvas("headphonecheck")._element.jQueryElement.attr("id", "hc-container") ).call()
    ,
    getButton("check")
        .wait()
        .remove()
    ,
    // Create this Text element, but don't print it just yet
    newText("failure", "Sorry, you failed the headphone check. Please plug in headphones and try again.")
    ,
    // This is where it all happens
    newFunction( () => {
        $(document).on('hcHeadphoneCheckEnd', function(event, data) {
            getCanvas("headphonecheck").remove()._runPromises();
            if (data.didPass) getButton("dummy").click()._runPromises();
            else getText("failure").print()._runPromises()
        });
        HeadphoneCheck.runHeadphoneCheck() 
    }).call()
    ,
    // This is an invisible button that's clicked in the function above upon success
    newButton("dummy").wait()
)

// Welcome page: we do a first calibration here---meanwhile, the resources are preloading

newTrial("instructions",

    fullscreen(),
    
    newText(`<p>Welcome! In this experiment, you will hear English consonant sounds. </p><p> You will hear a sound, and you will asked to evaluate what sound you heard.</p><p>
            You will see a slider on the screen with "T" on one side, and "D" on the other side.</p><p>
            If you hear a "T", move the slider towards the "T".</p><p>
            If you hear a "D", move the slider towards the "D".</p><p>
            You might be uncertain about what you heard. Use the slider to indicate how "T"-like or "D"-like the sound you heard was.</p><p>
            Try to respond as accurately and quickly as possible. If you wait more than 6 seconds, you will not be able to respond, and the next sound will be played.</p><p>
            Before you begin, you will have a chance to hear a model of these sounds.</p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%")
    ,
    newButton("Click when you are ready to begin")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
        .wait()
        .remove()
);

newTrial("modelD",

    newAudio("d","0mss97.wav"),
    newKey("play-d", "F")
    .settings.callback(
        getAudio("d")
        .play("once")
        .remove()
        ),
    newText(`<p>This is the "D" model.</p><p>
            You may listen to it by pressing the 'f' key.</p><p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%")

    ,
    newButton("I'm ready to move on")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
        .wait()
        .remove()
);

newTrial("modelT",

    newAudio("t","60mss97.wav"),
    newKey("play-t", "J")
    .settings.callback(
        getAudio("t")
        .play("once")
        .remove()
        ),
    newText(`<p>This is the "T" model.</p><p>
            You may listen to it by pressing the 'j' key.</p><p>`)
            .css("font-family", "Helvetica, sans-serif")
            .css("font-size", "16px")
            .print("center at 50%", "middle at 50%")

    ,
    newButton("I'm ready to move on")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
        .wait()
        .remove()
);


Template( "English_ID.csv",
    currentrow => 
    newTrial("main.trial",
            
    newTimer("wait", 1000)
        .start()
        .wait(),
        
    newTimer("deadline", 6000)
        .start(),

    newVar("RT").global().set( v => Date.now() ),

    newAudio("cur.trial",currentrow.FILE).play("once"),

    newText("prompt", "This sounds like...")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "24px")
        .center()
        .print("center at 50%", "top at 20%"),

    newText("left", "T   ")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "48px"),
    newText("right", "   D")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "48px"),

    newScale("response", 100)
        .center()
        .slider()
        .before( getText("left") )
        .after( getText("right") )
        .print("center at 50%", "middle at 50%")
        .log('last')
        .wait(),
    
    newButton("confirm", "Confirm my response!")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
        .callback( getTimer("deadline").stop()  )
        .callback( getVar("RT").set( v => Date.now() - v ))
        ,
    
    getTimer("deadline")
        .wait()  
    
    )
  .log( "VOT"   , currentrow.VOT)
  .log( "RT"   ,getVar("RT") )
);

SendResults("send");

newTrial("end",
    exitFullscreen()
    ,
    newText("The is the end of the experiment, you can now close this window. Thank you!")
        .css("font-family", "Helvetica, sans-serif")
        .css("font-size", "16px")
        .center()
        .print("center at 50%", "bottom at 80%")
    ,
    newButton("waitforever").wait() // Not printed: wait on this page forever
)
.setOption("countsForProgressBar",false);

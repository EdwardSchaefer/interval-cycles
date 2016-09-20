var equalTemp = 12;
var currentNote = 0;
var isDown = false;

//initializes variables and determines if the mouse is clicked or not
$(document)
  .ready(function() {
    tableMaker(equalTemp);
    armSynth();
    context = new window.AudioContext() //synthesizer
    referencePitchHz = 440;
    referencePitchN = 49;
    osc1 = context.createOscillator();
    osc1.type ="square";
    gain = context.createGain();
    gain.connect(context.destination);
    gain.gain.value = 0;
    osc1.start(0)
    osc1.connect(gain);
    })
  .mousedown(function(){
      isDown = true;
      console.log(isDown)
  })
  .mouseup(function(){
      isDown = false;
      console.log(isDown)
  })


//Creates a table of notes based on the selected temperament using nested for loops.
//Also calls the colorize function.
var tableMaker = function(equalTemp){
  var i = 0;
  var j = 0;
  var noteID = 0;
  var currentNote = 0;
    for( i = 0; i <= equalTemp; i++){
      $('.noteTable tr:last').after("<tr><td>0</td></tr>");
      $('.noteTable td:last').prop('class', 0)
      $('.noteTable td:last').prop('id', noteID)
      noteID++;
      for( j = 0; j < equalTemp; j++){
        var currentNote = (i + (i * j))
        if (currentNote === equalTemp){
          $('.noteTable td:last').after("<td>0</td>");
          $('.noteTable td:last').prop('class', 0)
          $('.noteTable td:last').prop('id', noteID)
          noteID++;
        }
        else if(currentNote > equalTemp){
          $('.noteTable td:last').after("<td>" + (currentNote % equalTemp) + "</td>");
          $('.noteTable td:last').prop('class', (currentNote % equalTemp));
          $('.noteTable td:last').prop('id', noteID)
          noteID++;
        }
        else
        {
          $('.noteTable td:last').after("<td>" + (i + (i * j)) + "</td>");
          $('.noteTable td:last').prop('class', (i + (i *j)));
          $('.noteTable td:last').prop('id', noteID)
          noteID++;
        };
      };
    };
    colorize();
  };

//Deletes the table to make room for a new table.
var tableDeleter = function(){
  $(".noteTable tr:gt(0)").detach();
  delete noteArray;
};

//Calculates the pitch of the note and plays it if the mouse is clicked and over the note.
function armSynth(){
  $(".noteTable td")
    .mouseover( 
      function() {
      var desiredPitchN = ((parseInt(this.innerHTML))) + 49;
      var equalTempNthRootOfTwo = Math.pow(2, (1/equalTemp));
      var desiredPitchNMinusReferencePitchN = (desiredPitchN - referencePitchN);
      var productQ = Math.pow(equalTempNthRootOfTwo, desiredPitchNMinusReferencePitchN);
      var desiredPitchHz = (referencePitchHz * productQ);
      osc1.frequency.value = desiredPitchHz;
      console.log(desiredPitchHz)
      if (isDown === true)
      {
        gain.gain.value = 100;
        console.log(isDown);
      }
      else
      {
        console.log(isDown);
      }
    })
    .mouseleave(function(){
      gain.gain.value = 0;
    })
    .mouseup(function(){
      gain.gain.value = 0;
    })
    .mousedown(function(){
      gain.gain.value = 100;
    })
  };

//Colors the notes of the table based on the interval.
function colorize(){
  for( k = 0; k <= equalTemp; k += 1){
    var selfColor = Math.floor((360 / equalTemp * k) % 360);
    $("." + k).css("backgroundColor", "hsl(" + (selfColor / 1) + ", 100%, 75%");  //rainbow
  };
};

//Changes the temperament to the one selected by the user.
function newTemp() {
    equalTemp = document.getElementById("selectTemp").selectedIndex + 3; //plus whatever the lowest value is
    tableDeleter();
    tableMaker(equalTemp);
    armSynth();
}